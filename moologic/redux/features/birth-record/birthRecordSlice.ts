import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { birthRecordApi } from "@/services/api-service"

interface BirthRecord {
  id: string
  cattle: string
  calving_date: string
  calving_outcome: string
  notes?: string
}

interface BirthRecordState {
  birthRecords: BirthRecord[]
  selectedBirthRecord: BirthRecord | null
  loading: boolean
  error: string | null
}

const initialState: BirthRecordState = {
  birthRecords: [],
  selectedBirthRecord: null,
  loading: false,
  error: null,
}

// Async thunk for fetching all birth records
export const fetchAllBirthRecords = createAsyncThunk("birthRecord/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await birthRecordApi.getAllBirthRecords()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch birth records")
  }
})

// Async thunk for fetching a single birth record by ID
export const fetchBirthRecordById = createAsyncThunk(
  "birthRecord/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await birthRecordApi.getBirthRecordById(id)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch birth record details")
    }
  },
)

// Async thunk for adding a new birth record
export const addBirthRecord = createAsyncThunk(
  "birthRecord/add",
  async (data: Omit<BirthRecord, "id">, { rejectWithValue }) => {
    try {
      const response = await birthRecordApi.createBirthRecord(data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add birth record")
    }
  },
)

// Async thunk for updating a birth record
export const updateBirthRecord = createAsyncThunk(
  "birthRecord/update",
  async (data: BirthRecord, { rejectWithValue }) => {
    try {
      const response = await birthRecordApi.updateBirthRecord(data.id, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update birth record")
    }
  },
)

// Async thunk for deleting a birth record
export const deleteBirthRecord = createAsyncThunk("birthRecord/delete", async (id: string, { rejectWithValue }) => {
  try {
    await birthRecordApi.deleteBirthRecord(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete birth record")
  }
})

const birthRecordSlice = createSlice({
  name: "birthRecord",
  initialState,
  reducers: {
    setSelectedBirthRecord: (state, action: PayloadAction<BirthRecord | null>) => {
      state.selectedBirthRecord = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all birth records
      .addCase(fetchAllBirthRecords.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllBirthRecords.fulfilled, (state, action) => {
        state.loading = false
        state.birthRecords = action.payload
      })
      .addCase(fetchAllBirthRecords.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch birth record by ID
      .addCase(fetchBirthRecordById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBirthRecordById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedBirthRecord = action.payload
      })
      .addCase(fetchBirthRecordById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Add birth record
      .addCase(addBirthRecord.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addBirthRecord.fulfilled, (state, action) => {
        state.loading = false
        state.birthRecords.push(action.payload)
      })
      .addCase(addBirthRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update birth record
      .addCase(updateBirthRecord.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateBirthRecord.fulfilled, (state, action) => {
        state.loading = false
        const index = state.birthRecords.findIndex((b) => b.id === action.payload.id)
        if (index !== -1) {
          state.birthRecords[index] = action.payload
        }
        if (state.selectedBirthRecord?.id === action.payload.id) {
          state.selectedBirthRecord = action.payload
        }
      })
      .addCase(updateBirthRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete birth record
      .addCase(deleteBirthRecord.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteBirthRecord.fulfilled, (state, action) => {
        state.loading = false
        state.birthRecords = state.birthRecords.filter((b) => b.id !== action.payload)
        if (state.selectedBirthRecord?.id === action.payload) {
          state.selectedBirthRecord = null
        }
      })
      .addCase(deleteBirthRecord.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setSelectedBirthRecord } = birthRecordSlice.actions
export default birthRecordSlice.reducer

