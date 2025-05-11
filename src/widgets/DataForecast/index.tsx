import { CustomizedDataGrid } from "@/widgets/GridDetails"
import { LoadForecastGraphBlock } from "@/widgets/LoadForecastGraphBlock"
import { Metrix } from "@/widgets/Metrix";
import { WeatherStatCard } from "@/widgets/WeatherStatCard";
import { Stack } from "@mui/material";

// TODO: move to \src\shared\ui\Layout\MainLayout.tsx
export const DataForecast = () => {
  return (
    <Stack sx={{
      padding: `1rem`,
      overflow: `auto`,
    }}>
      <WeatherStatCard />
      <LoadForecastGraphBlock />
      <Metrix />
      <CustomizedDataGrid />
    </Stack>
  );
};
