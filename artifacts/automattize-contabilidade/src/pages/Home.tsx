import { useState, useEffect, useRef } from "react";

const BASE = import.meta.env.BASE_URL;
const API = "/api";

function Logo({ size = 36 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img
        src={`${BASE}logo-nobg.png`}
        alt="Logo"
        style={{ width: size, height: size, objectFit: "contain" }}
      />
      <div>
        <div
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "0.5px",
            color: "#fff",
            lineHeight: 1.1,
          }}
        >
          AUTOMATTIZE
        </div>
        <div
          style={{
            fontFamily: "'Montserrat',sans-serif",
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: "2.5px",
            color: "#60a5fa",
            textTransform: "uppercase",
          }}
        >
          CONTABILIDADE
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── PROPOSTA DRAWER ── */
function PropostaDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const [servicos, setServicos] = useState<string[]>([]);
  const [regime, setRegime] = useState("");
  const [movimentacao, setMovimentacao] = useState("");
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    cnpj: "",
    faturamento: "",
    funcionarios: "",
  });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleServico = (s: string) =>
    setServicos((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (servicos.length === 0) {
      setError("Selecione pelo menos um serviço de interesse para continuar.");
      return;
}
    if (!form.nome.trim()) {
      setError("O nome do sócio / solicitante é obrigatório.");
      return;
    }
    if (!form.telefone.trim()) {
      setError("O telefone / celular é obrigatório.");
      return;
    }
    if (!form.email.trim()) {
      setError("O e-mail é obrigatório.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("https://formspree.io/f/xaqplgav", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    data: new Date().toISOString().split("T")[0],
    servicos: servicos.join(", "),
    nome: form.nome,
    telefone: form.telefone || "",
    email: form.email,
    cnpj: form.cnpj || "",
    regime_tributario: regime || "",
    faturamento_mensal: form.faturamento || "",
    funcionarios: form.funcionarios || "",
    movimentacao_financeira: movimentacao || "",
  }),
});
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error || "Erro ao enviar.",
        );
      }
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro. Tente novamente.",
      );
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "inherit",
    color: "#0a1628",
    background: "#fff",
    outline: "none",
    transition: "border-color 0.2s",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Montserrat',sans-serif",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#475569",
    display: "block",
    marginBottom: 6,
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: 1100,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s",
        }}
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(480px, 100vw)",
          background: "#fff",
          zIndex: 1200,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#0a1628",
            padding: "28px 28px 20px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}
              >
                SOLICITAR
                <br />
                PROPOSTA
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.5,
                }}
              >
                Preencha os dados e receba uma proposta personalizada em até
                24h.
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 8,
                width: 36,
                height: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginLeft: 16,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2.5"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ marginBottom: 20 }}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="1.5"
                  style={{ margin: "0 auto", display: "block" }}
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#0a1628",
                  marginBottom: 8,
                }}
              >
                Proposta Enviada com Sucesso!
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#475569",
                  lineHeight: 1.6,
                  marginBottom: 6,
                }}
              >
                Recebemos sua solicitação. Nossa equipe entrará em contato em
                até <strong>24 horas úteis</strong> com uma proposta
                personalizada para o seu negócio.
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#ecfdf5",
                  border: "1px solid #bbf7d0",
                  borderRadius: 8,
                  padding: "8px 14px",
                  marginTop: 4,
                  marginBottom: 8,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span
                  style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}
                >
                  Dados salvos com sucesso
                </span>
              </div>
              <button
                onClick={() => {
                  setDone(false);
                  setServicos([]);
                  setRegime("");
                  setMovimentacao("");
                  setForm({ nome: "", email: "", cnpj: "", faturamento: "" });
                }}
                style={{
                  marginTop: 24,
                  padding: "10px 24px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 1,
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                Nova Solicitação
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: -6 }}>
                <span style={{ color: "#dc2626", fontWeight: 700 }}>*</span>{" "}
                Campos obrigatórios
              </p>
              {/* Data */}
              <div>
                <label style={labelStyle}>Data</label>
                <div
                  style={{
                    ...inputStyle,
                    color: "#64748b",
                    background: "#f8fafc",
                    cursor: "default",
                  }}
                >
                  {today}
                </div>
              </div>

              {/* Serviços */}
              <div>
                <label style={labelStyle}>
                  <span style={{ color: "#dc2626" }}>*</span> Serviços de
                  Interesse{" "}
                  <span
                    style={{ color: "#94a3b8", fontWeight: 400, fontSize: 9 }}
                  >
                    (selecione um ou mais)
                  </span>
                </label>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {[
                    "Contabilidade (Contábil, Fiscal e Pessoal)",
                    "BPO Financeiro",
                    "Abertura de Empresa",
                    "Alterações ou Baixas de Empresa",
                  ].map((s) => (
                    <label
                      key={s}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        padding: "9px 14px",
                        border: `1.5px solid ${servicos.includes(s) ? "#2563eb" : "#e2e8f0"}`,
                        borderRadius: 8,
                        background: servicos.includes(s)
                          ? "#eff6ff"
                          : "#fafafa",
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          border: `2px solid ${servicos.includes(s) ? "#2563eb" : "#d1d5db"}`,
                          borderRadius: 4,
                          background: servicos.includes(s) ? "#2563eb" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.15s",
                        }}
                      >
                        {servicos.includes(s) && (
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={servicos.includes(s)}
                        onChange={() => toggleServico(s)}
                        style={{ display: "none" }}
                      />
                      <span style={{ fontSize: 14, color: "#0a1628" }}>
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nome */}
              <div>
                <label style={labelStyle}>
                  <span style={{ color: "#dc2626" }}>*</span> Nome do Sócio /
                  Solicitante
                </label>
                <input
                  type="text"
                  placeholder="Nome completo"
                  required
                  value={form.nome}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nome: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>

              {/* Telefone */}
              <div>
                <label style={labelStyle}>
                  <span style={{ color: "#dc2626" }}>*</span> Telefone / Celular
                </label>
                <input
                  type="text"
                  placeholder="(61) 99180-4169"
                  value={form.telefone}
                  onChange={(e) => {
                    let digits = e.target.value.replace(/\D/g, "");
                    if (digits.length > 11) digits = digits.slice(0, 11);
                    let v = digits;
                    if (digits.length <= 10) {
                      v = digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
                    } else {
                      v = digits.replace(/^(\d{2})(\d{5})(\d{0,4})$/, "($1) $2-$3");
                    }
                    setForm((p) => ({ ...p, telefone: v }));
                  }}
                  style={inputStyle}
                  maxLength={16}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>
                  <span style={{ color: "#dc2626" }}>*</span> E-mail
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>

              {/* CNPJ */}
              <div>
                <label style={labelStyle}>CNPJ</label>
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={form.cnpj}
                  onChange={(e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    if (v.length > 14) v = v.slice(0, 14);
                    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
                    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
                    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
                    v = v.replace(/(\d{4})(\d)/, "$1-$2");
                    setForm((p) => ({ ...p, cnpj: v }));
                  }}
                  style={inputStyle}
                  maxLength={18}
                />
              </div>

              {/* Regime */}
              <div>
                <label style={labelStyle}>Regime Tributário</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["Lucro Real", "Lucro Presumido", "Simples"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegime(r)}
                      style={{
                        padding: "9px 16px",
                        border: `1.5px solid ${regime === r ? "#2563eb" : "#e2e8f0"}`,
                        borderRadius: 8,
                        background: regime === r ? "#eff6ff" : "#fff",
                        color: regime === r ? "#2563eb" : "#475569",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Faturamento */}
              <div>
                <label style={labelStyle}>Faturamento Mensal (Média)</label>
                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={form.faturamento}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    if (!digits) {
                      setForm((p) => ({ ...p, faturamento: "" }));
                      return;
                    }
                    const num = parseInt(digits, 10) / 100;
                    const formatted =
                      "R$ " +
                      num.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      });
                    setForm((p) => ({ ...p, faturamento: formatted }));
                  }}
                  style={inputStyle}
                />
              </div>

              {/* Funcionários */}
              <div>
                <label style={labelStyle}>Funcionários (Quantidade)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.funcionarios}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, funcionarios: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>

              {/* Movimentação */}
              <div>
                <label style={labelStyle}>Movimentação Financeira</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Pequena", "Média", "Grande"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMovimentacao(m)}
                      style={{
                        flex: 1,
                        padding: "9px 0",
                        border: `1.5px solid ${movimentacao === m ? "#2563eb" : "#e2e8f0"}`,
                        borderRadius: 8,
                        background: movimentacao === m ? "#eff6ff" : "#fff",
                        color: movimentacao === m ? "#2563eb" : "#475569",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#dc2626",
                    padding: "10px 14px",
                    background: "#fef2f2",
                    borderRadius: 8,
                    border: "1px solid #fecaca",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                style={{
                  padding: "14px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 9,
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  marginTop: 4,
                  opacity: sending ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {sending ? "Enviando..." : "Solicitar Proposta →"}
              </button>
              <p
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  textAlign: "center",
                  marginTop: -8,
                }}
              >
                * Valores variam conforme tipo de serviço e tamanho das
                operações.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────── NAV ── */
const NAV_LINKS = [
  { href: "#quem-atendemos", label: "Quem Atendemos" },
  { href: "#servicos", label: "Serviços" },
  { href: "#bpo", label: "BPO Financeiro" },
  { href: "#jornada", label: "Jornada" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#ceo", label: "Equipe" },
  { href: "#contato", label: "Contato" },
];

function NavBar({ onProposta }: { onProposta: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        background: scrolled ? "rgba(10,22,40,0.98)" : "rgba(10,22,40,0.95)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(37,99,235,0.25)",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "'Montserrat',sans-serif",
        height: 64,
      }}
    >
      <a
        href="#"
        style={{ textDecoration: "none" }}
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <Logo size={34} />
      </a>

      <div
        style={{ display: "flex", alignItems: "center", gap: 0 }}
        className="nav-links-desktop"
      >
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => navClick(e, l.href)}
            style={{
              textDecoration: "none",
              color: "rgba(255,255,255,0.85)",
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.7px",
              textTransform: "uppercase",
              padding: "22px 13px",
              borderBottom: "2px solid transparent",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "#60a5fa";
              (e.target as HTMLElement).style.borderBottomColor = "#60a5fa";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "rgba(255,255,255,0.85)";
              (e.target as HTMLElement).style.borderBottomColor = "transparent";
            }}
          >
            {l.label}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onProposta}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontFamily: "'Montserrat',sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#2563eb")}
          className="btn-proposta-nav"
        >
          Solicitar Proposta
        </button>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="btn-menu-mobile"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "none",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
          >
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            background: "rgba(10,22,40,0.99)",
            borderBottom: "1px solid rgba(37,99,235,0.2)",
            zIndex: 998,
            padding: "4px 0",
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => navClick(e, l.href)}
              style={{
                display: "block",
                padding: "13px 24px",
                color: "rgba(255,255,255,0.88)",
                textDecoration: "none",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
                borderBottom: "1px solid rgba(37,99,235,0.1)",
              }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ padding: "12px 24px" }}>
            <button
              onClick={() => {
                onProposta();
                setMobileOpen(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Solicitar Proposta
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .btn-proposta-nav { display: none !important; }
          .btn-menu-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

/* ─────────────────────────────────────────── HERO ── */
function HeroSection({ onProposta }: { onProposta: () => void }) {
  return (
    <section
      id="inicio"
      style={{
        minHeight: "100vh",
        background: "#0a1628",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        paddingTop: 64,
      }}
    >
      {/* Ambient glows only — no grid */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          background:
            "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)",
          top: "-10%",
          right: "-10%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 65%)",
          bottom: "0%",
          left: "5%",
          pointerEvents: "none",
        }}
      />
      {/* Subtle diagonal lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(37,99,235,0.04) 0px, rgba(37,99,235,0.04) 1px, transparent 1px, transparent 80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
          width: "100%",
        }}
        className="hero-grid"
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(37,99,235,0.15)",
              border: "1px solid rgba(37,99,235,0.35)",
              borderRadius: 100,
              padding: "6px 16px",
              marginBottom: 32,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: "#60a5fa",
                borderRadius: "50%",
                display: "inline-block",
                animation: "heroPulse 2s infinite",
              }}
            />
            <span
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#60a5fa",
              }}
            >
              Contabilidade Digital
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: "clamp(40px, 5vw, 66px)",
              fontWeight: 900,
              lineHeight: 1.02,
              color: "#fff",
              letterSpacing: -2,
              marginBottom: 10,
            }}
          >
            AUTOMATTIZE
            <br />
            <span style={{ color: "#3b82f6" }}>CONTABILIDADE</span>
          </h1>
          <div
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 3.5,
              textTransform: "uppercase",
              color: "#5b7a9a",
              marginBottom: 28,
            }}
          >
            Precisão · Estratégia · Resultado
          </div>
          <div
            style={{
              width: 48,
              height: 3,
              background: "linear-gradient(90deg,#2563eb,#60a5fa)",
              borderRadius: 2,
              marginBottom: 28,
            }}
          />
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.85)",
              maxWidth: 460,
              marginBottom: 40,
            }}
          >
            Soluções contábeis, fiscais, trabalhistas e de{" "}
            <strong style={{ color: "#60a5fa" }}>BPO Financeiro</strong> para
            empresas que desejam crescer com{" "}
            <strong style={{ color: "#60a5fa" }}>
              planejamento, segurança e gestão eficiente
            </strong>
            .
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button
              onClick={onProposta}
              style={{
                background: "#2563eb",
                color: "#fff",
                padding: "14px 30px",
                borderRadius: 8,
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1d4ed8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#2563eb")
              }
            >
              Solicitar Proposta
            </button>
            <a
              href="#servicos"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#servicos")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                background: "transparent",
                color: "#fff",
                padding: "14px 30px",
                borderRadius: 8,
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                border: "1px solid rgba(255,255,255,0.25)",
                cursor: "pointer",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
            >
              Nossos Serviços
            </a>
          </div>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
          className="hero-right"
        >
          <div
            style={{
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
              height: 240,
            }}
          >
            <img
              src={`${BASE}dashboard.jpg`}
              alt="Dashboard"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(10,22,40,0.3) 0%, transparent 60%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                display: "flex",
                gap: 10,
              }}
            >
              {[].map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: "rgba(10,22,40,0.85)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 10,
                    padding: "10px 12px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      fontSize: 20,
                      fontWeight: 900,
                      color: "#60a5fa",
                      lineHeight: 1,
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      fontSize: 9,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.6)",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginTop: 4,
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {[
              {
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1.8"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "Compliance Total",
              },
              {
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1.8"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
                title: "Gestão Empresarial",
              },
              {
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: "Atendimento Humanizado",
              },
              {
                icon: (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1.8"
                  >
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
                title: "Redução de Custos",
              },
            ].map((c, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "16px 18px",
                }}
              >
                <div style={{ marginBottom: 8 }}>{c.icon}</div>
                <div
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#fff",
                    marginBottom: 3,
                  }}
                >
                  {c.title}
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes heroPulse { 0%,100%{opacity:1}50%{opacity:.4} }
        @media(max-width:900px){ .hero-grid{grid-template-columns:1fr!important;gap:32px!important} .hero-right{display:none!important} }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────── HELPERS ── */
function SectionLabel({
  text,
  light = false,
}: {
  text: string;
  light?: boolean;
}) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 28,
          height: 2,
          background: light ? "#60a5fa" : "#2563eb",
          borderRadius: 2,
        }}
      />
      <span
        style={{
          fontFamily: "'Montserrat',sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: light ? "#60a5fa" : "#2563eb",
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────── QUEM ATENDEMOS ── */
function QuemAtendemos() {
  const features = [
    {
      icon: "→",
      title: "Organização Contábil e Financeira",
      desc: "Clareza nos números, relatórios confiáveis e gestão profissional das finanças empresariais.",
    },
    {
      icon: "→",
      title: "Segurança Fiscal e Trabalhista",
      desc: "Compliance total, evitando multas, autuações e passivos ocultos nas operações.",
    },
    {
      icon: "→",
      title: "Informações para Decisão Estratégica",
      desc: "Dados gerenciais precisos e relatórios para tomada de decisão embasada.",
    },
    {
      icon: "→",
      title: "Estrutura Financeira Profissional",
      desc: "Implementação de processos e ferramentas para uma gestão financeira robusta e escalável.",
    },
  ];
  return (
    <section
      id="quem-atendemos"
      style={{ background: "#fff", padding: "80px 40px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
          className="quem-grid"
        >
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.12)",
              position: "relative",
            }}
          >
            <img
              src={`${BASE}tablet.jpg`}
              alt="Tablet"
              style={{
                width: "100%",
                height: 380,
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                background: "#2563eb",
                color: "#fff",
                borderRadius: 10,
                padding: "12px 20px",
              }}
            >
              <strong
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  display: "block",
                }}
              >
                Lucro Real, Presumido, Simples e BPO Financeiro
              </strong>
              <span style={{ fontSize: 12, opacity: 0.8 }}>
                Nosso foco principal
              </span>
            </div>
          </div>
          <div>
            <SectionLabel text="Quem Atendemos" />
            <h2
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 36,
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#0a1628",
                marginBottom: 16,
                letterSpacing: -0.5,
              }}
            >
              Empresas que precisam de{" "}
              <span style={{ color: "#2563eb" }}>mais do que um contador</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#475569" }}>
              Atendemos microempresas, empresas de pequeno porte e autônomos que
              desejam profissionalizar sua gestão contábil ou financeira, com um
              parceiro estratégico ao lado.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginTop: 28,
              }}
            >
              {features.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "16px 18px",
                    borderRadius: 10,
                    background: "#f8fafc",
                    borderLeft: "3px solid #2563eb",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "'Montserrat',sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0a1628",
                        marginBottom: 3,
                      }}
                    >
                      {f.title}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#64748b",
                        lineHeight: 1.5,
                      }}
                    >
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.quem-grid{grid-template-columns:1fr!important;gap:32px!important}}`}</style>
    </section>
  );
}

/* ─────────────────────────────────────────── SERVIÇOS (redesigned) ── */
function Servicos() {
  const services = [
    {
      num: "01",
      color: "#2563eb",
      bg: "#eff6ff",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.6"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      area: "Contábil",
      tagline: "A base de tudo que você precisa saber sobre seu negócio",
      items: [
        "Escrituração Contábil",
        "Balanço Patrimonial e DRE",
        "Livros Contábeis",
        "Obrigações Acessórias",
      ],
    },
    {
      num: "02",
      color: "#7c3aed",
      bg: "#f5f3ff",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="1.6"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      ),
      area: "Fiscal",
      tagline: "Conformidade tributária com estratégia para pagar menos",
      items: [
        "Apuração de Impostos e Tributos",
        "Emissão e Gestão de NF-e / NFS-e",
        "Planejamento Tributário Estratégico",
        "Obrigações Acessórias",
      ],
    },
    {
      num: "03",
      color: "#059669",
      bg: "#ecfdf5",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#059669"
          strokeWidth="1.6"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        </svg>
      ),
      area: "Departamento Pessoal",
      tagline: "Folha de pagamento sem erros e sem preocupações",
      items: [
        "Folha de Pagamento e Encargos",
        "Férias, 13º Salário e Rescisões",
        "ESocial e Admissões",
        "Obrigações Acessórias",
      ],
    },
    {
      num: "04",
      color: "#ea580c",
      bg: "#fff7ed",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ea580c"
          strokeWidth="1.6"
        >
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      ),
      area: "Societário",
      tagline: "Da abertura ao crescimento, sua empresa regularizada",
      items: [
        "Abertura de ME, EPP e LTDA",
        "Alterações e Baixas",
        "Regularização de CNPJ e Alvará",
        "Obrigações Acessórias",
        "Honorários cobrados à parte para serviços societários.",
      ],
    },
  ];

  return (
    <section
      id="servicos"
      style={{ background: "#f8fafc", padding: "80px 40px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <SectionLabel text="Nossos Serviços" />
          <h2
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: 36,
              fontWeight: 800,
              color: "#0a1628",
              letterSpacing: -0.5,
              marginBottom: 12,
            }}
          >
            Departamentos de <span style={{ color: "#2563eb" }}>Atuação</span>
          </h2>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: "#475569",
              maxWidth: 560,
            }}
          >
            Equipe especializada em cada área para garantir conformidade,
            organização e resultados reais para o seu negócio.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
          className="serv-grid"
        >
          {services.map((s, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                transition: "all 0.25s",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 12px 40px rgba(0,0,0,0.1)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 2px 16px rgba(0,0,0,0.04)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
              }}
            >
              {/* Top accent bar */}
              <div style={{ height: 4, background: s.color }} />
              <div
                style={{
                  padding: "24px 28px",
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                }}
              >
                {/* Number */}
                <div
                  style={{
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: 42,
                    fontWeight: 900,
                    color: s.color,
                    opacity: 0.12,
                    lineHeight: 1,
                    flexShrink: 0,
                    userSelect: "none",
                  }}
                >
                  {s.num}
                </div>
                <div style={{ flex: 1 }}>
                  {/* Icon + Area */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        background: s.bg,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Montserrat',sans-serif",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                          color: "#94a3b8",
                          marginBottom: 2,
                        }}
                      >
                        Departamento
                      </div>
                      <div
                        style={{
                          fontFamily: "'Montserrat',sans-serif",
                          fontSize: 17,
                          fontWeight: 800,
                          color: "#0a1628",
                        }}
                      >
                        {s.area}
                      </div>
                    </div>
                  </div>
                  {/* Tagline */}
                  <p
                    style={{
                      fontSize: 13,
                      color: "#64748b",
                      lineHeight: 1.5,
                      marginBottom: 16,
                      fontStyle: "italic",
                    }}
                  >
                    {s.tagline}
                  </p>
                  {/* Items */}
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {s.items.map((item, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          fontSize: 13,
                          color: "#334155",
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: s.color,
                            flexShrink: 0,
                          }}
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:700px){.serv-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ─────────────────────────────────────────── BPO ── */
function BPOSection() {
  const plans = [
    {
      tier: "Plano",
      name: "Essencial",
      items: [
        "Conciliação Bancária/Financeira Mensal",
        "Auxílio na Emissão de NF e Boletos",
        "Suporte por e-mail e Whatsapp",
      ],
    },
    {
      tier: "Plano",
      name: "Profissional",
      featured: true,
      badge: "Mais Popular",
      items: [
        "Tudo do Essencial",
        "Gerenciamento de Contas a Pagar e Receber",
        "Relatórios Financeiros",
        "Emissão de NF e Boletos",
        "Reunião Mensal de Resultados",
      ],
    },
    {
      tier: "Plano",
      name: "Estratégico",
      items: [
        "Tudo do Profissional",
        "Dashboard com Gráficos",
        "Análise dos Indicadores",
        "Agendamento de Pagamentos",
        "Reunião Quinzenal de Resultados",
      ],
    },
  ];
  return (
    <section
      id="bpo"
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0f2550 100%)",
        padding: "80px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 65%)",
          top: "-20%",
          right: "-5%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
            marginBottom: 60,
          }}
          className="bpo-intro"
        >
          <div>
            <SectionLabel text="BPO Financeiro" light />
            <h2
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 36,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -0.5,
                marginBottom: 16,
              }}
            >
              Terceirização{" "}
              <span style={{ color: "#3b82f6" }}>Financeira</span>{" "}
            </h2>
            <blockquote
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.9)",
                borderLeft: "3px solid #3b82f6",
                paddingLeft: 24,
                margin: "24px 0",
                fontStyle: "Montserrat',sans-serif",
              }}
            >
              Transforme a{" "}
              <strong style={{ color: "#60a5fa" }}>gestão financeira</strong> da
              sua empresa com{" "}
              <strong style={{ color: "#60a5fa" }}>
                informações organizadas
              </strong>
              , controle total do{" "}
              <strong style={{ color: "#60a5fa" }}>
                fluxo de caixa e relatórios estratégicos
              </strong>{" "}
              que apoiam{" "}
              <strong style={{ color: "#60a5fa" }}>
                decisões mais seguras e inteligentes
              </strong>{" "}
              para o crescimento do negócio.
            </blockquote>
            <div
              style={{
                background: "rgba(37,99,235,0.15)",
                border: "1px solid rgba(37,99,235,0.35)",
                borderRadius: 10,
                padding: "14px 18px",
                fontSize: 13,
                color: "#93c5fd",
                lineHeight: 1.6,
              }}
            >
              BPO Financeiro é a terceirização parcial da gestão financeira da
              empresa, permitindo que você concentre seus esforços no
              crescimento do negócio com informações seguras e organizadas.
            </div>
          </div>
          <div
            style={{
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={`${BASE}paperwork.jpg`}
              alt="BPO"
              style={{
                width: "100%",
                height: 340,
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 32,
          }}
          className="bpo-plans"
        >
          {plans.map((p, i) => (
            <div
              key={i}
              style={{
                background: p.featured
                  ? "rgba(37,99,235,0.2)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${p.featured ? "#2563eb" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 14,
                padding: 28,
                position: "relative",
                transition: "all 0.25s",
              }}
            >
              {p.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#2563eb",
                    color: "#fff",
                    fontFamily: "'Montserrat',sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    padding: "4px 14px",
                    borderRadius: 100,
                  }}
                >
                  {p.badge}
                </div>
              )}
              <div
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: 6,
                }}
              >
                {p.tier}
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 20,
                }}
              >
                {p.name}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {p.items.map((item, j) => (
                  <div
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.88)",
                      padding: "7px 0",
                      borderBottom:
                        j < p.items.length - 1
                          ? "1px solid rgba(255,255,255,0.07)"
                          : "none",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                      style={{ flexShrink: 0, marginTop: 1 }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "rgba(30,58,138,0.5)",
            border: "1px solid rgba(96,165,250,0.5)",
            borderRadius: 10,
            padding: "18px 24px",
          }}
        >
          <div
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: 12,
              fontWeight: 800,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            Transparência dos Honorários
          </div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[
              "Valores conforme complexidade operacional",
              "Análise personalizada antes da proposta",
              "A AUTOMATTIZE não realiza nenhum tipo de movimentação financeira",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#fff",
                  fontWeight: 500,
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:900px){.bpo-intro{grid-template-columns:1fr!important;gap:32px!important}.bpo-plans{grid-template-columns:1fr!important}}
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────── JORNADA ── */
function JornadaSection() {
  const steps = [
    {
      side: "left",
      tag: "ONBOARDING",
      tagColor: "#2563eb",
      title: "Bem-Vindo!",
      desc: "Assim que você se torna cliente da AUTOMATTIZE, passa por um processo de ONBOARDING: reunião, orientação inicial, mapeamento da área e configuração das rotinas e demandas mensais.",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" />
        </svg>
      ),
      iconBg: "#2563eb",
      stepLabel: "Primeiro Passo",
      stepSub: "Iniciando sua jornada Automattize",
    },
    {
      side: "right",
      tag: "ATENDIMENTO",
      tagColor: "#7c3aed",
      title: "Operação Contínua!",
      desc: "Sua empresa terá acesso a um contador responsável dedicado, canais de atendimento e suporte dentro do horário comercial. Seu objetivo é garantir que todas as demandas contábeis, fiscais e trabalhistas e/ou financeiras sejam resolvidas com precisão e agilidade.",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      iconBg: "#7c3aed",
      stepLabel: "Segundo Passo",
      stepSub: "Atendimento especializado contínuo",
    },
    {
      side: "left",
      tag: "CUSTOMER SUCCESS",
      tagColor: "#059669",
      title: "Sua Experiência!",
      desc: "Avaliação de sua satisfação e os resultados entregues. Reuniões periódicas, análise de indicadores e proatividade nas orientações estratégicas — porque queremos ser o parceiro que seu negócio precisa para crescer.",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      iconBg: "#059669",
      stepLabel: "Terceiro Passo",
      stepSub: "Crescimento e avaliação contínua",
    },
  ];

  return (
    <section
      id="jornada"
      style={{ background: "#f8fafc", padding: "80px 40px" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionLabel text="Jornada do Cliente" />
          <h2
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: 36,
              fontWeight: 800,
              color: "#0a1628",
              letterSpacing: -0.5,
            }}
          >
            Fluxo de Jornada
            <br />
            na <span style={{ color: "#2563eb" }}>AUTOMATTIZE</span>
          </h2>
        </div>

        <div style={{ position: "relative" }}>
          {/* Center line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 2,
              background: "linear-gradient(180deg,#2563eb,#7c3aed,#059669)",
              transform: "translateX(-50%)",
              opacity: 0.25,
            }}
            className="jornada-line"
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {steps.map((step, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 60px 1fr",
                  alignItems: "center",
                  marginBottom: i < steps.length - 1 ? 0 : 0,
                }}
                className="jornada-row"
              >
                {/* Left content */}
                <div
                  className="jornada-left"
                  style={{
                    padding: "24px 40px 24px 0",
                    display: step.side === "left" ? "block" : "block",
                    opacity: step.side === "left" ? 1 : 0,
                    pointerEvents: step.side === "left" ? "auto" : "none",
                  }}
                >
                  {step.side === "left" && (
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: 28,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Montserrat',sans-serif",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: 2,
                          color: step.tagColor,
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        {step.tag}
                      </div>
                      <h3
                        style={{
                          fontFamily: "'Montserrat',sans-serif",
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#0a1628",
                          marginBottom: 12,
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 13.5,
                          color: "#475569",
                          lineHeight: 1.65,
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  )}
                </div>

                {/* Center dot */}
                <div
                  className="jornada-dot"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 2,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: step.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 0 6px ${step.iconBg}25`,
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Right content */}
                <div className="jornada-right" style={{ padding: "24px 0 24px 40px" }}>
                  {step.side === "right" ? (
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 16,
                        padding: 28,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Montserrat',sans-serif",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: 2,
                          color: step.tagColor,
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        {step.tag}
                      </div>
                      <h3
                        style={{
                          fontFamily: "'Montserrat',sans-serif",
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#0a1628",
                          marginBottom: 12,
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 13.5,
                          color: "#475569",
                          lineHeight: 1.65,
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  ) : (
                    <div className="jornada-step-label" style={{ textAlign: "left" }}>
                      <div
                        style={{
                          fontFamily: "'Montserrat',sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0a1628",
                        }}
                      >
                        {step.stepLabel}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}
                      >
                        {step.stepSub}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:700px){
          .jornada-line{display:none}
          .jornada-row{
            display:flex!important;
            flex-direction:column!important;
            align-items:flex-start!important;
            margin-bottom:28px!important;
          }
          .jornada-dot{order:0;padding-bottom:12px}
          .jornada-left{
            order:1;
            width:100%!important;
            padding:0 0 12px 0!important;
            opacity:1!important;
            pointer-events:auto!important;
          }
          .jornada-right{
            order:2;
            width:100%!important;
            padding:0!important;
          }
          .jornada-step-label{display:none!important}
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────── DIFERENCIAIS ── */
function Diferenciais() {
  const diffs = [
    {
      color: "#2563eb",
      bg: "#eff6ff",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2563eb"
          strokeWidth="1.8"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: "Atendimento Humanizado",
      desc: "Você sempre terá um contador responsável pelo seu negócio — sem transferências infinitas ou respostas genéricas.",
    },
    {
      color: "#7c3aed",
      bg: "#f5f3ff",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="1.8"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: "Tecnologia",
      desc: "Softwares contábeis modernos e plataformas digitais para automatizar processos e entregar dados.",
    },
    {
      color: "#059669",
      bg: "#ecfdf5",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#059669"
          strokeWidth="1.8"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Compliance e Segurança",
      desc: "Máximo rigor legal e fiscal, garantindo que sua empresa esteja sempre em conformidade com as obrigações tributárias.",
    },
    {
      color: "#ea580c",
      bg: "#fff7ed",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ea580c"
          strokeWidth="1.8"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: "Redução de Custos",
      desc: "Terceirizar seu financeiro reduz custos operacionais em até 60% comparado a uma equipe interna.",
    },
    {
      color: "#0891b2",
      bg: "#ecfeff",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0891b2"
          strokeWidth="1.8"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Relatórios Gerenciais",
      desc: "Dashboards e relatórios claros e objetivos para que você tome decisões estratégicas com dados confiáveis.",
    },
    {
      color: "#db2777",
      bg: "#fdf2f8",
      icon: (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#db2777"
          strokeWidth="1.8"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: "Suporte Contínuo",
      desc: "Canais de atendimento ágeis e equipe disponível para esclarecer dúvidas e resolver questões com rapidez.",
    },
  ];
  return (
    <section
      id="diferenciais"
      style={{ background: "#fff", padding: "80px 40px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <SectionLabel text="Diferenciais" />
          <h2
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontSize: 36,
              fontWeight: 800,
              color: "#0a1628",
              letterSpacing: -0.5,
            }}
          >
            Por que escolher a{" "}
            <span style={{ color: "#2563eb" }}>AUTOMATTIZE?</span>
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 20,
          }}
          className="diffs-grid"
        >
          {diffs.map((d, i) => (
            <div
              key={i}
              style={{
                borderRadius: 14,
                padding: "28px 24px",
                border: "1px solid #e2e8f0",
                transition: "all 0.25s",
                background: "#fff",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 12px 40px rgba(0,0,0,0.09)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: d.bg,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {d.icon}
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0a1628",
                  marginBottom: 8,
                }}
              >
                {d.title}
              </div>
              <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                {d.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.diffs-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ─────────────────────────────────────────── CEO ── */
function CEOSection() {
  return (
    <section
      id="ceo"
      style={{
        background: "#0a1628",
        padding: "80px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle,rgba(37,99,235,0.12) 0%,transparent 65%)",
          top: "-20%",
          left: "-10%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 60,
            alignItems: "center",
          }}
          className="ceo-grid"
        >
          <div>
            <div
              style={{
                width: 280,
                height: 340,
                borderRadius: 16,
                overflow: "hidden",
                border: "3px solid rgba(37,99,235,0.4)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              }}
            >
              <img
                src={`${BASE}kelvin.jpg`}
                alt="Kelvin"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
            </div>
          </div>
          <div>
            <SectionLabel text="Liderança" light />
            <h2
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: "clamp(28px,4vw,40px)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: -1,
                marginBottom: 4,
              }}
            >
              Kelvin Antony
            </h2>
            <div
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#60a5fa",
                marginBottom: 24,
              }}
            >
              Contador Responsável
            </div>
            <blockquote
              style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.88)",
                borderLeft: "3px solid #2563eb",
                paddingLeft: 20,
                marginBottom: 28,
                maxWidth: 540,
              }}
            >
              Contador com sólida experiência em Lucro Real e BPO Financeiro.
              Fundador da AUTOMATTIZE, empresa criada para unir precisão técnica
              e tecnologia, oferecendo soluções contábeis estratégicas para
              empresas de todos os portes em Brasília e região, com atendimento
              digital em todo o Brasil.
            </blockquote>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
              className="ceo-creds"
            >
              {[
                {
                  l: "Formação",
                  v: "Ciências Contábeis",
                },
                {
                  l: "Expertise",
                  v: "BPO Financeiro e Lucro Real",
                },
                { l: "Atuação", v: "Brasília e Região" },
                {
                  l: "Filosofia",
                  v: "Contabilidade como ferramenta estratégica de crescimento",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Montserrat',sans-serif",
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: "#64748b",
                      marginBottom: 6,
                    }}
                  >
                    {c.l}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.88)",
                      lineHeight: 1.5,
                    }}
                  >
                    {c.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.ceo-grid{grid-template-columns:1fr!important;gap:32px!important}.ceo-creds{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

/* ─────────────────────────────────────────── CONTATO ── */
function Contato({ onProposta }: { onProposta: () => void }) {
  return (
    <section
      id="contato"
      style={{ background: "#f8fafc", padding: "80px 40px" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
          className="contato-grid"
        >
          <div>
            <SectionLabel text="Contato" />
            <h2
              style={{
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 36,
                fontWeight: 800,
                color: "#0a1628",
                letterSpacing: -0.5,
                marginBottom: 16,
              }}
            >
              Vamos <span style={{ color: "#2563eb" }}>Conversar?</span>
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "#475569",
                marginBottom: 32,
              }}
            >
              Entre em contato e descubra como a AUTOMATTIZE pode transformar a
              gestão contábil e financeira da sua empresa.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 28,
              }}
            >
              {[
                {
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" />
                    </svg>
                  ),
                  l: "WhatsApp / Telefone",
                  v: "+55 61 99180-4169",
                  href: "https://wa.me/5561991804169?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Automattize%20Contabilidade.",
                  badge: "Clique para conversar",
                  badgeColor: "#059669",
                },
                {
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  l: "E-mail",
                  v: "automattize.contabilidade@gmail.com",
                  href: "mailto:automattize.contabilidade@gmail.com?subject=Contato%20via%20Site%20Automattize&body=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Automattize%20Contabilidade.",
                  badge: "Clique para enviar",
                  badgeColor: "#2563eb",
                },
                {
                  icon: (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  l: "Horário de Atendimento",
                  v: "Seg. a Sex.: 8h às 18h",
                  href: null,
                  badge: null,
                  badgeColor: null,
                },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 20px",
                    background: "#fff",
                    borderRadius: 10,
                    borderLeft: "3px solid #2563eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    textDecoration: "none",
                    cursor: c.href ? "pointer" : "default",
                    transition: "all 0.2s",
                  }}
                  onClick={
                    c.href
                      ? () =>
                          window.open(c.href!, "_blank", "noopener,noreferrer")
                      : undefined
                  }
                  onMouseEnter={
                    c.href
                      ? (e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 6px 24px rgba(37,99,235,0.15)";
                          (
                            e.currentTarget as HTMLElement
                          ).style.borderLeftColor = c.badgeColor || "#2563eb";
                        }
                      : undefined
                  }
                  onMouseLeave={
                    c.href
                      ? (e) => {
                          (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 2px 8px rgba(0,0,0,0.04)";
                          (
                            e.currentTarget as HTMLElement
                          ).style.borderLeftColor = "#2563eb";
                        }
                      : undefined
                  }
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      minWidth: 42,
                      background: c.href
                        ? c.badgeColor || "#2563eb"
                        : "#2563eb",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'Montserrat',sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: "#94a3b8",
                        marginBottom: 3,
                      }}
                    >
                      {c.l}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#0a1628",
                      }}
                    >
                      {c.v}
                    </div>
                  </div>
                  {c.badge && (
                    <div
                      style={{
                        flexShrink: 0,
                        background: c.badgeColor + "18",
                        border: `1px solid ${c.badgeColor}40`,
                        borderRadius: 100,
                        padding: "3px 10px",
                        fontSize: 10,
                        fontWeight: 700,
                        color: c.badgeColor,
                        fontFamily: "'Montserrat',sans-serif",
                        letterSpacing: 0.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.badge}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div
              style={{
                background: "#eff6ff",
                borderRadius: 12,
                border: "1px solid #bfdbfe",
                padding: "18px 20px",
                fontSize: 13,
                color: "#1e40af",
                lineHeight: 1.6,
              }}
            >
              <strong>Primeira reunião gratuita.</strong> Agende uma reunião e
              descubra, sem compromisso, como podemos ajudar sua empresa a
              crescer com mais organização e segurança financeira.
            </div>
          </div>
          <div>
            <div
              style={{
                background: "#0a1628",
                borderRadius: 20,
                padding: 40,
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(10,22,40,0.2)",
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <Logo size={48} />
              </div>
              <h3
                style={{
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#fff",
                  marginBottom: 12,
                }}
              >
                Pronto para transformar
                <br />
                sua gestão?
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.6,
                  marginBottom: 28,
                }}
              >
                Solicite uma proposta personalizada e receba em até 24 horas
                úteis com os valores e serviços ideais para o seu negócio.
              </p>
              <button
                onClick={onProposta}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontFamily: "'Montserrat',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: 12,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#1d4ed8")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#2563eb")
                }
              >
                Solicitar Proposta Agora →
              </button>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                Sem compromisso · Resposta em 24h
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.contato-grid{grid-template-columns:1fr!important;gap:32px!important}}`}</style>
    </section>
  );
}

/* ─────────────────────────────────────────── FOOTER ── */
function Footer() {
  return (
    <footer
      style={{
        background: "#050d1a",
        padding: "40px 40px",
        borderTop: "1px solid rgba(37,99,235,0.25)",
        textAlign: "center",
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}
      >
        <Logo size={38} />
      </div>
      <p
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.6)",
          marginBottom: 8,
        }}
      >
        Contabilidade estratégica para empresas que querem crescer com
        segurança.
      </p>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
        © {new Date().getFullYear()} AUTOMATTIZE CONTABILIDADE DIGITAL E BPO
        FINANCEIRO. Todos os direitos reservados.
      </p>
    </footer>
  );
}

/* ─────────────────────────────────────────── ROOT ── */
export default function Home() {
  const [propostaOpen, setPropostaOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Lato:wght@300;400;700&display=swap";
    document.head.appendChild(link);
    document.title =
      "AUTOMATTIZE CONTABILIDADE – Precisão, Estratégia e Resultado";
  }, []);

  return (
    <>
      <PropostaDrawer
        open={propostaOpen}
        onClose={() => setPropostaOpen(false)}
      />
      <NavBar onProposta={() => setPropostaOpen(true)} />
      <HeroSection onProposta={() => setPropostaOpen(true)} />
      <QuemAtendemos />
      <Servicos />
      <BPOSection />
      <JornadaSection />
      <Diferenciais />
      <CEOSection />
      <Contato onProposta={() => setPropostaOpen(true)} />
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5561991804169?text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Automattize%20Contabilidade."
        target="_blank"
        rel="noopener noreferrer"
        title="Fale conosco pelo WhatsApp"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 1050,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#25d366",
          boxShadow: "0 4px 20px rgba(37,211,102,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.12)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(37,211,102,0.6)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(37,211,102,0.45)";
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.268 2 2 8.268 2 16c0 2.427.65 4.7 1.785 6.664L2 30l7.53-1.762A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="#fff"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M16 4.5C9.596 4.5 4.5 9.596 4.5 16c0 2.21.63 4.272 1.72 6.01l.29.467-1.17 4.273 4.388-1.147.452.268A11.46 11.46 0 0 0 16 27.5c6.404 0 11.5-5.096 11.5-11.5S22.404 4.5 16 4.5zm-3.48 6.25c-.22-.496-.453-.507-.663-.515-.172-.007-.368-.007-.564-.007s-.515.074-.785.368c-.27.294-1.03 1.006-1.03 2.454s1.054 2.846 1.201 3.042c.148.196 2.034 3.24 5.01 4.415 2.479.978 2.977.784 3.514.735.537-.049 1.73-.707 1.975-1.39.245-.685.245-1.273.171-1.396-.073-.122-.269-.196-.563-.343-.294-.147-1.73-.854-1.998-.95-.269-.098-.465-.147-.66.147-.196.294-.758.95-.93 1.147-.17.196-.342.22-.636.073-.294-.147-1.24-.457-2.362-1.457-.874-.778-1.463-1.74-1.635-2.034-.171-.294-.018-.453.129-.6.132-.131.294-.343.44-.514.148-.172.197-.294.296-.49.098-.196.049-.368-.025-.515-.073-.147-.648-1.6-.9-2.167z" fill="#25d366"/>
        </svg>
      </a>
    </>
  );
}
