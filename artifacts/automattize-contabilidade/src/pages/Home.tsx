import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL;

function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={`${BASE}logo-nobg.png`}
        alt="Automattize logo"
        style={{ width: size, height: size, objectFit: "contain" }}
      />
      <div>
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: "0.5px",
            color: "#ffffff",
            lineHeight: 1.1,
          }}
        >
          AUTOMATTIZE
        </div>
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
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

const NAV_LINKS = [
  { href: "#quem-atendemos", label: "Quem Atendemos" },
  { href: "#servicos", label: "Serviços" },
  { href: "#bpo", label: "BPO Financeiro" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#ceo", label: "Nossa Equipe" },
  { href: "#contato", label: "Contato" },
];

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
        background: scrolled ? "rgba(10,22,40,0.98)" : "rgba(10,22,40,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(37,99,235,0.3)",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <a href="#" style={{ textDecoration: "none" }} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
        <Logo size={36} />
      </a>

      <div
        style={{
          display: "flex",
          gap: 0,
          overflowX: "auto",
        }}
        className="hidden md:flex"
      >
        {NAV_LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => handleNavClick(e, l.href)}
            style={{
              textDecoration: "none",
              color: "rgba(255,255,255,0.9)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              padding: "20px 16px",
              borderBottom: "2px solid transparent",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              display: "block",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.color = "#60a5fa";
              (e.target as HTMLElement).style.borderBottomColor = "#60a5fa";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.color = "rgba(255,255,255,0.9)";
              (e.target as HTMLElement).style.borderBottomColor = "transparent";
            }}
          >
            {l.label}
          </a>
        ))}
      </div>

      <button
        className="md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          {mobileOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: 60,
            left: 0,
            right: 0,
            background: "rgba(10,22,40,0.99)",
            borderBottom: "1px solid rgba(37,99,235,0.3)",
            padding: "8px 0",
            zIndex: 998,
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNavClick(e, l.href)}
              style={{
                display: "block",
                padding: "14px 24px",
                color: "rgba(255,255,255,0.9)",
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
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const stats = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      label: "Gestão Financeira",
      value: "100% Digital",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      label: "Compliance",
      value: "Garantido",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      label: "Atendimento",
      value: "Ágil e Humano",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      label: "Redução de Custos",
      value: "Comprovada",
    },
  ];

  return (
    <section
      id="inicio"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1628 0%, #0f2550 50%, #1a3a6e 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        paddingTop: 60,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(37,99,235,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.07) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
          width: "100%",
        }}
        className="hero-content"
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(37,99,235,0.2)",
              border: "1px solid rgba(37,99,235,0.4)",
              borderRadius: 100,
              padding: "6px 16px",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: "#60a5fa",
                borderRadius: "50%",
                animation: "pulse 2s infinite",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#60a5fa",
              }}
            >
              Contabilidade Inteligente
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "clamp(42px, 5vw, 68px)",
              fontWeight: 900,
              lineHeight: 1,
              color: "#ffffff",
              letterSpacing: -2,
              marginBottom: 8,
            }}
          >
            AUTOMATTIZE
            <br />
            <span style={{ color: "#3b82f6" }}>CONTABILIDADE</span>
          </h1>

          <div
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#c8d8e8",
              marginBottom: 28,
            }}
          >
            Precisão. Estratégia. Resultado.
          </div>

          <div
            style={{
              width: 60,
              height: 3,
              background: "linear-gradient(90deg, #2563eb, #60a5fa)",
              borderRadius: 2,
              marginBottom: 24,
            }}
          />

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.92)",
              maxWidth: 480,
              marginBottom: 36,
            }}
          >
            Somos o escritório contábil que une{" "}
            <strong style={{ color: "#60a5fa" }}>tecnologia de ponta</strong> à expertise
            humana para transformar a gestão financeira do seu negócio — com BPO Financeiro
            completo, conformidade fiscal garantida e suporte personalizado.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="#contato"
              onClick={(e) => { e.preventDefault(); document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                background: "#2563eb",
                color: "white",
                padding: "14px 28px",
                borderRadius: 6,
                textDecoration: "none",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                transition: "all 0.2s",
                display: "inline-block",
              }}
            >
              Solicitar Proposta
            </a>
            <a
              href="#servicos"
              onClick={(e) => { e.preventDefault(); document.querySelector("#servicos")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                background: "transparent",
                color: "white",
                padding: "14px 28px",
                borderRadius: 6,
                textDecoration: "none",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                border: "1px solid rgba(255,255,255,0.3)",
                transition: "all 0.2s",
                display: "inline-block",
              }}
            >
              Nossos Serviços
            </a>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="hero-right-grid">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: 24,
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ marginBottom: 8 }}>{s.icon}</div>
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "#90a8c0",
                    marginBottom: 6,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#ffffff",
                  }}
                >
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.1)",
              height: 200,
            }}
          >
            <img
              src={`${BASE}dashboard.jpg`}
              alt="Dashboard contábil"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (max-width: 900px) {
          .hero-content { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-right-grid { display: none !important; }
        }
      `}</style>
    </section>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 32, height: 2, background: "#2563eb" }} />
      <span
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#2563eb",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function QuemAtendemos() {
  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Organização Contábil e Financeira",
      desc: "Clareza nos números, relatórios confiáveis e gestão profissional das finanças empresariais.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Segurança Fiscal e Trabalhista",
      desc: "Compliance total, evitando multas, autuações e passivos ocultos nas operações.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      title: "Informações para Decisão Estratégica",
      desc: "Dados gerenciais precisos e relatórios para tomada de decisão embasada.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h7v7h-7z" />
        </svg>
      ),
      title: "Estrutura Financeira Profissional",
      desc: "Implementação de processos e ferramentas para uma gestão financeira robusta e escalável.",
    },
  ];

  return (
    <section
      id="quem-atendemos"
      style={{ background: "#ffffff", padding: "80px 40px" }}
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
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.15)", position: "relative" }}>
            <img
              src={`${BASE}tablet.jpg`}
              alt="Empresários com tablet"
              style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                background: "#2563eb",
                color: "white",
                borderRadius: 8,
                padding: "12px 18px",
              }}
            >
              <strong style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 800, display: "block" }}>
                MEIs e PMEs
              </strong>
              <span style={{ fontSize: 12, opacity: 0.8 }}>Nosso foco principal</span>
            </div>
          </div>

          <div>
            <SectionLabel text="Quem Atendemos" />
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#0a1628",
                marginBottom: 16,
                letterSpacing: -1,
              }}
            >
              Empresas que precisam de{" "}
              <span style={{ color: "#2563eb" }}>mais do que um contador</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1e293b" }}>
              Atendemos MEIs, microempresas, startups e PMEs que desejam profissionalizar sua gestão contábil e financeira, com um parceiro estratégico ao lado — não apenas um prestador de serviço.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 32 }}>
              {features.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: 20,
                    borderRadius: 10,
                    background: "#f8fafc",
                    borderLeft: "3px solid #2563eb",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      minWidth: 40,
                      background: "#2563eb",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0a1628",
                        marginBottom: 4,
                        letterSpacing: "0.3px",
                      }}
                    >
                      {f.title}
                    </div>
                    <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .quem-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }
      `}</style>
    </section>
  );
}

