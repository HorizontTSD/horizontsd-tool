import { Grid, Typography, Card, Box, CircularProgress, Alert } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { useMetrixData, useMetrixRange } from "hooks";
import { useState } from "react";
import { Metrics } from "types";

const MetricCard = ({
  title,
  value,
  unit = "",
}: {
  title: string;
  value: number;
  unit?: string;
}) => (
  <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h5" sx={{ mt: 1 }}>
      {value.toFixed(2)}
      {unit}
    </Typography>
  </Card>
);

const ModelSection = ({ modelName, metrics }: { modelName: string; metrics: Metrics }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
      {modelName}
    </Typography>
    <Grid container spacing={2}>
      <Box>
        <MetricCard title="Средняя абсолютная ошибка (MAE)" value={metrics.MAE} />
      </Box>
      <Box>
        <MetricCard title="Среднеквадратичная ошибка (RMSE)" value={metrics.RMSE} />
      </Box>
      <Box>
        <MetricCard title="Коэффициент детерминации (R²)" value={metrics.R2} />
      </Box>
      <Box>
        <MetricCard title="Средняя процентная ошибка (MAPE)" value={metrics.MAPE} unit="%" />
      </Box>
    </Grid>
  </Box>
);

export const Metrix = () => {
  const { earliestDate, maxDate, startDefaultDate, endDefaultDate } = useMetrixRange();
  const [startDate, setStartDate] = useState<Date | null>(startDefaultDate);
  const [endDate, setEndDate] = useState<Date | null>(endDefaultDate);
  const { metrics, loading, error } = useMetrixData(startDate, endDate);

  return (
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
  );
};
