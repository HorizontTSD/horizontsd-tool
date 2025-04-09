import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { GridDropdown } from "components/ui/GridDropdown";
import { useForecastData, useGridData } from "hooks";

export const CustomizedDataGrid: React.FC = () => {
  const { metricsTables } = useForecastData();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const { rows, columns } = useGridData(metricsTables, selectedModel);

  return (
    <Box
      style={{
        height: 700,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: "10px",
      }}
    >
      <GridDropdown selectedModel={selectedModel} onSelect={setSelectedModel} />

      <DataGrid
        sx={{
          width: "100%",
        }}
        rows={rows}
        columns={columns}
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
