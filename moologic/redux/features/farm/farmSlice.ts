import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { farmApi } from "@/services/api-service"

interface Farm {
  id: string
  name: string
  location: string
  contact: string
  created_at: string
  updated_at: string
}

interface FarmState {
  farm: Farm | null
  loading: boolean
  error: string | null
}

const initialState: FarmState = {
  farm: null,
  loading: false,
  error: null,
}

// Async thunk for creating a farm
export const createFarm = createAsyncThunk(
  "farm/create",
  async (data: Omit<Farm, "id" | "created_at" | "updated_at">, { rejectWithValue }) => {
    try {
      const response = await farmApi.createFarm(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create farm")
    }
  },
)

// Async thunk for fetching a farm
export const fetchFarm = createAsyncThunk("farm/fetch", async (id: string, { rejectWithValue }) => {
  try {
    const response = await farmApi.getFarm(id)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch farm")
  }
})

// Async thunk for updating a farm
export const updateFarm = createAsyncThunk(
  "farm/update",
  async ({ id, data }: { id: string; data: Partial<Farm> }, { rejectWithValue }) => {
    try {
      const response = await farmApi.updateFarm(id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update farm")
    }
  },
)

// Async thunk for deleting a farm
export const deleteFarm = createAsyncThunk("farm/delete", async (id: string, { rejectWithValue }) => {
  try {
    await farmApi.deleteFarm(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete farm")
  }
})

const farmSlice = createSlice({
  name: "farm",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create farm
      .addCase(createFarm.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createFarm.fulfilled, (state, action) => {
        state.loading = false
        state.farm = action.payload
      })
      .addCase(createFarm.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch farm
      .addCase(fetchFarm.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFarm.fulfilled, (state, action) => {
        state.loading = false
        state.farm = action.payload
      })
      .addCase(fetchFarm.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update farm
      .addCase(updateFarm.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateFarm.fulfilled, (state, action) => {
        state.loading = false
        state.farm = action.payload
      })
      .addCase(updateFarm.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete farm
      .addCase(deleteFarm.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteFarm.fulfilled, (state) => {
        state.loading = false
        state.farm = null
      })
      .addCase(deleteFarm.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default farmSlice.reducer

