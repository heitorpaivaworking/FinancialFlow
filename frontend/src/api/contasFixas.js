import client from './client'

const BASE = '/contas-fixas'

export const contasFixasApi = {
  listar: (params) => client.get(BASE, { params }).then((r) => r.data),
  criar: (data) => client.post(BASE, data).then((r) => r.data),
  atualizar: (id, data) => client.put(`${BASE}/${id}`, data).then((r) => r.data),
  togglePagar: (id) => client.put(`${BASE}/${id}/pagar`).then((r) => r.data),
  deletar: (id) => client.delete(`${BASE}/${id}`),
  replicar: (data) => client.post(`${BASE}/replicar`, data).then((r) => r.data),
}
