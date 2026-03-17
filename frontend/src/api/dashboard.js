import client from './client'

const BASE = '/dashboard'

export const dashboardApi = {
  kpis: (params) => client.get(`${BASE}/kpis`, { params }).then((r) => r.data),
  evolucaoMensal: (ano) => client.get(`${BASE}/evolucao-mensal`, { params: { ano } }).then((r) => r.data),
  gastosCategorias: (params) => client.get(`${BASE}/gastos-categorias`, { params }).then((r) => r.data),
  fluxoCaixa: (ano) => client.get(`${BASE}/fluxo-caixa`, { params: { ano } }).then((r) => r.data),
  patrimonio: (ano) => client.get(`${BASE}/patrimonio`, { params: { ano } }).then((r) => r.data),
  saudeFinanceira: (params) => client.get(`${BASE}/saude-financeira`, { params }).then((r) => r.data),
  ultimasTransacoes: (limit) => client.get(`${BASE}/ultimas-transacoes`, { params: { limit } }).then((r) => r.data),
}
