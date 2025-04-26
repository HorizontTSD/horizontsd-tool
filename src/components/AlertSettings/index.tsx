import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { LoadForecastPureGraph } from "@/components/LoadForecastGraphBlock/LoadForecastPureGraph";
import { useForecastData } from "@/hooks";

export const AlertSettings = () => {
  const [showGraph, setShowGraph] = useState(false);
  const { chartData } = useForecastData();

  const handleToggleGraph = () => {
    setShowGraph(!showGraph);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        p: 3,
        position: "relative",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Создание Уведомления
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        onClick={handleToggleGraph}
        sx={{
          py: 2,
          mb: 3,
          fontSize: "1rem",
          fontWeight: "bold",
          textTransform: "none",
          border: "2px solid",
          borderColor: "primary.main",
        }}
      >
        {showGraph ? "Скрыть график" : "Показать график"}
      </Button>

      {showGraph && chartData && (
        <Box
          sx={{
            width: "100%",
            height: 615,
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            backgroundColor: "background.paper",
            mt: 8,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <LoadForecastPureGraph
            sensorId={chartData?.description?.sensor_id}
            series={chartData?.series}
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Настройки уведомления
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          mb: 3,
          "& > *": {
            flex: "1 1 200px",
            minWidth: 0,
          },
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Пороговое значение
          </Typography>
          <Typography variant="body1">101.00</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Схема оповещения
          </Typography>
          <Typography variant="body1">above</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Частота обновления
          </Typography>
          <Typography variant="body1">1d</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Интервал предупреждения (за минут)
          </Typography>
          <Typography variant="body1">60</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          "& > *": {
            flex: "1 1 200px",
            minWidth: 0,
          },
        }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Начало интервала
          </Typography>
          <Typography variant="body1">2025/04/13</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Конец интервала
          </Typography>
          <Typography variant="body1">2025/04/13</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Начало времени
          </Typography>
          <Typography variant="body1">00:00</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Окончание времени
          </Typography>
          <Typography variant="body1">23:59</Typography>
        </Box>
      </Box>
    </Box>
  );
};
