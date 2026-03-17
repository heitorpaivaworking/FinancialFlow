import client from './client'

const BASE = '/reserva'

export const reservaApi = {
  listar: () => client.get(BASE).then((r) => r.data),
  criar: (data) => client.post(BASE, data).then((r) => r.data),
  atualizarMeta: (data) => client.put(`${BASE}/meta`, data).then((r) => r.data),
  status: () => client.get(`${BASE}/status`).then((r) => r.data),
}
