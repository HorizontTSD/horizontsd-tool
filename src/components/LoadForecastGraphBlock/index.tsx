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

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const lang = currentLanguage.toLowerCase();
  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "center",
          mb: 2,
        }}
      >
        <ModelSelectorDropdown
          availableModels={models}
          selectedModel={selectedModel}
          onSelect={handleModelSelect}
        />
        {chartData ? (
          <Typography
            component="div"
            style={{ fontSize: "clamp(8px, 1.2vw, 20px)", fontWeight: "bold" }}
          >
            {t("ready_made_forecast_page.forecast_chart")}:{" "}
            {t("ready_made_forecast_page.sensor_name")} -{" "}
            <span
              style={{
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                color: "inherit",
                border: "1px solid blue",
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
                  backgroundColor: "rgba(255, 0, 0, 0.2)",
                  color: "inherit",
                  border: "1px solid red",
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
            ml: 2,
            widows: "130px",
            maxWidth: "100%",
            padding: "6px 12px",
            fontSize: "clamp(8px, 1.5vw, 16px)",
            backgroundColor: "rgb(129, 199, 132)",
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              backgroundColor: "rgb(70, 130, 180)",
            },
          }}
        >
          <DownloadIcon />
          {t("ready_made_forecast_page.download_button")}
        </Button>
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
              sensorId={chartData.description.sensor_id}
              series={chartData.series}
            />
          )}
        </Box>
      </Card>
    </>
  );
};
