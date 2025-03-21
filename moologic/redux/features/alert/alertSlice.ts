import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { alertApi } from "@/services/api-service"

interface Alert {
  id: string
  cattle: string
  message: string
  due_date: string
  priority: string
  is_read: boolean
  created_at: string
}

interface AlertState {
  alerts: Alert[]
  loading: boolean
  error: string | null
}

const initialState: AlertState = {
  alerts: [],
  loading: false,
  error: null,
}

// Async thunk for fetching all alerts
export const fetchAllAlerts = createAsyncThunk("alert/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await alertApi.getAllAlerts()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch alerts")
  }
})

// Async thunk for marking an alert as read
export const markAlertAsRead = createAsyncThunk("alert/markAsRead", async (id: string, { rejectWithValue }) => {
  try {
    const response = await alertApi.markAsRead(id)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to mark alert as read")
  }
})

// Async thunk for deleting an alert
export const deleteAlert = createAsyncThunk("alert/delete", async (id: string, { rejectWithValue }) => {
  try {
    await alertApi.deleteAlert(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete alert")
  }
})

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all alerts
      .addCase(fetchAllAlerts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllAlerts.fulfilled, (state, action) => {
        state.loading = false
        state.alerts = action.payload
      })
      .addCase(fetchAllAlerts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Mark alert as read
      .addCase(markAlertAsRead.fulfilled, (state, action) => {
        const index = state.alerts.findIndex((a) => a.id === action.payload.id)
        if (index !== -1) {
          state.alerts[index] = action.payload
        }
      })

      // Delete alert
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.alerts = state.alerts.filter((a) => a.id !== action.payload)
      })
  },
})

export default alertSlice.reducer

