import { Grid, Stack, Typography, Card } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { useMetrixRange } from "hooks";
import { useState } from "react";

export const Metrix = () => {
  const { data } = useMetrixRange();
  const [startDate, setStartDate] = useState<string>(startDefaultDate);
  const [endDate, setEndDate] = useState<string>(endDefaultDate);

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
              onChange={(newValue) => setStartDate(newValue)}
              minDate={earliestDate}
              maxDate={endDate || maxDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Grid>
          <Grid component="div">
            <DateTimePicker
              label="Конечная дата"
              ampm={false}
              format="dd.MM.yyyy HH:mm"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={startDate || startDefaultDate}
              maxDate={maxDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

      <Stack sx={{ mt: 4 }}>
        <div
          style={{
            border: "1px dashed #ccc",
            padding: "20px",
            borderRadius: "4px",
            textAlign: "center",
            color: "#666",
          }}
        >
          Блок метрик будет здесь
        </div>
      </Stack>
    </Card>
  );
};
