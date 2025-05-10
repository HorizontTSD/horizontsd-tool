import { useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMiniCharts } from "store";
import { usePolling } from "./usePoling";

export const useMiniChartData = () => {
  const dispatch = useDispatch();

  const fetchMiniCharts = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND}/backend/v1/get_mini_charts_data`);
      dispatch(setMiniCharts(response.data));
    } catch (err) {
      console.error("Ошибка при получении мини-графиков:", err);
    }
  }, [dispatch]);

  usePolling(fetchMiniCharts, 5 * 60 * 1000, true);

  return null;
};
