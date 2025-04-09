import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { parseISO } from "date-fns";

type DateInfo = {
  earliest_date: string;
  max_date: string;
  start_default_date: string;
  end_default_date: string;
};

type ResponseData = Record<string, DateInfo>;

export const useMetrixRange = () => {
  const sensorId = useSelector((state: RootState) => state.sensor.selectedModel);
  const [data, setData] = useState<{
    earliestDate: Date | null;
    maxDate: Date | null;
    startDefaultDate: Date | null;
    endDefaultDate: Date | null;
  }>({
    earliestDate: null,
    maxDate: null,
    startDefaultDate: null,
    endDefaultDate: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!sensorId) return;

        const response = await axios.post<ResponseData>(
          "/backend/v1/fetch_possible_date_for_metrix",
          { sensor_ids: [sensorId] }
        );

        const sensorData = response.data[sensorId];
        if (!sensorData) return;

        setData({
          earliestDate: parseISO(sensorData.earliest_date),
          maxDate: parseISO(sensorData.max_date),
          startDefaultDate: parseISO(sensorData.start_default_date),
          endDefaultDate: parseISO(sensorData.end_default_date),
        });
      } catch (error) {
        console.error("Error fetching date range:", error);
        setData({
          earliestDate: null,
          maxDate: null,
          startDefaultDate: null,
          endDefaultDate: null,
        });
      }
    };

    fetchData();
  }, [sensorId]);

  return data;
};
