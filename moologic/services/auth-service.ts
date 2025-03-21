const API_BASE_URL = "http://127.0.0.1:8000/auth"

interface SignupData {
  email: string
  username: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

interface ResetPasswordData {
  uidb64: string
  token: string
  new_password: string
}

interface ChangePasswordData {
  old_password: string
  new_password: string
}

interface EditProfileData {
  name?: string
  username?: string
  email?: string
  role?: string
  language?: string
}

interface FarmData {
  name: string
  location: string
  contact: string
  farm_type: string
  size: number
  cattle_count: number
  description?: string
}

class AuthService {
  // Store tokens in localStorage
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
  }

  // Get tokens from localStorage
  getAccessToken() {
    return localStorage.getItem("accessToken")
  }

  getRefreshToken() {
    return localStorage.getItem("refreshToken")
  }

  // Clear tokens from localStorage
  clearTokens() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAccessToken()
  }

  // Handle API responses and errors
  async handleResponse(response: Response) {
    const data = await response.json()

    if (!response.ok) {
      const error = data.error || data.message || response.statusText
      throw new Error(error)
    }

    return data
  }

  // User signup
  async signup(userData: SignupData) {
    const response = await fetch(`${API_BASE_URL}/signup/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    const data = await this.handleResponse(response)

    // Store tokens if they exist in the response
    if (data.access_token && data.refresh_token) {
      this.setTokens(data.access_token, data.refresh_token)
    }

    return data
  }

  // User login
  async login(credentials: LoginData) {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    const data = await this.handleResponse(response)

    // Store tokens if they exist in the response
    if (data.access_token && data.refresh_token) {
      this.setTokens(data.access_token, data.refresh_token)
    }

    return data
  }

  // Create a farm
  async createFarm(farmData: FarmData) {
    const accessToken = this.getAccessToken()

    if (!accessToken) {
      throw new Error("No access token available")
    }

    const response = await fetch(`http://127.0.0.1:8000/farm/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(farmData),
    })

    return this.handleResponse(response)
  }

  // Join a farm
  async joinFarm(farmId: string, role: string) {
    const accessToken = this.getAccessToken()

    if (!accessToken) {
      throw new Error("No access token available")
    }

    const response = await fetch(`http://127.0.0.1:8000/join-farm/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ farm_id: farmId, role }),
    })

    return this.handleResponse(response)
  }

  // Set government access
  async setGovernmentAccess(data: { department: string; region: string; access_key: string }) {
    const accessToken = this.getAccessToken()

    if (!accessToken) {
      throw new Error("No access token available")
    }

    const response = await fetch(`http://127.0.0.1:8000/government-access/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })

    return this.handleResponse(response)
  }

  // Refresh access token
  async refreshToken() {
    const refreshToken = this.getRefreshToken()

    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await fetch(`${API_BASE_URL}/refresh-token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    const data = await this.handleResponse(response)

    if (data.access_token) {
      localStorage.setItem("accessToken", data.access_token)
    }

    return data
  }

  // Request password reset
  async requestPasswordReset(data: { email: string }) {
    const response = await fetch(`${API_BASE_URL}/password-reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    return this.handleResponse(response)
  }

  // Reset password
  async resetPassword(data: ResetPasswordData) {
    const response = await fetch(`${API_BASE_URL}/password-reset-confirm/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    return this.handleResponse(response)
  }

  // Edit profile
  async editProfile(data: EditProfileData) {
    const accessToken = this.getAccessToken()

    if (!accessToken) {
      throw new Error("No access token available")
    }

    const response = await fetch(`${API_BASE_URL}/edit-profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })

    return this.handleResponse(response)
  }

  // Change password
  async changePassword(data: ChangePasswordData) {
    const accessToken = this.getAccessToken()

    if (!accessToken) {
      throw new Error("No access token available")
    }

    const response = await fetch(`${API_BASE_URL}/change-password/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })

    return this.handleResponse(response)
  }

  // Logout
  async logout() {
    const refreshToken = this.getRefreshToken()

    if (!refreshToken) {
      this.clearTokens()
      return { message: "Logged out" }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      const data = await this.handleResponse(response)
      this.clearTokens()
      return data
    } catch (error) {
      // Even if the API call fails, clear tokens
      this.clearTokens()
      throw error
    }
  }

  // Get current user
  async getCurrentUser() {
    const accessToken = this.getAccessToken()

    if (!accessToken) {
      return null
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/user/me/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          try {
            await this.refreshToken()
            // Retry with new token
            return this.getCurrentUser()
          } catch (refreshError) {
            this.clearTokens()
            return null
          }
        }
        this.clearTokens()
        return null
      }

      return await response.json()
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }
}

const authService = new AuthService()
export default authService

