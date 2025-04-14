import { Typography, Card, Box, CircularProgress, Alert, Grid } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { useMetrixData, useMetrixRange } from "hooks";
import { useEffect, useState } from "react";
import { Metrics } from "types";
import LatexEquation from "./LatexEquation";

const MetricCard = ({
  title,
  value,
  unit = "",
  equation = "",
}: {
  title: string;
  value: number;
  unit?: string;
  equation?: string;
}) => (
  <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h5" sx={{ mt: 1 }}>
      {value.toFixed(2)}
      {unit}
    </Typography>

    {equation && (
      <Box sx={{ mt: 2, wordWrap: "break-word", overflow: "hidden" }}>
        <LatexEquation equation={equation} />
      </Box>
    )}
  </Card>
);

const ModelSection = ({ modelName, metrics }: { modelName: string; metrics: Metrics }) => (
  <Box sx={{ mb: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
      {modelName}
    </Typography>
    <Box
      sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, maxWidth: "100%" }}
    >
      <Box sx={{ minWidth: 280, height: "auto" }}>
        <MetricCard
          title="Средняя абсолютная ошибка (MAE)"
          value={metrics.MAE}
          equation="\\text{MAE} = \\frac{1}{n} \\sum_{i=1}^{n} |y_i - \\hat{y}_i|"
        />
      </Box>
      <Box sx={{ minWidth: 280, height: "auto" }}>
        <MetricCard
          title="Среднеквадратичная ошибка (RMSE)"
          value={metrics.RMSE}
          equation="\\text{RMSE} = \\sqrt{\\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2}"
        />
      </Box>
      <Box sx={{ minWidth: 280, height: "auto" }}>
        <MetricCard
          title="Коэффициент детерминации (R²)"
          value={metrics.R2}
          equation="R^2 = 1 - \\frac{\\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2}{\\sum_{i=1}^{n} (y_i - \\bar{y})^2}"
        />
      </Box>
      <Box sx={{ minWidth: 280, height: "auto" }}>
        <MetricCard
          title="Средняя процентная ошибка (MAPE)"
          value={metrics.MAPE}
          unit="%"
          equation="\\text{MAPE} = \\frac{1}{n} \\sum_{i=1}^{n} \\left| \\frac{y_i - \\hat{y}_i}{y_i} \\right| \\times 100"
        />
      </Box>
    </Box>
  </Box>
);

export const Metrix = () => {
  const { earliestDate, maxDate, startDefaultDate, endDefaultDate } = useMetrixRange();
  const [startDate, setStartDate] = useState<Date | null>(startDefaultDate);
  const [endDate, setEndDate] = useState<Date | null>(endDefaultDate);

  useEffect(() => {
    setStartDate(startDefaultDate);
    setEndDate(endDefaultDate);
  }, [startDefaultDate, endDefaultDate]);

  const { metrics, loading, error } = useMetrixData(startDate, endDate);
  return (
    <>
      <Typography variant="h5">Метрики моделей за выбранный период</Typography>
      <Card variant="outlined" sx={{ width: "100%", p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Диапазон дат
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
          <Grid container spacing={2}>
            <Grid component="div">
              <DateTimePicker
                label="Начальная дата"
                ampm={false}
                format="dd.MM.yyyy HH:mm"
                value={startDate}
                onChange={setStartDate}
                minDate={earliestDate || undefined}
                maxDate={endDate || maxDate || undefined}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid component="div">
              <DateTimePicker
                label="Конечная дата"
                ampm={false}
                format="dd.MM.yyyy HH:mm"
                value={endDate}
                onChange={setEndDate}
                minDate={startDate || startDefaultDate || undefined}
                maxDate={maxDate || undefined}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>

        <Box sx={{ mt: 2 }}>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Ошибка загрузки данных: {error}
            </Alert>
          )}

          {metrics && metrics.length > 0 && (
            <>
              <ModelSection modelName="Модель XGBoost" metrics={metrics[0].XGBoost} />
              <ModelSection modelName="Модель LSTM" metrics={metrics[0].LSTM} />
            </>
          )}

          {!loading && !metrics && !error && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Выберите диапазон дат для отображения метрик прогнозирования
            </Alert>
          )}
        </Box>
      </Card>
    </>
  );
};
