import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setForecastData } from "store/forecastSlice";
import { RootState } from "store";
import { SensorData, TimeSeriesPoint } from "types";
import { usePolling } from "./usePoling";
import { useTranslation } from "react-i18next";


const isValidForecastData = (data: unknown): data is SensorData => {
  return !!data && typeof data === "object" && "arithmetic_1464947681" in data;
};

export const useForecastData = () => {
  const dispatch = useDispatch();
  const forecastData = useSelector((state: RootState) => state.forecast.data);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const lang = currentLanguage.toLowerCase();

  const parseSeriesData = useCallback((data: unknown): [number, number][] => {
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      return Array.isArray(parsed)
        ? parsed.map((item: TimeSeriesPoint) => [item.datetime, item.load_consumption])
        : [];
    } catch (e) {
      console.error("Error parsing data:", e);
      return [];
    }
  }, [lang]);

  const prepareChartData = useCallback(
    (data: SensorData) => {
      if (!data) return null;

      const firstKey = Object.keys(data)[0] as keyof SensorData;
      const sensorData = data[firstKey];

      if (!sensorData?.map_data?.data || !sensorData?.description) {
        return null;
      }

      const { last_real_data, actual_prediction_lstm, actual_prediction_xgboost, ensemble } =
        sensorData.map_data.data;

      return {
        description: sensorData.description,
        legend: sensorData.map_data.legend,
        series: [
          {
            name: sensorData.map_data.legend.real_data_line.text[lang],
            data: parseSeriesData(last_real_data),
            color: sensorData.map_data.legend.real_data_line.color,
          },
          {
            name: sensorData.map_data.legend.LSTM_data_line.text[lang],
            data: parseSeriesData(actual_prediction_lstm),
            color: sensorData.map_data.legend.LSTM_data_line.color,
          },
          {
            name: sensorData.map_data.legend.XGBoost_data_line.text[lang],
            data: parseSeriesData(actual_prediction_xgboost),
            color: sensorData.map_data.legend.XGBoost_data_line.color,
          },
          {
            name: sensorData.map_data.legend.Ensemble_data_line.text[lang],
            data: parseSeriesData(ensemble),
            color: sensorData.map_data.legend.Ensemble_data_line.color,
            lineWidth: 3,
          },
        ],
      };
    },
    [parseSeriesData]
  );

  const fetchData = useCallback(async (): Promise<SensorData | null> => {
    try {
      const response = await axios.get<SensorData>("/backend/v1/get_forecast_data");

      if (isValidForecastData(response.data)) {
        dispatch(setForecastData(response.data));
        return response.data;
      }
      console.error("Invalid data structure from server");
      return null;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }, [dispatch]);

  usePolling(fetchData, 5 * 60 * 1000, true);

  return {
    fetchData,
    forecastData,
    chartData: forecastData ? prepareChartData(forecastData) : null,
  };
};
