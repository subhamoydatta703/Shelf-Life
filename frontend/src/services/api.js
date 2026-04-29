import axios from 'axios'

const serverUrl = import.meta.env.VITE_SERVER_URL || ''

if (!serverUrl && import.meta.env.PROD) {
  throw new Error('Missing VITE_SERVER_URL environment variable')
}

const api = axios.create({
  baseURL: `${serverUrl.replace(/\/$/, '')}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
