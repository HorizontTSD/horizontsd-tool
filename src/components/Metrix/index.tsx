import { Typography, Card, Box, CircularProgress, Alert, Grid } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { useMetrixData, useMetrixRange } from "hooks";
import { useEffect, useState } from "react";
import { Metrics } from "types";
import { useTranslation } from "react-i18next";
import LatexEquation from "./LatexEquation";

type MetricConfig = { key: string; titleKey: string; equation: string; unit?: string };
const METRIC_CONFIG: MetricConfig[] = [
  {
    key: "MAE",
    titleKey: "metrix_bloc.mae",
    equation: "MAE = (1/n) ∑|y_i - ŷ_i|",
  },
  {
    key: "RMSE",
    titleKey: "metrix_bloc.rmse",
    equation: "RMSE = √(1/n ∑(y_i - ŷ_i)²)",
  },
  {
    key: "R2",
    titleKey: "metrix_bloc.r2",
    equation: "R² = 1 - (∑(y_i - ŷ_i)²) / (∑(y_i - ȳ)²)",
  },
  {
    key: "MAPE",
    titleKey: "metrix_bloc.mape",
    equation: "MAPE = (1/n) ∑ |(y_i - ŷ_i) / y_i| × 100",
    unit: "%",
  },
];

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

    {equation && (
      <Box sx={{ mt: 2, wordWrap: "break-word", overflow: "hidden" }}>
        <LatexEquation equation={equation} />
      </Box>
    )}
  </Card>
);

const ModelSection = ({ modelName, metrics }: { modelName: string; metrics: Metrics }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: "medium" }}>
        {modelName}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          width: "100%",
        }}
      >
        {METRIC_CONFIG.map(({ key, titleKey, equation, unit }) => (
          <MetricCard
            key={key}
            title={t(titleKey)}
            value={metrics[key as keyof Metrics] ?? 0}
            equation={equation}
            unit={unit}
          />
        ))}
      </Box>

    </Box>
  );
};

export const Metrix = () => {
  const { earliestDate, maxDate, startDefaultDate, endDefaultDate } = useMetrixRange();
  const [startDate, setStartDate] = useState<Date | null>(startDefaultDate);
  const [endDate, setEndDate] = useState<Date | null>(endDefaultDate);
  const { t } = useTranslation();

  useEffect(() => {
    setStartDate(startDefaultDate);
    setEndDate(endDefaultDate);
  }, [startDefaultDate, endDefaultDate]);

  const { metrics, loading, error } = useMetrixData(startDate, endDate);
  return (
    <>
      <Typography variant="h5">{t("metrix_bloc.title")}</Typography>
      <Card variant="outlined" sx={{ width: "100%", p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {t("metrix_bloc.date_range")}
        </Typography>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
          <Grid container spacing={2}>
            <Grid component="div">
              <DateTimePicker
                label={t("metrix_bloc.start_date")}
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
                label={t("metrix_bloc.end_date")}
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
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {t("metrix_bloc.error_1")} {error}
            </Alert>
          )}

          {metrics && metrics.length > 0 && (
            <>
              <ModelSection
                modelName={t("metrix_bloc.model_xgboost")}
                metrics={metrics[0].XGBoost}
              />
              <ModelSection
                modelName={t("metrix_bloc.model_xgboost")}
                metrics={metrics[0].XGBoost}
              />
              <ModelSection modelName={t("metrix_bloc.model_lstm")} metrics={metrics[0].LSTM} />
            </>
          )}
        </Box>
      </Card>
    </>
  );
};
