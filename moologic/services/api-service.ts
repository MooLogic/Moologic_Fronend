import axios from "axios"

const API_BASE_URL = "http://127.0.0.1:8000/core/"
const API_AUTH_URL = "http://http://127.0.0.1:8000/auth/"

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    console.log(token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refreshToken")
        const response = await axios.post(`${API_AUTH_URL}/refresh-token/`, {
          refresh_token: refreshToken,
        })

        // If token refresh is successful
        if (response.status === 200) {
          localStorage.setItem("accessToken", response.data.access_token)

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = "/auth/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Cattle API
export const cattleApi = {
  getAllCattle: () => apiClient.get("/cattle/"),
  getCattleById: (id: string) => apiClient.get(`/cattle/${id}/`),
  createCattle: (data: any) => apiClient.post("/cattle/", data),
  updateCattle: (id: string, data: any) => apiClient.put(`/cattle/${id}/`, data),
  deleteCattle: (id: string) => apiClient.delete(`/cattle/${id}/`),
  generateAlerts: (id: string) => apiClient.get(`/cattle/${id}/generate_alerts/`),
  updateGestationStatus: (id: string) => apiClient.post(`/cattle/${id}/update_gestation_status/`),
}

// Insemination API
export const inseminationApi = {
  getAllInseminations: () => apiClient.get("/insemination/"),
  getInseminationById: (id: string) => apiClient.get(`/insemination/${id}/`),
  createInsemination: (data: any) => apiClient.post("/insemination/", data),
  updateInsemination: (id: string, data: any) => apiClient.put(`/insemination/${id}/`, data),
  deleteInsemination: (id: string) => apiClient.delete(`/insemination/${id}/`),
}

// Birth Record API
export const birthRecordApi = {
  getAllBirthRecords: () => apiClient.get("/birth-record/"),
  getBirthRecordById: (id: string) => apiClient.get(`/birth-record/${id}/`),
  createBirthRecord: (data: any) => apiClient.post("/birth-record/", data),
  updateBirthRecord: (id: string, data: any) => apiClient.put(`/birth-record/${id}/`, data),
  deleteBirthRecord: (id: string) => apiClient.delete(`/birth-record/${id}/`),
}

// Alert API
export const alertApi = {
  getAllAlerts: () => apiClient.get("/alerts/"),
  getAlertById: (id: string) => apiClient.get(`/alerts/${id}/`),
  createAlert: (data: any) => apiClient.post("/alerts/", data),
  updateAlert: (id: string, data: any) => apiClient.put(`/alerts/${id}/`, data),
  deleteAlert: (id: string) => apiClient.delete(`/alerts/${id}/`),
  markAsRead: (id: string) => apiClient.patch(`/alerts/${id}/`, { is_read: true }),
}

// Farm API
export const farmApi = {
  createFarm: (data: any) => apiClient.post("/farm/", data),
  getFarm: (id: string) => apiClient.get(`/farm/${id}/`),
  updateFarm: (id: string, data: any) => apiClient.put(`/farm/${id}/`, data),
  deleteFarm: (id: string) => apiClient.delete(`/farm/${id}/`),
}

export default {
  cattle: cattleApi,
  insemination: inseminationApi,
  birthRecord: birthRecordApi,
  alert: alertApi,
  farm: farmApi,
}

