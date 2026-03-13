import { Router, type IRouter } from "express";
import { db, proposalsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.post("/proposals", async (req, res) => {
  try {
    const { dataSolicitacao, servicos, nomeSocio, email, cnpj, regimeTributario, faturamentoMensal, movimentacaoFinanceira, mensagem } = req.body;

    if (!nomeSocio || !email) {
      return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
    }

    const [proposal] = await db.insert(proposalsTable).values({
      dataSolicitacao,
      servicos,
      nomeSocio,
      email,
      cnpj,
      regimeTributario,
      faturamentoMensal,
      movimentacaoFinanceira,
      mensagem,
      status: "nova",
    }).returning();

    return res.status(201).json({ success: true, proposal });
  } catch (err) {
    console.error("Error saving proposal:", err);
    return res.status(500).json({ error: "Erro ao salvar proposta." });
  }
});

router.get("/proposals", async (_req, res) => {
  try {
    const proposals = await db.select().from(proposalsTable).orderBy(desc(proposalsTable.createdAt));
    return res.json({ proposals });
  } catch (err) {
    console.error("Error fetching proposals:", err);
    return res.status(500).json({ error: "Erro ao buscar propostas." });
  }
});

export default router;
