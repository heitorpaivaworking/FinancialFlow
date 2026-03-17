import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const client = axios.create({
  baseURL: `${API_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      console.error(`API Error [${status}]:`, data)

      if (status === 422 && data.detail) {
        const messages = data.detail.map((e) => e.msg).join(', ')
        error.message = messages
      }
    } else if (error.request) {
      console.error('Network Error:', error.message)
      error.message = 'Erro de conexão com o servidor'
    }

    return Promise.reject(error)
  },
)

export default client
