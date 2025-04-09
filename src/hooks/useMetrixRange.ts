import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

type DateInfo = {
  earliest_date: string;
  max_date: string;
  start_default_date: string;
  end_default_date: string;
};

type ResponseData = Record<string, DateInfo>;

export const useMetrixRange = () => {
  const sensorId = useSelector((state: RootState) => state.sensor.selectedModel);
  const [data, setData] = useState();

  console.log(data);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (sensorId) {
          const response = await axios.post<ResponseData>(
            "/backend/v1/fetch_possible_date_for_metrix",
            {
              sensor_ids: [sensorId],
            }
          );

          setData(response.data[sensorId]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (sensorId) {
      fetchData();
    }
  }, [sensorId]);

  return { data };
};
