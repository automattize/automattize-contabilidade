// ============================================================
// AUTOMATTIZE CONTABILIDADE – SECURITY LAYER
// Camadas: XSS, Rate Limit, CNPJ, Email, Honeypot, Sanitização
// ============================================================

// ── CAMADA 1: SANITIZAÇÃO E PROTEÇÃO XSS ────────────────────
export function sanitize(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/[^\w\s\-.,@/()\u00C0-\u00FF]/g, "") // permite apenas chars legítimos + acentos
    .trim();
}

export function sanitizeText(value: string, maxLength = 100): string {
  if (!value) return "";
  return sanitize(value).slice(0, maxLength);
}

// ── CAMADA 2: VALIDAÇÕES DE FORMATO ─────────────────────────

// Valida e-mail com regex rigoroso
export function isValidEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim()) && email.length <= 254;
}

// Valida telefone brasileiro (10 ou 11 dígitos)
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

// Valida CNPJ com dígitos verificadores reais
export function isValidCNPJ(cnpj: string): boolean {
  const c = cnpj.replace(/\D/g, "");
  if (c.length !== 14) return false;
  if (/^(\d)\1+$/.test(c)) return false; // todos dígitos iguais

  const calc = (c: string, len: number) => {
    let sum = 0;
    let pos = len - 7;
    for (let i = len; i >= 1; i--) {
      sum += parseInt(c[len - i]) * pos--;
      if (pos < 2) pos = 9;
    }
    const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return result;
  };

  const d1 = calc(c, 12);
  if (d1 !== parseInt(c[12])) return false;
  const d2 = calc(c, 13);
  if (d2 !== parseInt(c[13])) return false;

  return true;
}

// Valida nome (sem números, sem scripts)
export function isValidName(name: string): boolean {
  if (name.trim().length < 3) return false;
  if (name.trim().length > 100) return false;
  if (/<|>|script|javascript|onerror|onload/i.test(name)) return false;
  return true;
}

// ── CAMADA 3: RATE LIMITING NO FRONTEND ─────────────────────
const RATE_LIMIT_KEY = "automattize_form_attempts";
const RATE_LIMIT_MAX = 3;      // máximo de envios
const RATE_LIMIT_WINDOW = 3600000; // 1 hora em ms

interface RateLimitData {
  count: number;
  firstAttempt: number;
}

export function checkRateLimit(): { allowed: boolean; minutesLeft: number } {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    const now = Date.now();

    if (!raw) {
      sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, firstAttempt: now }));
      return { allowed: true, minutesLeft: 0 };
    }

    const data: RateLimitData = JSON.parse(raw);

    // Janela expirou — reset
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
      sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, firstAttempt: now }));
      return { allowed: true, minutesLeft: 0 };
    }

    if (data.count >= RATE_LIMIT_MAX) {
      const msLeft = RATE_LIMIT_WINDOW - (now - data.firstAttempt);
      const minutesLeft = Math.ceil(msLeft / 60000);
      return { allowed: false, minutesLeft };
    }

    data.count += 1;
    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
    return { allowed: true, minutesLeft: 0 };
  } catch {
    return { allowed: true, minutesLeft: 0 };
  }
}

// ── CAMADA 4: HONEYPOT ANTI-BOT ─────────────────────────────
// Campo invisível — bots preenchem, humanos não
export const HONEYPOT_FIELD = "website"; // nome genérico que bots adoram

export function isBot(honeypotValue: string): boolean {
  return honeypotValue.trim().length > 0;
}

// ── CAMADA 5: DETECÇÃO DE CONTEÚDO MALICIOSO ────────────────
const MALICIOUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,       // onerror=, onload=, etc
  /\bSELECT\b.*\bFROM\b/i,
  /\bINSERT\b.*\bINTO\b/i,
  /\bDROP\b.*\bTABLE\b/i,
  /\bUNION\b.*\bSELECT\b/i,
  /--\s*$/,            // SQL comment
  /\/\*.*\*\//,        // SQL block comment
  /\bexec\b/i,
  /\beval\b/i,
  /base64/i,
  /data:text\/html/i,
];

export function containsMaliciousContent(value: string): boolean {
  return MALICIOUS_PATTERNS.some((pattern) => pattern.test(value));
}

export function validateAllFields(fields: Record<string, string>): string | null {
  for (const [, value] of Object.entries(fields)) {
    if (containsMaliciousContent(value)) {
      return "Conteúdo inválido detectado. Verifique os campos e tente novamente.";
    }
  }
  return null;
}

// ── CAMADA 6: LIMITES DE TAMANHO DOS INPUTS ─────────────────
export const INPUT_LIMITS = {
  nome: 100,
  email: 254,
  telefone: 16,
  cnpj: 18,
  faturamento: 20,
  funcionarios: 6,
} as const;

export function enforceLimit(value: string, field: keyof typeof INPUT_LIMITS): string {
  return value.slice(0, INPUT_LIMITS[field]);
}

// ── HELPER: VALIDAÇÃO COMPLETA DO FORMULÁRIO ────────────────
export interface FormData {
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  faturamento: string;
  funcionarios: string;
}

export interface ValidationResult {
  valid: boolean;
  error: string;
}

export function validateForm(
  form: FormData,
  servicos: string[],
  honeypot: string
): ValidationResult {
  // Honeypot
  if (isBot(honeypot)) {
    return { valid: false, error: "Envio bloqueado. Tente novamente." };
  }

  // Rate limit
  const rate = checkRateLimit();
  if (!rate.allowed) {
    return {
      valid: false,
      error: `Muitas tentativas. Aguarde ${rate.minutesLeft} minuto(s) para tentar novamente.`,
    };
  }

  // Serviços
  if (servicos.length === 0) {
    return { valid: false, error: "Selecione pelo menos um serviço de interesse." };
  }

  // Nome
  if (!form.nome.trim()) {
    return { valid: false, error: "O nome do sócio / solicitante é obrigatório." };
  }
  if (!isValidName(form.nome)) {
    return { valid: false, error: "Nome inválido. Mínimo 3 caracteres, sem caracteres especiais." };
  }

  // Telefone
  if (!form.telefone.trim()) {
    return { valid: false, error: "O telefone / celular é obrigatório." };
  }
  if (!isValidPhone(form.telefone)) {
    return { valid: false, error: "Telefone inválido. Use o formato (61) 99999-9999." };
  }

  // Email
  if (!form.email.trim()) {
    return { valid: false, error: "O e-mail é obrigatório." };
  }
  if (!isValidEmail(form.email)) {
    return { valid: false, error: "E-mail inválido. Verifique o formato." };
  }

  // CNPJ (opcional mas se preenchido valida)
  if (form.cnpj.trim() && !isValidCNPJ(form.cnpj)) {
    return { valid: false, error: "CNPJ inválido. Verifique os dígitos informados." };
  }

  // Conteúdo malicioso
  const maliciousCheck = validateAllFields({
    nome: form.nome,
    email: form.email,
    telefone: form.telefone,
    cnpj: form.cnpj,
    faturamento: form.faturamento,
    funcionarios: form.funcionarios,
  });
  if (maliciousCheck) {
    return { valid: false, error: maliciousCheck };
  }

  return { valid: true, error: "" };
}
