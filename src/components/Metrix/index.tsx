import { Grid, Stack, Typography, TextField, Card } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export const Metrix = () => {
  return (
    <Card variant="outlined" sx={{ width: "100%", p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Диапазон дат
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Начало"
              value={null}
              onChange={() => {}}
              renderInput={(params) => <TextField {...params} fullWidth />}
              ampm={false}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Конец"
              value={null}
              onChange={() => {}}
              renderInput={(params) => <TextField {...params} fullWidth />}
              ampm={false}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

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
