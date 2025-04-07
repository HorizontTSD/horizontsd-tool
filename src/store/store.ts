import { configureStore } from "@reduxjs/toolkit";
import forecastReducer from "./forecastSlice";
import miniChartsReducer from "./miniChartsSlice";

export const store = configureStore({
  reducer: {
    forecast: forecastReducer,
    miniCharts: miniChartsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