function Servicos() {
  const cards = [
    {
      color: "#2563eb",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      name: "Departamento",
      title: "Contábil",
      items: [
        "Escrituração contábil (Diário, Razão, Balancetes)",
        "Balanço Patrimonial e DRE",
        "Demonstração de Fluxo de Caixa (DFC)",
      ],
    },
    {
      color: "#7c3aed",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      name: "Departamento",
      title: "Fiscal",
      items: [
        "Apuração de Impostos e Tributos",
        "Emissão e gestão de NF-e e NFS-e",
        "Planejamento Tributário Estratégico",
      ],
    },
    {
      color: "#059669",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      name: "Departamento",
      title: "Pessoal – DP",
      items: [
        "Folha de Pagamento e Encargos (INSS, FGTS, IRRF)",
        "Férias, 13º Salário e Rescisões",
        "Registro de Funcionários e eSocial",
      ],
    },
    {
      color: "#dc2626",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      name: "Departamento",
      title: "Societário",
      items: [
        "Abertura de Empresas (MEI, ME, LTDA)",
        "Alterações Contratuais e Encerramento",
        "Regularização Cadastral (CNPJ, Alvará)",
      ],
    },
  ];

  return (
    <section id="servicos" style={{ background: "#f8fafc", padding: "80px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 48,
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <SectionLabel text="Nossos Serviços" />
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#0a1628",
                marginBottom: 16,
                letterSpacing: -1,
              }}
            >
              Departamentos de <span style={{ color: "#2563eb" }}>Atuação</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1e293b", maxWidth: 580 }}>
              Equipe especializada em cada área para garantir conformidade, organização e resultados reais para o seu negócio.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="services-grid"
        >
          {cards.map((c, i) => (
            <div
              key={i}
              style={{
                background: "#ffffff",
                borderRadius: 14,
                padding: 28,
                border: "1px solid #e2e8f0",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: c.color,
                }}
              />
              <div style={{ marginBottom: 16 }}>{c.icon}</div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#475569",
                  marginBottom: 6,
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#0a1628",
                  marginBottom: 16,
                }}
              >
                {c.title}
              </div>
              <ul style={{ listStyle: "none" }}>
                {c.items.map((item, j) => (
                  <li
                    key={j}
                    style={{
                      fontSize: 13,
                      color: "#334155",
                      padding: "5px 0 5px 16px",
                      position: "relative",
                      lineHeight: 1.4,
                      borderBottom: j < c.items.length - 1 ? "1px solid #e2e8f0" : "none",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: c.color,
                        fontSize: 11,
                        top: 7,
                        fontWeight: 700,
                      }}
                    >
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .services-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function BPOSection() {
  const plans = [
    {
      tier: "Plano",
      name: "Essencial",
      items: [
        "Conciliação bancária mensal",
        "Controle de contas a pagar e receber",
        "Relatório de fluxo de caixa básico",
        "Suporte por e-mail e chat",
      ],
    },
    {
      tier: "Plano",
      name: "Profissional",
      featured: true,
      badge: "Mais Popular",
      items: [
        "Tudo do Essencial",
        "Gestão de cobranças e inadimplência",
        "DRE gerencial mensal",
        "Análise de indicadores financeiros",
        "Reunião mensal de resultados",
        "Suporte prioritário",
      ],
    },
    {
      tier: "Plano",
      name: "Estratégico",
      items: [
        "Tudo do Profissional",
        "Planejamento orçamentário anual",
        "Projeções financeiras e cenários",
        "Assessoria na captação de crédito",
        "Controller financeiro dedicado",
        "Suporte 24/7",
      ],
    },
  ];

  const disclaimerItems = [
    "Valores definidos conforme complexidade operacional",
    "Análise personalizada antes de qualquer proposta",
    "Sem taxas ocultas ou surpresas no contrato",
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
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
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
            <SectionLabel text="BPO Financeiro" />
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#ffffff",
                marginBottom: 16,
                letterSpacing: -1,
              }}
            >
              Terceirização <span style={{ color: "#3b82f6" }}>Financeira</span> Completa
            </h2>
            <blockquote
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.95)",
                borderLeft: "3px solid #3b82f6",
                paddingLeft: 24,
                margin: "24px 0",
                fontStyle: "italic",
              }}
            >
              "Você cuida do seu negócio. Nós cuidamos de toda a operação financeira — com rigor, transparência e tecnologia."
            </blockquote>
            <div
              style={{
                background: "rgba(37,99,235,0.2)",
                border: "1px solid rgba(37,99,235,0.4)",
                borderRadius: 8,
                padding: "14px 18px",
                fontSize: 13,
                color: "#bfdbfe",
                lineHeight: 1.6,
              }}
            >
              O BPO Financeiro (Business Process Outsourcing) é a terceirização completa do setor financeiro da sua empresa. Nossa equipe assume as rotinas financeiras, liberando você para focar no crescimento do negócio.
            </div>
          </div>

          <div style={{ borderRadius: 14, overflow: "hidden" }}>
            <img
              src={`${BASE}paperwork.jpg`}
              alt="BPO Financeiro"
              style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }}
            />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginBottom: 40,
          }}
          className="bpo-plans"
        >
          {plans.map((p, i) => (
            <div
              key={i}
              style={{
                background: p.featured ? "rgba(37,99,235,0.25)" : "rgba(255,255,255,0.05)",
                border: p.featured ? "1px solid #2563eb" : "1px solid rgba(255,255,255,0.12)",
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
                    color: "white",
                    fontFamily: "'Montserrat', sans-serif",
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
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "#90a8c0",
                  marginBottom: 8,
                }}
              >
                {p.tier}
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: 20,
                }}
              >
                {p.name}
              </div>
              <ul style={{ listStyle: "none" }}>
                {p.items.map((item, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.92)",
                      padding: "7px 0",
                      borderBottom: j < p.items.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                      lineHeight: 1.4,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "rgba(30, 58, 138, 0.5)",
            border: "1px solid rgba(96, 165, 250, 0.6)",
            borderRadius: 10,
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 1,
              color: "#ffffff",
              textTransform: "uppercase",
              marginBottom: 14,
              display: "block",
            }}
          >
            Transparência em Preços
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {disclaimerItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .bpo-intro { grid-template-columns: 1fr !important; gap: 32px !important; }
          .bpo-plans { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function Diferenciais() {
  const diffs = [
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: "Atendimento Humanizado",
      desc: "Você sempre terá um contador responsável pelo seu negócio — sem transferências infinitas ou respostas genéricas.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: "Tecnologia de Ponta",
      desc: "Utilizamos softwares contábeis modernos e plataformas digitais para automatizar processos e entregar dados em tempo real.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Compliance e Segurança",
      desc: "Atuamos com máximo rigor legal e fiscal, garantindo que sua empresa esteja sempre em conformidade com as obrigações tributárias.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
          <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      title: "Redução de Custos",
      desc: "Terceirizar sua contabilidade e financeiro reduz custos operacionais em até 60% comparado a uma equipe interna.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Relatórios Gerenciais",
      desc: "Dashboards e relatórios claros e objetivos para que você tome decisões estratégicas com dados confiáveis.",
    },
    {
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.8">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: "Suporte Contínuo",
      desc: "Canais de atendimento ágeis e equipe disponível para esclarecer dúvidas e resolver questões com rapidez.",
    },
  ];

  return (
    <section style={{ background: "#ffffff", padding: "80px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <SectionLabel text="Diferenciais" />
        </div>
        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 38,
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#0a1628",
            marginBottom: 16,
            letterSpacing: -1,
            textAlign: "center",
          }}
        >
          Por que escolher a <span style={{ color: "#2563eb" }}>Automattize?</span>
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: "#1e293b",
            maxWidth: 580,
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          Somos mais que um escritório contábil — somos o parceiro estratégico que seu negócio precisa para crescer com segurança e inteligência.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginTop: 48,
          }}
          className="diffs-grid"
        >
          {diffs.map((d, i) => (
            <div
              key={i}
              style={{
                background: "#ffffff",
                borderRadius: 14,
                padding: "32px 28px",
                textAlign: "center",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)";
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  margin: "0 auto 18px",
                  background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {d.icon}
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#0a1628",
                  marginBottom: 10,
                }}
              >
                {d.title}
              </div>
              <div style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6 }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .diffs-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function CEOSection() {
  return (
    <section id="ceo" style={{ background: "#0a1628", padding: "80px 40px", position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "50%",
          opacity: 0.05,
          background: `url(${BASE}broker.jpg) center/cover`,
        }}
      />
      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 60,
            alignItems: "center",
          }}
          className="ceo-inner"
        >
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                width: 280,
                height: 340,
                borderRadius: 16,
                overflow: "hidden",
                border: "4px solid rgba(37,99,235,0.4)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
              }}
            >
              <img
                src={`${BASE}kelvin.jpg`}
                alt="Kelvin - CEO Automattize"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
            </div>
          </div>

          <div>
            <SectionLabel text="Nossa Equipe" />
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "clamp(30px, 4vw, 42px)",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: -1,
                marginBottom: 4,
              }}
            >
              Kelvin Souza
            </h2>
            <div
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#60a5fa",
                marginBottom: 24,
              }}
            >
              CEO & Contador Responsável
            </div>
            <blockquote
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.92)",
                borderLeft: "3px solid #2563eb",
                paddingLeft: 20,
                marginBottom: 28,
                maxWidth: 580,
              }}
            >
              "Fundei a Automattize com uma convicção: toda empresa, independente do tamanho, merece uma contabilidade estratégica, transparente e que realmente contribua para o crescimento do negócio. Nossa missão é ser o parceiro financeiro que os empresários sempre quiseram ter."
            </blockquote>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
              className="ceo-creds"
            >
              {[
                { label: "Formação", value: "Ciências Contábeis + Especialização em Gestão Financeira" },
                { label: "Expertise", value: "BPO Financeiro, Planejamento Tributário e Abertura de Empresas" },
                { label: "Atuação", value: "MEIs, Microempresas, Startups e PMEs em todo o Brasil" },
                { label: "Filosofia", value: "Contabilidade como ferramenta estratégica de crescimento" },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      color: "#90a8c0",
                      marginBottom: 6,
                    }}
                  >
                    {c.label}
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.95)", lineHeight: 1.5 }}>{c.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .ceo-inner { grid-template-columns: 1fr !important; gap: 32px !important; }
          .ceo-creds { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    empresa: "",
    faturamento: "",
    funcionarios: "",
    servicos: [] as string[],
    mensagem: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const servicoOptions = ["Departamento Contábil", "Departamento Fiscal", "Departamento Pessoal (DP)", "Departamento Societário", "BPO Financeiro"];

  const toggleServico = (s: string) => {
    setFormData((prev) => ({
      ...prev,
      servicos: prev.servicos.includes(s) ? prev.servicos.filter((x) => x !== s) : [...prev.servicos, s],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contato" style={{ background: "#f8fafc", padding: "80px 40px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "start",
          }}
          className="contact-grid"
        >
          <div>
            <SectionLabel text="Contato" />
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 38,
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#0a1628",
                marginBottom: 16,
                letterSpacing: -1,
              }}
            >
              Vamos <span style={{ color: "#2563eb" }}>Conversar?</span>
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1e293b" }}>
              Entre em contato e descubra como a Automattize pode transformar a gestão contábil e financeira da sua empresa.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 32 }}>
              {[
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" />
                    </svg>
                  ),
                  label: "WhatsApp / Telefone",
                  value: "(11) 99999-9999",
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  label: "E-mail",
                  value: "contato@automattize.com.br",
                },
                {
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  label: "Horário de Atendimento",
                  value: "Seg. a Sex.: 8h às 18h",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: 20,
                    background: "#ffffff",
                    borderRadius: 10,
                    borderLeft: "3px solid #2563eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      minWidth: 44,
                      background: "#2563eb",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: "#475569",
                        marginBottom: 4,
                      }}
                    >
                      {c.label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#0a1628" }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 24,
                padding: "16px 20px",
                background: "#eff6ff",
                borderRadius: 10,
                border: "1px solid #bfdbfe",
                fontSize: 13,
                color: "#1e3a8a",
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              <strong>Primeira consulta gratuita.</strong> Agende uma reunião e descubra, sem compromisso, como podemos ajudar sua empresa a crescer com mais organização e segurança financeira.
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
              padding: 36,
            }}
          >
            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ marginBottom: 16 }}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" style={{ margin: "0 auto" }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 800, color: "#0a1628", marginBottom: 12 }}>
                  Mensagem Enviada!
                </h3>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                  Obrigado pelo contato. Nossa equipe retornará em até 24 horas úteis.
                </p>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 18, fontWeight: 800, color: "#0a1628", marginBottom: 4 }}>
                  Solicite uma Proposta
                </div>
                <div style={{ fontSize: 13, color: "#475569", marginBottom: 28 }}>
                  Preencha o formulário e entraremos em contato em até 24 horas.
                </div>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="form-row">
                    {[
                      { key: "nome", label: "Nome Completo", type: "text", placeholder: "Seu nome" },
                      { key: "email", label: "E-mail", type: "email", placeholder: "seu@email.com" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#1e293b", display: "block", marginBottom: 6 }}>
                          {f.label}
                        </label>
                        <input
                          type={f.type}
                          placeholder={f.placeholder}
                          value={(formData as Record<string, string>)[f.key]}
                          onChange={(e) => setFormData((prev) => ({ ...prev, [f.key]: e.target.value }))}
                          style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0", borderRadius: 7, fontSize: 14, color: "#1e293b", fontFamily: "inherit", outline: "none", transition: "border-color 0.2s" }}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#1e293b", display: "block", marginBottom: 6 }}>
                      Nome da Empresa
                    </label>
                    <input
                      type="text"
                      placeholder="Sua empresa"
                      value={formData.empresa}
                      onChange={(e) => setFormData((prev) => ({ ...prev, empresa: e.target.value }))}
                      style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0", borderRadius: 7, fontSize: 14, color: "#1e293b", fontFamily: "inherit", outline: "none" }}
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#1e293b", display: "block", marginBottom: 8 }}>
                      Serviços de Interesse
                    </label>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {servicoOptions.map((s) => (
                        <label
                          key={s}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                            padding: "8px 12px",
                            border: formData.servicos.includes(s) ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                            borderRadius: 7,
                            background: formData.servicos.includes(s) ? "#eff6ff" : "transparent",
                            transition: "all 0.2s",
                            fontSize: 13,
                            color: "#1e293b",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={formData.servicos.includes(s)}
                            onChange={() => toggleServico(s)}
                            style={{ display: "none" }}
                          />
                          <div
                            style={{
                              width: 16,
                              height: 16,
                              border: formData.servicos.includes(s) ? "2px solid #2563eb" : "2px solid #e2e8f0",
                              borderRadius: 4,
                              background: formData.servicos.includes(s) ? "#2563eb" : "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              fontSize: 10,
                              color: "white",
                            }}
                          >
                            {formData.servicos.includes(s) && "✓"}
                          </div>
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#1e293b", display: "block", marginBottom: 6 }}>
                      Mensagem (opcional)
                    </label>
                    <textarea
                      placeholder="Conte-nos sobre seu negócio e suas necessidades..."
                      value={formData.mensagem}
                      onChange={(e) => setFormData((prev) => ({ ...prev, mensagem: e.target.value }))}
                      rows={3}
                      style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0", borderRadius: 7, fontSize: 14, color: "#1e293b", fontFamily: "inherit", resize: "vertical", outline: "none" }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: 14,
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: 7,
                      cursor: "pointer",
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      marginTop: 8,
                      transition: "all 0.2s",
                    }}
                  >
                    Enviar Solicitação
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        background: "#050d1a",
        padding: 40,
        textAlign: "center",
        borderTop: "1px solid rgba(37,99,235,0.3)",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Logo size={40} />
        </div>
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
        Contabilidade estratégica para empresas que querem crescer com segurança.
      </p>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12 }}>
        © {new Date().getFullYear()} Automattize Contabilidade. Todos os direitos reservados.
      </p>
    </footer>
  );
}

export default function Home() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Lato:wght@300;400;700&display=swap";
    document.head.appendChild(link);
    document.title = "Automattize Contabilidade – Precisão, Estratégia e Resultado";
  }, []);

  return (
    <>
      <NavBar />
      <HeroSection />
      <QuemAtendemos />
      <Servicos />
      <BPOSection />
      <Diferenciais />
      <CEOSection />
      <Contato />
      <Footer />
    </>
  );
}
