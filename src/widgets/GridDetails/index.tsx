import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Box, Stack, Typography } from "@mui/material";
import { GridDropdown } from "@/widgets/GridDropdown";
import {
  useFuncGetForecastDataBackendV1GetForecastDataPostMutation,
  useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery
} from "@/shared/api/backend";
import { CustomRow } from "@/shared/types";

export const CustomizedDataGrid: React.FC = () => {
  const {
    data:
    sensors,
    isLoading: sensorsLoading,
    error: sensorsError } =
    useFuncGetSensorIdListBackendV1GetSensorIdListGetQuery();
  const [
    triggerForecast, {
      data: forecastData,
      isLoading: forecastLoading,
      error: forecastError
    }] =
    useFuncGetForecastDataBackendV1GetForecastDataPostMutation();

  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Initialize sensor and fetch initial forecast
  useEffect(() => {
    if (sensors?.[0] && !selectedSensor) {
      const initialSensor = sensors[0];
      setSelectedSensor(initialSensor);
      triggerForecast({
        forecastData: { sensor_ids: [initialSensor] }
      }).unwrap().catch(console.error);
    }
  }, [sensors, selectedSensor, triggerForecast]);

  // Extract metrics tables from forecast data
  const metricsTables = forecastData?.[0]?.[selectedSensor || '']?.metrix_tables || {};



  // Initialize model selection
  useEffect(() => {
    if (Object.keys(metricsTables).length > 0 && !selectedModel) {
      setSelectedModel(Object.keys(metricsTables)[0]);
    }
  }, [metricsTables, selectedModel]);



  const rows: GridRowsProp<CustomRow> = useMemo(() => {
    if (!selectedModel || !metricsTables || !metricsTables[selectedModel]?.metrics_table) return [];

    return metricsTables[selectedModel].metrics_table.map((item, index) => {
      const { Time, ...otherFields } = item;
      return {
        id: index,
        Time: new Date(Time as number).toUTCString(),
        ...otherFields,
      };
    });
  }, [metricsTables, selectedModel]);

  const columns: GridColDef[] = useMemo(() => {
    if (!selectedModel || !metricsTables || !metricsTables[selectedModel]?.metrics_table[0]) return [];

    const columnKeys = Object.keys(metricsTables[selectedModel].metrics_table[0]);

    return columnKeys.map((key) => ({
      field: key,
      headerName: key === "Time" ? "Дата и время" : key,
      flex: 1,
      minWidth: 120,
      sortable: true,
      ...(key === "Time" && {
        sortComparator: (v1, v2) => {
          return new Date(v1).getTime() - new Date(v2).getTime();
        },
      }),
    }));
  }, [selectedModel, metricsTables]);

  const handleSubmit = async (selected: string) => {
    if (selectedSensor == selected) return;
    try {
      setSelectedSensor(selected);
      await triggerForecast({
        forecastData: {
          sensor_ids: [selected]
        }
      }).unwrap();
    } catch (err) {
      console.error('Failed to fetch forecast:', err);
    }
  };

  const handleSubmitModel = async (selected: string) => {
    try {
      setSelectedModel(Object.keys(metricsTables)[Object.keys(metricsTables).indexOf(selected)]);
    } catch (err) {
      console.error('Failed to fetch forecast:', err);
    }
  };

  return (
    <Stack direction={"column"} sx={{ margin: `1rem 0` }}>
      <Stack direction={"column"} sx={{ margin: `1rem 0` }}>
        <Typography variant="h4">Table</Typography>
      </Stack>

      <Box sx={{ height: 700, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Stack>
            <Typography>Sensor Selection</Typography>
            <GridDropdown
              list={sensors || []}
              selected={selectedSensor || ''}
              onSelect={handleSubmit}
            />
          </Stack>

          <Stack>
            <Typography>Model Selection</Typography>
            {selectedSensor && (
              <GridDropdown
                list={Object.keys(metricsTables) || []}
                selected={selectedModel || ''}
                onSelect={handleSubmitModel}
              />
            )}
          </Stack>

        </Box>

        {/* Loading and Error States */}
        {sensorsError && (
          <Typography color="error">errors.sensor_fetch</Typography>
        )}
        {forecastError && (
          <Typography color="error">
            errors.forecast_fetch: {JSON.stringify(forecastError)}
          </Typography>
        )}
        {(sensorsLoading || forecastLoading) && (
          <Typography>common.loading</Typography>
        )}

        {/* Data Grid */}
        {!forecastLoading && selectedModel && (
          <DataGrid
            rows={rows}
            columns={columns}
            density="compact"
            pageSizeOptions={[25, 50, 100]}
            initialState={{ pagination: { pageSize: 100 } }}
            disableColumnResize
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            slotProps={{
              filterPanel: {
                filterFormProps: {
                  logicOperatorInputProps: { variant: "outlined", size: "small" },
                  columnInputProps: { variant: "outlined", size: "small", sx: { mt: "auto" } },
                  operatorInputProps: { variant: "outlined", size: "small", sx: { mt: "auto" } },
                  valueInputProps: { InputComponentProps: { variant: "outlined", size: "small" } }
                }
              }
            }}
          />
        )}
      </Box>
    </Stack>
  );
};
