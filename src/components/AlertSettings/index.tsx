import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState } from "react";
import { LoadForecastPureGraph } from "components/LoadForecastGraphBlock/LoadForecastPureGraph";

export const AlertSettings = () => {
  const [showGraph, setShowGraph] = useState(false);

  const handleToggleGraph = () => {
    setShowGraph(!showGraph);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Список уведомлений
      </Typography>

      {/* Кнопка для показа/скрытия графика */}
      <Button
        fullWidth
        variant="outlined"
        onClick={handleToggleGraph}
        sx={{
          py: 2, // Увеличиваем вертикальные отступы
          mb: 3, // Отступ снизу
          fontSize: "1rem",
          fontWeight: "bold",
          textTransform: "none", // Чтобы текст не был в верхнем регистре
          border: "2px solid", // Добавим обводку для кнопки
          borderColor: "primary.main", // Цвет обводки
        }}
      >
        {showGraph ? "Скрыть график" : "Показать график"}
      </Button>

      {/* Место для графика (будет показано при showGraph === true) */}
      {showGraph && (
        <Box
          sx={{
            transition: "max-height 0.5s ease-out", // Плавное выдвижение
            maxHeight: showGraph ? "1000px" : "0", // Устанавливаем максимальную высоту, чтобы блок плавно раскрывался
            overflow: "hidden", // Скрываем содержимое за пределами maxHeight
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            mb: 3,
          }}
        >
          <LoadForecastPureGraph
            sensorName={""}
            sensorId={""}
            series={[]}
            legend={{
              last_know_data_line: {
                text: {
                  en: "",
                },
              },
            }}
          />
          <Typography variant="body1" color="text.secondary">
            График будет отображён здесь
          </Typography>
        </Box>
      )}
    </Box>
  );
};
