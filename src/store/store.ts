import { configureStore } from "@reduxjs/toolkit";
import forecastReducer from "./forecastSlice";
import miniChartsReducer from "./miniChartsSlice";
import dashboardNavigationReducer from "./dashboardNavigatorSlice";

export const store = configureStore({
  reducer: {
    forecast: forecastReducer,
    miniCharts: miniChartsReducer,
    dashboardNavigation: dashboardNavigationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
