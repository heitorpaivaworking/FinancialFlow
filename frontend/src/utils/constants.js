export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export const FONTES_RECEITA = [
  'Trabalho Principal', 'Trabalho Secundário',
  'Extra Trabalho Principal', 'Extra Trabalho Secundário',
  'Freelance', 'Aluguel', 'Dividendos', 'Outros',
]

export const TIPOS_RECEITA = ['Fixa', 'Extra', 'Variável']

export const FORMAS_PAGAMENTO = [
  'PIX', 'Transferência', 'Dinheiro',
  'Cartão Débito', 'Cartão Crédito', 'Boleto', 'Outro',
]

export const CATEGORIAS_DESPESA = {
  'Moradia': { icon: '🏠', color: 'blue', subs: ['Aluguel', 'Condomínio', 'Água', 'Luz', 'Gás', 'Internet', 'Manutenção'] },
  'Alimentação': { icon: '🛒', color: 'green', subs: ['Supermercado', 'Restaurante', 'iFood', 'Padaria', 'Feira', 'Açougue'] },
  'Transporte': { icon: '🚗', color: 'yellow', subs: ['Combustível', 'Uber/99', 'Transporte Público', 'Manutenção', 'Seguro'] },
  'Saúde': { icon: '❤️', color: 'pink', subs: ['Plano de Saúde', 'Farmácia', 'Consulta', 'Academia', 'Dentista', 'Psicólogo'] },
  'Lazer': { icon: '🎮', color: 'purple', subs: ['Cinema', 'Streaming', 'Viagem', 'Hobby', 'Shows', 'Esportes'] },
  'Assinaturas': { icon: '📱', color: 'cyan', subs: ['Netflix', 'Spotify', 'YouTube', 'Amazon Prime', 'Adobe', 'Microsoft 365'] },
  'Educação': { icon: '📚', color: 'orange', subs: ['Curso Online', 'Livros', 'Faculdade', 'Idiomas', 'Certificação'] },
  'Tecnologia': { icon: '💻', color: 'indigo', subs: ['Hardware', 'Software', 'Equipamentos', 'Acessórios', 'Celular'] },
  'Outros': { icon: '📦', color: 'gray', subs: ['Vestuário', 'Presentes', 'Doações', 'Imprevistos', 'Pet'] },
}

export const TIPOS_INVESTIMENTO = [
  'Ação', 'ETF', 'FII', 'Cripto', 'Renda Fixa',
  'Tesouro Direto', 'CDB', 'LCI/LCA', 'Previdência', 'Outro',
]

export const STATUS_CONTA = ['Pago', 'Pendente', 'Atrasado']

export const CHART_COLORS = [
  '#4F8EF7', '#10D98A', '#FFB547', '#FF5757',
  '#A78BFA', '#22D3EE', '#FB923C', '#F472B6',
]

export const LIMITE_MEI_ANUAL = 81000
export const ALIQUOTA_MEI_SERVICO = 0.06
export const ALIQUOTA_MEI_COMERCIO = 0.06
