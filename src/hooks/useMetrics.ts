import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

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

export const useMetrics = (sensorId: string, dateStart: Date | null, dateEnd: Date | null) => {
  const [earliestDate, setEarliestDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);
  const [metrics, setMetricsState] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDateRange = async () => {
      const request_data = { sensor_ids: [sensorId] };
      try {
        const response = await axios.post<DateRangeResponse>(
          "backend/v1/fetch_possible_date_for_metrix",
          request_data
        );
        const data = response.data[sensorId];
        setEarliestDate(new Date(data.earliest_date));
        setMaxDate(new Date(data.max_date));
      } catch (error) {
        console.error("Ошибка при загрузке диапазона дат:", error);
        setError("Не удалось загрузить диапазон дат.");
      }
    };

    fetchDateRange();
  }, [sensorId]);

  useEffect(() => {
    if (dateStart && dateEnd) {
      fetchMetrics();
    }
  }, [dateStart, dateEnd]);

  const fetchMetrics = async () => {
    setError(null);

    const earliestDateISO = dayjs(earliestDate).format("YYYY-MM-DD HH:mm:ss");
    const maxDateISO = dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");

    if (new Date(dateStart) < new Date(earliestDate) || new Date(dateEnd) > new Date(maxDate)) {
      setError(
        `Выберите дату в пределах допустимого диапазона. Допустимый диапазон - с ${earliestDateISO} по ${maxDateISO}.`
      );
      return;
    }

    if (new Date(dateStart) > new Date(dateEnd)) {
      setError(`Дата начала должна быть меньше даты конца`);
      return;
    }

    setError(null);

    const dateStartISO = dayjs(dateStart).format("YYYY-MM-DD HH:mm:ss");
    const dateEndISO = dayjs(dateEnd).format("YYYY-MM-DD HH:mm:ss");

    setLoading(true);

    const requestData = {
      sensor_ids: [sensorId],
      date_start: dateStartISO,
      date_end: dateEndISO,
    };

    try {
      const response = await axios.post<MetricsResponse>(
        "backend/v1/metrix_by_period",
        requestData
      );
      setMetricsState(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке метрик:", error);
      setError("Не удалось загрузить метрики.");
    } finally {
      setLoading(false);
    }
  };

  return {
    earliestDate,
    maxDate,
    metrics,
    loading,
    error,
    setDateStart: (date: Date | null) => setEarliestDate(date),
    setDateEnd: (date: Date | null) => setMaxDate(date),
  };
};
