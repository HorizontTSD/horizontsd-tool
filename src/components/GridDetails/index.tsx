import * as React from "react";
import { DataGrid, GridColDef, GridRowsProp, GridCellParams } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { Box } from "@mui/material";

interface CustomRow {
  id: number;
  time: string;
  actualConsumption: string;
  predictedConsumption: number;
  Mape: number;
  R2: number;
  RMSE: number;
  MAE: number[];
}

function renderSparklineCell(params: GridCellParams<number[], any>) {
  const data = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);

  if (!params.value || params.value.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
      <SparkLineChart
        data={params.value}
        width={params.colDef.computedWidth || 200}
        height={32}
        showHighlight
        showTooltip
        colors={["hsl(210, 98%, 42%)"]}
        xAxis={{
          scaleType: "band",
          data,
        }}
      />
    </div>
  );
}

function renderStatus(status: "Online" | "Offline") {
  const colors = {
    Online: "success",
    Offline: "default",
  } as const;

  return <Chip label={status} color={colors[status]} size="small" />;
}

const columns: GridColDef[] = [
  { field: "time", headerName: "Time", flex: 1, minWidth: 200 },
  {
    field: "actualConsumption",
    headerName: "Actual Consumption",
    width: 250,
    renderCell: (params) => renderStatus(params.value as "Online" | "Offline"),
  },
  {
    field: "predictedConsumption",
    headerName: "Predicted Consumption",
    type: "number",
    headerAlign: "center",
    align: "center",
    width: 320,
  },
  {
    flex: 1,
    field: "Mape",
    headerName: "Mape",
    type: "number",
    headerAlign: "center",
    align: "center",
    width: 100,
  },
  {
    flex: 1,
    field: "R2",
    headerName: "R2",
    type: "number",
    headerAlign: "center",
    align: "center",
    width: 100,
  },
  {
    flex: 1,
    field: "RMSE",
    headerName: "RMSE",
    headerAlign: "center",
    align: "center",
    width: 100,
  },
  {
    flex: 1,
    field: "MAE",
    headerName: "MAE",
    headerAlign: "center",
    align: "center",
    width: 100,
    renderCell: renderSparklineCell,
  },
];

