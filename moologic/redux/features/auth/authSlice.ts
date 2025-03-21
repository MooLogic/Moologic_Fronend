import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import authService from "@/services/auth-service"

interface User {
  id: number
  email: string
  username: string
  name?: string
  role?: string
  language?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Async thunks
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData)
      return response
    } catch (error: any) {
      console.error("Signup error in thunk:", error)
      return rejectWithValue(error.message || "Failed to sign up")
    }
  },
)

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response
    } catch (error: any) {
      console.error("Login error in thunk:", error)
      return rejectWithValue(error.message || "Failed to log in")
    }
  },
)

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout()
    return null
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.refreshToken()
    return response
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const editProfile = createAsyncThunk("auth/editProfile", async (profileData: any, { rejectWithValue }) => {
  try {
    const response = await authService.editProfile(profileData)
    return response
  } catch (error: any) {
    return rejectWithValue(error.message)
  }
})

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData: { old_password: string; new_password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(passwordData)
      return response
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  },
)

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder.addCase(signup.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user || null
      state.isAuthenticated = !!action.payload.user
    })
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user || null
      state.isAuthenticated = !!action.payload.user
    })
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false
      state.user = null
      state.isAuthenticated = false
    })
    builder.addCase(logout.rejected, (state) => {
      state.loading = false
      // Even if logout fails on the server, we clear the user state
      state.user = null
      state.isAuthenticated = false
    })

    // Refresh token
    builder.addCase(refreshToken.fulfilled, (state) => {
      state.isAuthenticated = true
    })
    builder.addCase(refreshToken.rejected, (state) => {
      state.user = null
      state.isAuthenticated = false
    })

    // Edit profile
    builder.addCase(editProfile.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(editProfile.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
    })
    builder.addCase(editProfile.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Change password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { setUser, clearError } = authSlice.actions
export default authSlice.reducer

