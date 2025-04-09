import { createSlice } from "@reduxjs/toolkit";

type ActiveDashboardComponent = "forecast" | "alerts" | "analytics" | "quick-forecast" | "about";

interface DashboardNavigationState {
  activeComponent: ActiveDashboardComponent;
}

const initialState: DashboardNavigationState = {
  activeComponent: "forecast",
};

export const dashboardNavigationSlice = createSlice({
  name: "dashboardNavigation",
  initialState,
  reducers: {
    setActiveDashboardComponent: (state, action: { payload: ActiveDashboardComponent }) => {
      state.activeComponent = action.payload;
    },
  },
});

export const { setActiveDashboardComponent } = dashboardNavigationSlice.actions;
export default dashboardNavigationSlice.reducer;
