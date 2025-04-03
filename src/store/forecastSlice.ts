import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ForecastData } from "types";

interface ForecastState {
  data: ForecastData | null;
}

const initialState: ForecastState = {
  data: null,
};

const forecastSlice = createSlice({
  name: "forecast",
  initialState,
  reducers: {
    setForecastData(state, action: PayloadAction<ForecastData>) {
      state.data = action.payload;
    },
  },
});

export const { setForecastData } = forecastSlice.actions;
export default forecastSlice.reducer;
