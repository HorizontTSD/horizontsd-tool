import axios from "axios";
import { useState, useEffect } from "react";

interface DateRangeResponse {
  [sensorId: string]: {
    earliest_date: string;
    max_date: string;
    start_default_date: string;
    end_default_date: string;
  };
}

interface MetricsResponse {
  [sensorId: string]: {
    [model: string]: {
      MAE: number;
      R2: number;
      MAPE: number;
    };
  };
}

export const useSensorMetrics = (sensorId: string) => {
  const [dateRange, setDateRange] = useState<{
    earliestDate: string;
    maxDate: string;
    startDefaultDate: string;
    endDefaultDate: string;
  }>({
    earliestDate: "",
    maxDate: "",
    startDefaultDate: "",
    endDefaultDate: "",
  });
  const [metrics, setMetrics] = useState<MetricsResponse>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDateRange = async () => {

      const sensorId = "arithmetic_1464947681"

      const request_data = { "sensor_ids": [sensorId] }

      try {
        const response = await axios.post<DateRangeResponse>(
          "/backend/v1/fetch_possible_date_for_metrix",
          request_data
        );
        const data = response.data[sensorId];
        setDateRange(data);
      } catch (error) {
        console.error("Ошибка при загрузке диапазона дат: 2", error);
        setError("Не удалось загрузить диапазон дат 2.");
        setError(request_data)
      }
    };

    fetchDateRange();
  }, [sensorId]);

  const fetchMetrics = async (dateStart: string, dateEnd: string) => {
    const { earliestDate, maxDate } = dateRange;

    if (new Date(dateStart) < new Date(earliestDate) || new Date(dateEnd) > new Date(maxDate)) {
      setError("Выберите дату в пределах допустимого диапазона 2.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<MetricsResponse>(
        "/backend/v1/metrix_by_period",
        {
          sensor_ids: [sensorId],
          date_start: dateStart,
          date_end: dateEnd,
        }
      );
      const data = response.data[sensorId];
      setMetrics(data);
    } catch (error) {
      console.error("Ошибка при загрузке метрик 2:", error);
      setError("Не удалось загрузить метрики 2.");
    } finally {
      setLoading(false);
    }
  };

  return {
    dateRange,
    metrics,
    loading,
    error,
    fetchMetrics,
  };
};
