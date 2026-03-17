import client from './client'

const BASE = '/investimentos'

export const investimentosApi = {
  listar: (params) => client.get(BASE, { params }).then((r) => r.data),
  obter: (id) => client.get(`${BASE}/${id}`).then((r) => r.data),
  criar: (data) => client.post(BASE, data).then((r) => r.data),
  atualizar: (id, data) => client.put(`${BASE}/${id}`, data).then((r) => r.data),
  deletar: (id) => client.delete(`${BASE}/${id}`),
  resumoTotal: (params) => client.get(`${BASE}/resumo/total`, { params }).then((r) => r.data),
  resumoPorTipo: (params) => client.get(`${BASE}/resumo/por-tipo`, { params }).then((r) => r.data),
}
