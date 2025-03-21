import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface DiseaseState {
  prediction: any | null
  loading: boolean
  error: string | null
}

const initialState: DiseaseState = {
  prediction: null,
  loading: false,
  error: null,
}

// Async thunk for fetching disease prediction from API
export const fetchDiseasePrediction = createAsyncThunk(
  "disease/fetchPrediction",
  async (data: { symptoms?: string[]; imageUrl?: string }, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response
      return {
        disease: "Bovine Respiratory Disease",
        confidence: 92,
        description: "BRD is a complex of diseases characterized by inflammation of the respiratory tract.",
        treatment: "Antibiotics, anti-inflammatory drugs, and supportive care.",
        prevention: "Vaccination, proper ventilation, and good management practices.",
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch disease prediction")
    }
  },
)

const diseaseSlice = createSlice({
  name: "disease",
  initialState,
  reducers: {
    setPrediction: (state, action: PayloadAction<any>) => {
      state.prediction = action.payload
    },
    clearPrediction: (state) => {
      state.prediction = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiseasePrediction.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDiseasePrediction.fulfilled, (state, action) => {
        state.loading = false
        state.prediction = action.payload
      })
      .addCase(fetchDiseasePrediction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setPrediction, clearPrediction } = diseaseSlice.actions
export default diseaseSlice.reducer

