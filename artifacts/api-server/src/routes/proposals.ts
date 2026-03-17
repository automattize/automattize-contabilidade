import { Router, type IRouter } from "express";
import { db, proposalsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import fs from "fs";
import path from "path";

const router: IRouter = Router();

const PROPOSALS_LOG = path.resolve(process.cwd(), "proposals_log.txt");

function formatProposalTxt(proposal: Record<string, unknown>, index?: number): string {
  const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const sep = "═".repeat(60);
  const line = "─".repeat(60);
  const servicos = Array.isArray(proposal.servicos)
    ? (proposal.servicos as string[]).join(", ")
    : String(proposal.servicos || "Não informado");

  return [
    sep,
    index !== undefined ? `  PROPOSTA #${index + 1}` : `  NOVA PROPOSTA — AUTOMATTIZE CONTABILIDADE`,
    `  Recebida em: ${now}`,
    sep,
    `  Nome do Sócio / Solicitante : ${proposal.nomeSocio || "—"}`,
    `  E-mail                      : ${proposal.email || "—"}`,
    `  CNPJ                        : ${proposal.cnpj || "Não informado"}`,
    line,
    `  Serviços de Interesse       : ${servicos}`,
    `  Regime Tributário           : ${proposal.regimeTributario || "Não informado"}`,
    `  Faturamento Mensal (Média)  : ${proposal.faturamentoMensal || "Não informado"}`,
    `  Movimentação Financeira     : ${proposal.movimentacaoFinanceira || "Não informado"}`,
    `  Data da Solicitação         : ${proposal.dataSolicitacao || now.split(",")[0]}`,
    sep,
    "",
  ].join("\n");
}

router.post("/proposals", async (req, res) => {
  try {
    const {
      dataSolicitacao, servicos, nomeSocio, email,
      cnpj, regimeTributario, faturamentoMensal, movimentacaoFinanceira,
    } = req.body;

    if (!nomeSocio || !email) {
      return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
    }
    if (!servicos || !Array.isArray(servicos) || servicos.length === 0) {
      return res.status(400).json({ error: "Selecione pelo menos um serviço de interesse." });
    }

    const [proposal] = await db
      .insert(proposalsTable)
      .values({ dataSolicitacao, servicos, nomeSocio, email, cnpj, regimeTributario, faturamentoMensal, movimentacaoFinanceira, status: "nova" })
      .returning();

    try {
      const txt = formatProposalTxt(proposal as unknown as Record<string, unknown>);
      fs.appendFileSync(PROPOSALS_LOG, txt, "utf8");
      console.log(`[proposals] Nova proposta de ${nomeSocio} salva no log.`);
    } catch (logErr) {
      console.error("[proposals] Erro ao gravar log TXT:", logErr);
    }

    return res.status(201).json({ success: true, proposal });
  } catch (err) {
    console.error("Error saving proposal:", err);
    return res.status(500).json({ error: "Erro ao salvar proposta." });
  }
});

router.get("/proposals", async (_req, res) => {
  try {
    const proposals = await db
      .select()
      .from(proposalsTable)
      .orderBy(desc(proposalsTable.createdAt));
    return res.json({ proposals });
  } catch (err) {
    console.error("Error fetching proposals:", err);
    return res.status(500).json({ error: "Erro ao buscar propostas." });
  }
});

router.get("/proposals/export", async (_req, res) => {
  try {
    const proposals = await db
      .select()
      .from(proposalsTable)
      .orderBy(desc(proposalsTable.createdAt));

    const header = [
      "╔" + "═".repeat(60) + "╗",
      "║    AUTOMATTIZE CONTABILIDADE — RELATÓRIO DE PROPOSTAS   ║",
      `║    Gerado em: ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }).padEnd(44)}║`,
      `║    Total de propostas: ${String(proposals.length).padEnd(36)}║`,
      "╚" + "═".repeat(60) + "╝",
      "",
    ].join("\n");

    const body = proposals
      .map((p, i) => formatProposalTxt(p as unknown as Record<string, unknown>, i))
      .join("\n");

    const content = header + body;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="automattize-propostas-${Date.now()}.txt"`,
    );
    return res.send(content);
  } catch (err) {
    console.error("Error exporting proposals:", err);
    return res.status(500).json({ error: "Erro ao exportar propostas." });
  }
});

export default router;
