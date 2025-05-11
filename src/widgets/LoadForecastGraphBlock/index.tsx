import React from "react";
import { Box, Card, CircularProgress, Stack, Typography } from "@mui/material";
import { LoadForecastPureGraph } from "@/widgets/LoadForecastGraphBlock/LoadForecastPureGraph";
import { useState, useEffect } from "react";
import {
  useFuncGetForecastDataBackendV1GetForecastDataPostMutation,
  useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery
} from "@/shared/api/backend";

// Style helpers
const highlightStyle = {
  backgroundColor: "rgba(34, 145, 255, 0.2)",
  border: "2px solid #2291FF",
  borderRadius: "12px",
  padding: "2px 8px",
  fontWeight: "bold",
};

const downloadButtonStyle = {
  width: { xs: "100%", sm: "130px" },
  backgroundColor: "#26AD50",
  "&:hover": { backgroundColor: "#218B3D" },
};

const spinnerContainerStyle = {
  height: 615,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};


import { Navbar } from "./Navbar";


export const LoadForecastGraphBlock = () => {
  const { data: sensorsList, error: sensorsListError, isLoading: sensorsListLoading } = useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery();
  const [triggerForecast, { data, isLoading, error }] = useFuncGetForecastDataBackendV1GetForecastDataPostMutation();

  // Track selected model
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Set initial selected model and trigger first forecast when sensors load
  useEffect(() => {
    if (sensorsList?.[0]) {
      const firstSensor = sensorsList[0];
      setSelectedModel(firstSensor);

      // Trigger initial forecast
      triggerForecast({
        forecastData: {
          sensor_ids: [firstSensor]
        }
      }).unwrap().catch(err => console.error('Failed to fetch initial forecast:', err));
    }
  }, [sensorsList, triggerForecast]);  // Added triggerForecast to dependencies

  const handleSubmit = async (selected: string) => {
    setSelectedModel(selected);
    try {
      await triggerForecast({
        forecastData: {
          sensor_ids: [selected]
        }
      }).unwrap();
    } catch (err) {
      console.error('Failed to fetch forecast:', err);
    }
  };

  // Get current forecast data based on selection
  const currentData = data?.[0]?.[selectedModel || ''];

  return (
    <Stack direction={"column"} sx={{ margin: `1rem 0` }}>

      <Typography variant="h4" sx={{ textTransform: "capitalize" }}>Forecast</Typography>

      <Stack direction={"column"} sx={{ margin: `1rem 0` }}>

        {sensorsListLoading ? <div>Loading...</div>
          : sensorsListError ? <div>Error loading sensors!</div>
            : <Navbar
              availableModels={sensorsList || []}
              selectedModel={selectedModel || ''}
              onSelect={handleSubmit}
            />
        }
      </Stack>



      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isLoading && <Typography>Data loading...</Typography>}
        </Box>
      </Box>

      <Card variant="outlined" sx={{ width: "100%", p: 1, minHeight: `600px` }}>
        {error && (
          <div style={{ color: 'red' }}>
            Error: {'data' in error ? error.data.detail : 'Unknown error'}
          </div>
        )}
        {currentData
          ? <LoadForecastPureGraph initialData={currentData} />
          : <Box sx={spinnerContainerStyle}><CircularProgress size={150} /></Box>
        }
      </Card>
    </Stack>
  );
};
