import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { inseminationApi } from "@/services/api-service"

interface Insemination {
  id: string
  cattle: string
  insemination_date: string
  insemination_type: string
  notes?: string
}

interface InseminationState {
  inseminations: Insemination[]
  selectedInsemination: Insemination | null
  loading: boolean
  error: string | null
}

const initialState: InseminationState = {
  inseminations: [],
  selectedInsemination: null,
  loading: false,
  error: null,
}

// Async thunk for fetching all inseminations
export const fetchAllInseminations = createAsyncThunk("insemination/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await inseminationApi.getAllInseminations()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch inseminations")
  }
})

// Async thunk for fetching a single insemination by ID
export const fetchInseminationById = createAsyncThunk(
  "insemination/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await inseminationApi.getInseminationById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch insemination details")
    }
  },
)

// Async thunk for adding a new insemination
export const addInsemination = createAsyncThunk(
  "insemination/add",
  async (data: Omit<Insemination, "id">, { rejectWithValue }) => {
    try {
      const response = await inseminationApi.createInsemination(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add insemination")
    }
  },
)

// Async thunk for updating an insemination
export const updateInsemination = createAsyncThunk(
  "insemination/update",
  async (data: Insemination, { rejectWithValue }) => {
    try {
      const response = await inseminationApi.updateInsemination(data.id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update insemination")
    }
  },
)

// Async thunk for deleting an insemination
export const deleteInsemination = createAsyncThunk("insemination/delete", async (id: string, { rejectWithValue }) => {
  try {
    await inseminationApi.deleteInsemination(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete insemination")
  }
})

const inseminationSlice = createSlice({
  name: "insemination",
  initialState,
  reducers: {
    setSelectedInsemination: (state, action: PayloadAction<Insemination | null>) => {
      state.selectedInsemination = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all inseminations
      .addCase(fetchAllInseminations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllInseminations.fulfilled, (state, action) => {
        state.loading = false
        state.inseminations = action.payload
      })
      .addCase(fetchAllInseminations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch insemination by ID
      .addCase(fetchInseminationById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInseminationById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedInsemination = action.payload
      })
      .addCase(fetchInseminationById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Add insemination
      .addCase(addInsemination.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addInsemination.fulfilled, (state, action) => {
        state.loading = false
        state.inseminations.push(action.payload)
      })
      .addCase(addInsemination.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update insemination
      .addCase(updateInsemination.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateInsemination.fulfilled, (state, action) => {
        state.loading = false
        const index = state.inseminations.findIndex((i) => i.id === action.payload.id)
        if (index !== -1) {
          state.inseminations[index] = action.payload
        }
        if (state.selectedInsemination?.id === action.payload.id) {
          state.selectedInsemination = action.payload
        }
      })
      .addCase(updateInsemination.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete insemination
      .addCase(deleteInsemination.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteInsemination.fulfilled, (state, action) => {
        state.loading = false
        state.inseminations = state.inseminations.filter((i) => i.id !== action.payload)
        if (state.selectedInsemination?.id === action.payload) {
          state.selectedInsemination = null
        }
      })
      .addCase(deleteInsemination.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setSelectedInsemination } = inseminationSlice.actions
export default inseminationSlice.reducer

