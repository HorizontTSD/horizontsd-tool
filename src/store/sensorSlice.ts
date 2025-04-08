import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SensorState {
  models: string[];
  isFetched: boolean;
}

const initialState: SensorState = {
  models: [],
  isFetched: false,
};

const sensorSlice = createSlice({
  name: "sensor",
  initialState,
  reducers: {
    setModels(state, action: PayloadAction<string[]>) {
      state.models = action.payload;
      state.isFetched = true;
    },
  },
});

export const { setModels } = sensorSlice.actions;
export default sensorSlice.reducer;