const rows: GridRowsProp<CustomRow> = [
  {
    id: 1,
    time: "2023-01-01 08:00",
    actualConsumption: "Online",
    predictedConsumption: 12345,
    Mape: 0.12,
    R2: 0.95,
    RMSE: 234,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 50),
  },
  {
    id: 2,
    time: "2023-01-01 12:00",
    actualConsumption: "Online",
    predictedConsumption: 16534,
    Mape: 0.15,
    R2: 0.93,
    RMSE: 245,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 60),
  },
  {
    id: 3,
    time: "2023-01-01 16:00",
    actualConsumption: "Online",
    predictedConsumption: 18765,
    Mape: 0.18,
    R2: 0.91,
    RMSE: 278,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 70),
  },
  {
    id: 4,
    time: "2023-01-02 08:00",
    actualConsumption: "Online",
    predictedConsumption: 14321,
    Mape: 0.11,
    R2: 0.96,
    RMSE: 198,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 55),
  },
  {
    id: 5,
    time: "2023-01-02 12:00",
    actualConsumption: "Online",
    predictedConsumption: 15678,
    Mape: 0.14,
    R2: 0.94,
    RMSE: 223,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 65),
  },
  {
    id: 6,
    time: "2023-01-02 16:00",
    actualConsumption: "Online",
    predictedConsumption: 19876,
    Mape: 0.17,
    R2: 0.92,
    RMSE: 267,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 75),
  },
  {
    id: 7,
    time: "2023-01-03 08:00",
    actualConsumption: "Online",
    predictedConsumption: 13456,
    Mape: 0.1,
    R2: 0.97,
    RMSE: 187,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 52),
  },
  {
    id: 8,
    time: "2023-01-03 12:00",
    actualConsumption: "Online",
    predictedConsumption: 16789,
    Mape: 0.13,
    R2: 0.95,
    RMSE: 215,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 68),
  },
  {
    id: 9,
    time: "2023-01-03 16:00",
    actualConsumption: "Online",
    predictedConsumption: 17654,
    Mape: 0.16,
    R2: 0.93,
    RMSE: 254,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 72),
  },
  {
    id: 10,
    time: "2023-01-04 08:00",
    actualConsumption: "Online",
    predictedConsumption: 14567,
    Mape: 0.09,
    R2: 0.98,
    RMSE: 176,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 58),
  },
  {
    id: 11,
    time: "2023-01-04 12:00",
    actualConsumption: "Online",
    predictedConsumption: 17890,
    Mape: 0.12,
    R2: 0.96,
    RMSE: 208,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 62),
  },
  {
    id: 12,
    time: "2023-01-04 16:00",
    actualConsumption: "Online",
    predictedConsumption: 18765,
    Mape: 0.15,
    R2: 0.94,
    RMSE: 237,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 78),
  },
  {
    id: 13,
    time: "2023-01-05 08:00",
    actualConsumption: "Online",
    predictedConsumption: 15678,
    Mape: 0.08,
    R2: 0.99,
    RMSE: 165,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 53),
  },
  {
    id: 14,
    time: "2023-01-05 12:00",
    actualConsumption: "Online",
    predictedConsumption: 18901,
    Mape: 0.11,
    R2: 0.97,
    RMSE: 195,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 67),
  },
  {
    id: 15,
    time: "2023-01-05 16:00",
    actualConsumption: "Online",
    predictedConsumption: 19876,
    Mape: 0.14,
    R2: 0.95,
    RMSE: 226,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 73),
  },
  {
    id: 16,
    time: "2023-01-06 08:00",
    actualConsumption: "Online",
    predictedConsumption: 16789,
    Mape: 0.07,
    R2: 0.99,
    RMSE: 154,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 57),
  },
  {
    id: 17,
    time: "2023-01-06 12:00",
    actualConsumption: "Online",
    predictedConsumption: 19012,
    Mape: 0.1,
    R2: 0.98,
    RMSE: 183,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 63),
  },
  {
    id: 18,
    time: "2023-01-06 16:00",
    actualConsumption: "Online",
    predictedConsumption: 20987,
    Mape: 0.13,
    R2: 0.96,
    RMSE: 217,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 79),
  },
  {
    id: 19,
    time: "2023-01-06 08:00",
    actualConsumption: "Online",
    predictedConsumption: 16789,
    Mape: 0.07,
    R2: 0.99,
    RMSE: 154,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 57),
  },
  {
    id: 20,
    time: "2023-01-06 12:00",
    actualConsumption: "Online",
    predictedConsumption: 19012,
    Mape: 0.1,
    R2: 0.98,
    RMSE: 183,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 63),
  },
  {
    id: 21,
    time: "2023-01-06 16:00",
    actualConsumption: "Online",
    predictedConsumption: 20987,
    Mape: 0.13,
    R2: 0.96,
    RMSE: 217,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 79),
  },
  {
    id: 22,
    time: "2023-01-06 08:00",
    actualConsumption: "Online",
    predictedConsumption: 16789,
    Mape: 0.07,
    R2: 0.99,
    RMSE: 154,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 57),
  },
  {
    id: 23,
    time: "2023-01-06 12:00",
    actualConsumption: "Online",
    predictedConsumption: 19012,
    Mape: 0.1,
    R2: 0.98,
    RMSE: 183,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 63),
  },
  {
    id: 24,
    time: "2023-01-06 16:00",
    actualConsumption: "Online",
    predictedConsumption: 20987,
    Mape: 0.13,
    R2: 0.96,
    RMSE: 217,
    MAE: Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 79),
  },
];

export const CustomizedDataGrid: React.FC = () => {
  return (
    <Box style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        disableColumnResize
        density="compact"
        initialState={{
          pagination: { paginationModel: { pageSize: 100 } },
        }}
        pageSizeOptions={[100, 200, 500]}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: "outlined",
                size: "small",
              },
              columnInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              operatorInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: "outlined",
                  size: "small",
                },
              },
            },
          },
        }}
      />
    </Box>
  );
};
