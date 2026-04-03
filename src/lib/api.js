import axios from 'axios'

const API_BASE_URL = 'https://oz-grills-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to requests if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('oz_admin_token')
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

export const getMenu = async () => {
  try {
    const response = await api.get('/categories/')
    return response.data
  } catch (error) {
    console.error("API Error (getMenu):", error)
    return []
  }
}

export const getSettings = async () => {
  try {
    // We always fetch the instance with ID 1
    const response = await api.get('/settings/1/')
    return response.data
  } catch (error) {
    console.error("API Error (getSettings):", error)
    return null
  }
}

export const getLocations = async () => {
  try {
    const response = await api.get('/locations/')
    return response.data
  } catch (error) {
    console.error("API Error (getLocations):", error)
    return []
  }
}

// Auth actions
export const loginAdmin = (credentials) => 
  api.post('/auth/login/', credentials).then(res => res.data)

// Admin CRUD
export const getCategories = () => api.get('/categories/').then(res => res.data)
export const updateProduct = (id, data) => api.put(`/products/${id}/`, data)
export const createProduct = (data) => api.post('/products/', data)
export const deleteProduct = (id) => api.delete(`/products/${id}/`)

export const updateLocation = (id, data) => api.put(`/locations/${id}/`, data)
export const createLocation = (data) => api.post('/locations/', data)
export const deleteLocation = (id) => api.delete(`/locations/${id}/`)

export const updateSettings = (data) => api.put('/settings/1/', data)

export default api
