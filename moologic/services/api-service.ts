import axios from "axios"
import { getSession } from "next-auth/react"

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000"
const API_AUTH_URL = `${API_BASE_URL}/auth`

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      try {
        const session = await getSession()
        const tokenFromSession = (session as any)?.user?.accessToken
        const tokenFromStorage = localStorage.getItem("accessToken")
        const token = tokenFromSession || tokenFromStorage
        if (token) {
          config.headers = config.headers || {}
          ;(config.headers as any).Authorization = `Bearer ${token}`
        }
      } catch (e) {
        // If getSession fails for any reason, fallback to localStorage
        const token = localStorage.getItem("accessToken")
        if (token) {
          config.headers = config.headers || {}
          ;(config.headers as any).Authorization = `Bearer ${token}`
        }
      }
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

    // Guard for responses that don't have a response object
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token (only in browser)
        if (typeof window === "undefined") return Promise.reject(error)

        // Prefer refresh token from NextAuth session, fall back to localStorage
        let refreshToken: string | null = null
        try {
          const session = await getSession()
          refreshToken = (session as any)?.user?.refreshToken || null
        } catch (e) {
          // ignore and fallback
        }

        if (!refreshToken) refreshToken = localStorage.getItem("refreshToken")

        if (!refreshToken) {
          window.location.href = "/auth/login"
          return Promise.reject(error)
        }

        const response = await axios.post(`${API_AUTH_URL}/refresh-token/`, {
          refresh_token: refreshToken,
        })

        // If token refresh is successful
        if (response.status === 200 && response.data?.access_token) {
          // Persist for axios fallback compatibility
          try {
            localStorage.setItem("accessToken", response.data.access_token)
          } catch (e) {
            // ignore storage errors
          }

          // Update the original request with new token
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== "undefined") window.location.href = "/auth/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Cattle API
export const cattleApi = {
  getAllCattle: () => apiClient.get("/core/cattle/"),
  getCattleById: (id: string) => apiClient.get(`/core/cattle/${id}/`),
  createCattle: (data: any) => apiClient.post("/core/cattle/", data),
  updateCattle: (id: string, data: any) => apiClient.put(`/core/cattle/${id}/`, data),
  deleteCattle: (id: string) => apiClient.delete(`/core/cattle/${id}/`),
  generateAlerts: (id: string) => apiClient.get(`/core/cattle/${id}/generate_alerts/`),
  updateGestationStatus: (id: string) => apiClient.post(`/core/cattle/${id}/update_gestation_status/`),
}

// Insemination API
export const inseminationApi = {
  getAllInseminations: () => apiClient.get("/core/insemination/"),
  getInseminationById: (id: string) => apiClient.get(`/core/insemination/${id}/`),
  createInsemination: (data: any) => apiClient.post("/core/insemination/", data),
  updateInsemination: (id: string, data: any) => apiClient.put(`/core/insemination/${id}/`, data),
  deleteInsemination: (id: string) => apiClient.delete(`/core/insemination/${id}/`),
}

// Birth Record API
export const birthRecordApi = {
  getAllBirthRecords: () => apiClient.get("/core/birth-record/"),
  getBirthRecordById: (id: string) => apiClient.get(`/core/birth-record/${id}/`),
  createBirthRecord: (data: any) => apiClient.post("/core/birth-record/", data),
  updateBirthRecord: (id: string, data: any) => apiClient.put(`/core/birth-record/${id}/`, data),
  deleteBirthRecord: (id: string) => apiClient.delete(`/core/birth-record/${id}/`),
}

// Alert API
export const alertApi = {
  getAllAlerts: () => apiClient.get("/core/alerts/"),
  getAlertById: (id: string) => apiClient.get(`/core/alerts/${id}/`),
  createAlert: (data: any) => apiClient.post("/core/alerts/", data),
  updateAlert: (id: string, data: any) => apiClient.put(`/core/alerts/${id}/`, data),
  deleteAlert: (id: string) => apiClient.delete(`/core/alerts/${id}/`),
  markAsRead: (id: string) => apiClient.patch(`/core/alerts/${id}/`, { is_read: true }),
}

// Farm API
export const farmApi = {
  createFarm: (data: any) => apiClient.post("/core/farm/", data),
  getFarm: (id: string) => apiClient.get(`/core/farm/${id}/`),
  updateFarm: (id: string, data: any) => apiClient.put(`/core/farm/${id}/`, data),
  deleteFarm: (id: string) => apiClient.delete(`/core/farm/${id}/`),
}

export default {
  cattle: cattleApi,
  insemination: inseminationApi,
  birthRecord: birthRecordApi,
  alert: alertApi,
  farm: farmApi,
}

