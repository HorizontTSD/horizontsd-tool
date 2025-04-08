import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SensorState {
  models: string[];
  isFetched: boolean;
  selectedModel: string | null;
}

const initialState: SensorState = {
  models: [],
  isFetched: false,
  selectedModel: null,
};

const sensorSlice = createSlice({
  name: "sensor",
  initialState,
  reducers: {
    setModels(state, action: PayloadAction<string[]>) {
      state.models = action.payload;
      state.isFetched = true;
      state.selectedModel = action.payload[0] || null;
    },
    setSelectedModel(state, action: PayloadAction<string>) {
      state.selectedModel = action.payload;
    },
  },
});

export const { setModels, setSelectedModel } = sensorSlice.actions;
export default sensorSlice.reducer;
