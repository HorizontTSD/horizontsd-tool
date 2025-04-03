import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setForecastData } from "store/forecastSlice";
import { ForecastData } from "types";
import { RootState } from "store";

export const selectForecastData = (state: RootState) => state.forecast.data;
const isValidForecastData = (data: unknown): data is ForecastData => {
  return !!data && typeof data === "object" && "arithmetic_1464947681" in data;
};

const FORECAST_DATA_KEY = "forecastData";

const useForecastData = () => {
  const dispatch = useDispatch();

  const fetchDataFromServer = useCallback(async () => {
    try {
      const response = await axios.get<ForecastData>("/backend/v1/get_forecast_data");
      console.log("Полученные данные с сервера:", response.data);

      if (isValidForecastData(response.data)) {
        dispatch(setForecastData(response.data));
        localStorage.setItem(FORECAST_DATA_KEY, JSON.stringify(response.data));
      } else {
        console.error("Данные с сервера имеют некорректную структуру");
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных с сервера:", error);
    }
  }, [dispatch]);

  const loadDataFromLocalStorage = useCallback(() => {
    try {
      const savedData = localStorage.getItem(FORECAST_DATA_KEY);
      if (!savedData) return null;

      const parsedData: unknown = JSON.parse(savedData);
      if (isValidForecastData(parsedData)) {
        dispatch(setForecastData(parsedData));
        console.log("Загружены данные из localStorage:", parsedData);
        return parsedData;
      } else {
        console.error("Данные в localStorage имеют некорректную структуру");
        localStorage.removeItem(FORECAST_DATA_KEY);
        return null;
      }
    } catch (error) {
      console.error("Ошибка при разборе данных из localStorage:", error);
      localStorage.removeItem(FORECAST_DATA_KEY);
      return null;
    }
  }, [dispatch]);

  useEffect(() => {
    const loadedData = loadDataFromLocalStorage();
    if (!loadedData) {
      fetchDataFromServer();
    }
  }, [loadDataFromLocalStorage, fetchDataFromServer]);
};

export default useForecastData;
