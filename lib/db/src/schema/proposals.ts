import { pgTable, serial, text, date, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const proposalsTable = pgTable("proposals", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  dataSolicitacao: date("data_solicitacao"),
  servicos: text("servicos").array(),
  nomeSocio: text("nome_socio").notNull(),
  email: text("email").notNull(),
  cnpj: text("cnpj"),
  regimeTributario: text("regime_tributario"),
  faturamentoMensal: text("faturamento_mensal"),
  funcionarios: integer("funcionarios"),
  movimentacaoFinanceira: text("movimentacao_financeira"),
  mensagem: text("mensagem"),
  status: text("status").default("nova"),
});

export const insertProposalSchema = createInsertSchema(proposalsTable).omit({ id: true, createdAt: true });
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposalsTable.$inferSelect;
