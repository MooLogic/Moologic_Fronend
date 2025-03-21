import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { cattleApi } from "@/services/api-service"

interface Cattle {
  id: string
  ear_tag_no: string
  breed?: string
  birth_date: string
  gender: string
  life_stage: string
  gestation_status: string
  health_status: string
  dam_id?: string
  sire_id?: string
  is_purchased: boolean
  purchase_date?: string
  purchase_source?: string
  last_insemination_date?: string
  last_calving_date?: string
  expected_calving_date?: string
  expected_insemination_date?: string
}

interface CattleState {
  cattle: Cattle[]
  selectedCattle: Cattle | null
  loading: boolean
  error: string | null
}

const initialState: CattleState = {
  cattle: [],
  selectedCattle: null,
  loading: false,
  error: null,
}

// Async thunk for fetching all cattle
export const fetchAllCattle = createAsyncThunk("cattle/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await cattleApi.getAllCattle()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch cattle")
  }
})

// Async thunk for fetching a single cattle by ID
export const fetchCattleById = createAsyncThunk("cattle/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await cattleApi.getCattleById(id)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch cattle details")
  }
})

// Async thunk for adding a new cattle
export const addCattle = createAsyncThunk("cattle/add", async (cattleData: Omit<Cattle, "id">, { rejectWithValue }) => {
  try {
    const response = await cattleApi.createCattle(cattleData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to add cattle")
  }
})

// Async thunk for updating a cattle
export const updateCattle = createAsyncThunk("cattle/update", async (cattleData: Cattle, { rejectWithValue }) => {
  try {
    const response = await cattleApi.updateCattle(cattleData.id, cattleData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to update cattle")
  }
})

// Async thunk for deleting a cattle
export const deleteCattle = createAsyncThunk("cattle/delete", async (id: string, { rejectWithValue }) => {
  try {
    await cattleApi.deleteCattle(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete cattle")
  }
})

// Async thunk for generating alerts for a cattle
export const generateCattleAlerts = createAsyncThunk(
  "cattle/generateAlerts",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await cattleApi.generateAlerts(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to generate alerts")
    }
  },
)

// Async thunk for updating gestation status
export const updateGestationStatus = createAsyncThunk(
  "cattle/updateGestationStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await cattleApi.updateGestationStatus(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update gestation status")
    }
  },
)

const cattleSlice = createSlice({
  name: "cattle",
  initialState,
  reducers: {
    setSelectedCattle: (state, action: PayloadAction<Cattle | null>) => {
      state.selectedCattle = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all cattle
      .addCase(fetchAllCattle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllCattle.fulfilled, (state, action) => {
        state.loading = false
        state.cattle = action.payload
      })
      .addCase(fetchAllCattle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch cattle by ID
      .addCase(fetchCattleById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCattleById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedCattle = action.payload
      })
      .addCase(fetchCattleById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Add cattle
      .addCase(addCattle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addCattle.fulfilled, (state, action) => {
        state.loading = false
        state.cattle.push(action.payload)
      })
      .addCase(addCattle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update cattle
      .addCase(updateCattle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCattle.fulfilled, (state, action) => {
        state.loading = false
        const index = state.cattle.findIndex((c) => c.id === action.payload.id)
        if (index !== -1) {
          state.cattle[index] = action.payload
        }
        if (state.selectedCattle?.id === action.payload.id) {
          state.selectedCattle = action.payload
        }
      })
      .addCase(updateCattle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete cattle
      .addCase(deleteCattle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCattle.fulfilled, (state, action) => {
        state.loading = false
        state.cattle = state.cattle.filter((c) => c.id !== action.payload)
        if (state.selectedCattle?.id === action.payload) {
          state.selectedCattle = null
        }
      })
      .addCase(deleteCattle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setSelectedCattle } = cattleSlice.actions
export default cattleSlice.reducer

