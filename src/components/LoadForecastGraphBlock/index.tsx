import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { ModelSelectorDropdown } from "components/ui/ModelSelectorDropdown";
import { LoadForecastPureGraph } from "./LoadForecastPureGraph";
import { useForecastData, useSensorModels } from "hooks";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setSelectedModel } from "store";
import { exportForecastToExcel } from "utils";

export const LoadForecastGraphBlock = () => {
  const dispatch = useDispatch();
  const selectedModel = useSelector((state: RootState) => state.sensor.selectedModel);
  const { models } = useSensorModels();
  const { chartData, excelInfo } = useForecastData();

  const handleDownload = () => {
    if (excelInfo) {
      exportForecastToExcel(excelInfo);
    }
  };

  const handleModelSelect = (model: string) => {
    dispatch(setSelectedModel(model));
  };

  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 2,
        }}
      >
        <Box sx={{ order: 1 }}>
          <ModelSelectorDropdown
            availableModels={models}
            selectedModel={selectedModel}
            onSelect={handleModelSelect}
          />
        </Box>

        <Box
          sx={{
            order: { xs: 2, sm: 2 },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: { xs: "100%", sm: "auto" },
            flexGrow: 1,
            gap: 2,
          }}
        >
          {chartData ? (
            <Typography
              component="div"
              sx={{
                fontSize: "clamp(8px, 1.2vw, 20px)",
                fontWeight: "bold",
                textAlign: { xs: "left", sm: "left" },
              }}
            >
              {t("ready_made_forecast_page.forecast_chart")}:{" "}
              {t("ready_made_forecast_page.sensor_name")} -{" "}
              <span
                style={{
                  backgroundColor: "rgba(34, 145, 255, 0.2)",
                  color: "inherit",
                  border: "2px solid #2291FF",
                  borderRadius: "12px",
                  padding: "2px 8px",
                  fontWeight: "bold",
                }}
              >
                {chartData.description.sensor_name}
              </span>{" "}
              :{" "}
              <span style={{ fontWeight: "bold" }}>
                {t("ready_made_forecast_page.sensor_id")} -{" "}
                <span
                  style={{
                    backgroundColor: "rgba(254, 76, 76, 0.2)",
                    color: "inherit",
                    border: "2px solid #FE4C4C",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontWeight: "bold",
                  }}
                >
                  {chartData.description.sensor_id}
                </span>
              </span>
            </Typography>
          ) : (
            <Typography>Данные ещё загружаются...</Typography>
          )}

            <Button
              onClick={handleDownload}
              disabled={!excelInfo?.data?.length}
              sx={{
                width: { xs: "100%", sm: "130px" },
                maxWidth: "100%",
                padding: "6px 12px",
                fontSize: "clamp(8px, 1.5vw, 16px)",
                backgroundColor: "#26AD50",
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  backgroundColor: "#218B3D",
                },
              }}
            >
             <DownloadIcon />
            {t("ready_made_forecast_page.download_button")}
          </Button>
        </Box>
      </Box>

      <Card variant="outlined" sx={{ width: "100%", height: 615, p: 2, borderRadius: "10px" }}>
        <Box sx={{ position: "relative", height: "100%" }}>
          {!chartData ? (
            <Box
              sx={{
                width: "100%",
                height: 615,
                p: 2,
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress
                sx={{
                  display: "flex",
                  margin: "0 auto",
                }}
                size={150}
              />
            </Box>
          ) : (
            <LoadForecastPureGraph
              sensorId={chartData?.description?.sensor_id}
              series={chartData?.series}
            />
          )}
        </Box>
      </Card>
    </>
  );
};
