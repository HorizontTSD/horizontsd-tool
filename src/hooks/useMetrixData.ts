import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { MetricsResponse } from "types";

export const useMetrixData = (dateStart: Date | null, dateEnd: Date | null) => {
  const sensorId = useSelector((state: RootState) => state.sensor.selectedModel);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!sensorId || !dateStart || !dateEnd) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axios.post<MetricsResponse>(`${import.meta.env.VITE_BACKEND}/backend/v1/metrix_by_period`, {
          sensor_ids: [sensorId],
          date_start: dateStart.toISOString(),
          date_end: dateEnd.toISOString(),
        });

        setMetrics(response.data);
      } catch (err) {
        console.error("Не удалось загрузить метрики:", err);
        setError("Не удалось загрузить метрики");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [sensorId, dateStart, dateEnd]);

  return { metrics, loading, error };
};
