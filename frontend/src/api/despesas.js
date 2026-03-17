import client from './client'

const BASE = '/despesas'

export const despesasApi = {
  listar: (params) => client.get(BASE, { params }).then((r) => r.data),
  obter: (id) => client.get(`${BASE}/${id}`).then((r) => r.data),
  criar: (data) => client.post(BASE, data).then((r) => r.data),
  atualizar: (id, data) => client.put(`${BASE}/${id}`, data).then((r) => r.data),
  deletar: (id) => client.delete(`${BASE}/${id}`),
  resumoMensal: (ano) => client.get(`${BASE}/resumo/mensal`, { params: { ano } }).then((r) => r.data),
  resumoCategorias: (params) => client.get(`${BASE}/resumo/categorias`, { params }).then((r) => r.data),
}
