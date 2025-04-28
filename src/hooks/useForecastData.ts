import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setForecastData, RootState } from "@/store";
import { SensorData, TimeSeriesPoint, ExcelInfo, ForecastMetrics } from "@/types";
import { usePolling } from "@/hooks/usePoling";
import { useTranslation } from "react-i18next";

interface TextLocale {
  ru: string;
  en: string;
}

interface NewForecastResponse {
  [index: string]: SensorData;
}

const isValidForecastData = (data: unknown): data is NewForecastResponse => {
  if (!data || typeof data !== "object" || data === null) return false;

  const zeroData = (data as Record<string, unknown>)["0"];
  if (!zeroData || typeof zeroData !== "object" || zeroData === null) return false;

  return Object.keys(zeroData).length > 0;
};

export const useForecastData = () => {
  const dispatch = useDispatch();
  const forecastData = useSelector((state: RootState) => state.forecast.data);
  const selectedModel = useSelector((state: RootState) => state.sensor.selectedModel);
  const { i18n } = useTranslation();
  const currentLanguage = 'en-US' // i18n.language;
  const lang = currentLanguage.toLowerCase() as keyof TextLocale;

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
  }, []);

  const prepareChartData = useCallback(
    (data: SensorData) => {
      if (!data || !selectedModel || !data[selectedModel]) return null;

      const sensorData = data[selectedModel];

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
    [lang, parseSeriesData, selectedModel]
  );

  const prepareExcelInfo = useCallback((data: SensorData, model: string): ExcelInfo | null => {
    if (!data || !model || !data[model]) return null;

    const sensorData = data[model];
    return {
      data: sensorData.table_to_download || [],
      sensorName: sensorData.description.sensor_name,
      sensorId: sensorData.description.sensor_id,
    };
  }, []);

  const prepareMetricsTables = useCallback((data: SensorData, model: string) => {
    if (!data || !model || !data[model]) return null;

    const sensorData = data[model];
    const metrixTables = sensorData.metrix_tables;

    if (!metrixTables) return null;

    const metricsResult: { [key: string]: ForecastMetrics[] } = {};

    Object.entries(metrixTables).forEach(([key, value]) => {
      if (value?.metrics_table) {
        metricsResult[key] = value.metrics_table;
      }
    });

    return metricsResult;
  }, []);

  const fetchData = useCallback(async (): Promise<SensorData | null> => {
    try {
      if (!selectedModel) return null;
      const response = await axios.post<NewForecastResponse>(`${import.meta.env.VITE_BACKEND}/backend/v1/get_forecast_data`, {
        sensor_ids: [selectedModel],
      });

      if (isValidForecastData(response.data)) {
        const transformedData: SensorData = {
          [selectedModel]: response.data[0][selectedModel],
        };
        dispatch(setForecastData(transformedData));
        return transformedData;
      }
      console.error("Invalid data structure from server");
      return null;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }, [dispatch, selectedModel]);

  usePolling(fetchData, 5 * 60 * 1000, true);

  return {
    fetchData,
    forecastData,
    chartData: forecastData ? prepareChartData(forecastData) : null,
    excelInfo: forecastData && selectedModel ? prepareExcelInfo(forecastData, selectedModel) : null,
    metricsTables:
      forecastData && selectedModel ? prepareMetricsTables(forecastData, selectedModel) : null,
  };
};
