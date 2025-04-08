import { configureStore } from "@reduxjs/toolkit";
import forecastReducer from "./forecastSlice";
import miniChartsReducer from "./miniChartsSlice";
import dashboardNavigationReducer from "./dashboardNavigatorSlice";
import sensorSlice from "./sensorSlice";

export const store = configureStore({
  reducer: {
    forecast: forecastReducer,
    miniCharts: miniChartsReducer,
    dashboardNavigation: dashboardNavigationReducer,
    sensor: sensorSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
