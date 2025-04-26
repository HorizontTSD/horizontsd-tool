import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { GridDropdown } from "@/components/ui/GridDropdown";
import { useForecastData, useGridData } from "@/hooks";
import { useTranslation } from "react-i18next";

export const CustomizedDataGrid: React.FC = () => {
  const { metricsTables } = useForecastData();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const { rows, columns } = useGridData(metricsTables, selectedModel);
  const { t } = useTranslation();

  useEffect(() => {
    if (metricsTables && !selectedModel) {
      const firstModel = Object.keys(metricsTables)[0];
      if (firstModel) {
        setSelectedModel(firstModel);
      }
    }
  }, [metricsTables, selectedModel]);

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "600",
          mb: 2,
        }}
      >
        {t("metrix_table.title")}
      </Typography>
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
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mb: 2,
          }}
        >
          <GridDropdown selectedModel={selectedModel} onSelect={setSelectedModel} />
        </Box>
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
          pageSizeOptions={[25, 50, 100]}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
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
    </>
  );
};
