import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setModels } from "@/store/sensorSlice";
import { usePolling } from "@/hooks/usePoling";

interface RootState {
  sensor: {
    models: string[];
    isFetched: boolean;
  };
}

interface SensorModelHook {
  models: string[];
}

export const useSensorModels = (): SensorModelHook => {
  const dispatch = useDispatch();
  const { models, isFetched } = useSelector((state: RootState) => state.sensor);

  const fetchModels = async () => {
    if (isFetched) return;

    try {
      const response = await axios.get<string[]>(`${import.meta.env.VITE_BACKEND}/backend/v1/get_sensor_id_list`);
      dispatch(setModels(response.data));
    } catch (error) {
      console.error("Ошибка при загрузке моделей:", error);
    }
  };

  usePolling(fetchModels, 5 * 60 * 1000);

  return { models };
};
