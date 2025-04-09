import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MiniChart {
  title: {
    en: string;
    ru: string;
  };
  values: string;
  description: {
    en: string;
    ru: string;
  };
  percentages: {
    value: number;
    mark: "positive" | "negative";
  };
  data: {
    datetime: number;
    value: number;
  }[];
}

interface MiniChartsState {
  charts: MiniChart[];
}

const initialState: MiniChartsState = {
  charts: [],
};

const miniChartsSlice = createSlice({
  name: "miniCharts",
  initialState,
  reducers: {
    setMiniCharts(state, action: PayloadAction<MiniChart[]>) {
      state.charts = action.payload;
    },
  },
});

export const { setMiniCharts } = miniChartsSlice.actions;
export default miniChartsSlice.reducer;
