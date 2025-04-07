import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SensorData } from "types";

interface ForecastState {
  data: SensorData | null;
}

const initialState: ForecastState = {
  data: null,
};

const forecastSlice = createSlice({
  name: "forecast",
  initialState,
  reducers: {
    setForecastData(state, action: PayloadAction<SensorData>) {
      state.data = action.payload;
    },
  },
});

export const { setForecastData } = forecastSlice.actions;
export default forecastSlice.reducer;
