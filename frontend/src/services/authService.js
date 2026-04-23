import api from './api'

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const register = async (name, email, password, confirmPassword, inviteCode) => {
  const response = await api.post('/auth/register', { name, email, password, confirmPassword, inviteCode })
  return response.data
}
