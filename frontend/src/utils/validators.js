import { z } from 'zod'

export const receitaSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  fonte: z.string().min(1, 'Fonte é obrigatória'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória').max(255),
  valor: z.number().positive('Valor deve ser positivo'),
  forma_pagamento: z.string().min(1, 'Forma de pagamento é obrigatória'),
  observacoes: z.string().optional(),
})

export const despesaSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  subcategoria: z.string().optional(),
  descricao: z.string().min(1, 'Descrição é obrigatória').max(255),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  forma_pagamento: z.string().min(1, 'Forma de pagamento é obrigatória'),
  valor: z.number().positive('Valor deve ser positivo'),
  observacoes: z.string().optional(),
})

export const investimentoSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  tipo_investimento: z.string().min(1, 'Tipo é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  ativo: z.string().min(1, 'Ativo é obrigatório'),
  valor_investido: z.number().positive('Valor investido deve ser positivo'),
  valor_atual: z.number().min(0, 'Valor atual não pode ser negativo'),
  quantidade: z.number().optional(),
  corretora: z.string().optional(),
  observacoes: z.string().optional(),
})

export const contaFixaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  valor: z.number().positive('Valor deve ser positivo'),
  dia_vencimento: z.number().int().min(1).max(31),
  mes_ref: z.string().min(1, 'Mês é obrigatório'),
  ano_ref: z.number().int().min(2020),
  observacao: z.string().optional(),
})

export const reservaSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().refine((v) => v !== 0, 'Valor não pode ser zero'),
  meta: z.number().positive('Meta deve ser positiva').optional(),
  meses_meta: z.number().int().positive().optional(),
  observacoes: z.string().optional(),
})

export const meiSchema = z.object({
  data: z.string().min(1, 'Data é obrigatória'),
  cliente: z.string().min(1, 'Cliente é obrigatório'),
  servico: z.string().min(1, 'Serviço é obrigatório'),
  valor_bruto: z.number().positive('Valor bruto deve ser positivo'),
  aliquota_imposto: z.number().min(0).max(1).optional(),
  nota_fiscal: z.boolean().optional(),
  observacoes: z.string().optional(),
})
