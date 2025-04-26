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
  const [thresholdValue, setThresholdValue] = useState(101.0);
  const [alertInterval, setAlertInterval] = useState(60);
  const [startDate, setStartDate] = useState<Date | null>(new Date("2025-04-13"));
  const [endDate, setEndDate] = useState<Date | null>(new Date("2025-04-13"));
  const [startTime, setStartTime] = useState<Date | null>(new Date(0, 0, 0, 0, 0));
  const [endTime, setEndTime] = useState<Date | null>(new Date(0, 0, 0, 23, 59));
  const [alertScheme, setAlertScheme] = useState("above");
  const [updateFrequency, setUpdateFrequency] = useState("1d");
  const [notificationTitle, setNotificationTitle] = useState("Test");
  const [notificationMessage, setNotificationMessage] = useState("Пороговое значение превышено!");
  const [telegramNicknames, setTelegramNicknames] = useState(["Никнейм 1"]);
  const [emails, setEmails] = useState(["Email 1"]);

  const handleToggleGraph = () => {
    setShowGraph(!showGraph);
  };

  const handleThresholdIncrement = () => {
    setThresholdValue((prev) => +(prev + 1).toFixed(2));
  };

  const handleThresholdDecrement = () => {
    setThresholdValue((prev) => +(prev - 1).toFixed(2));
  };

  const handleIntervalIncrement = () => {
    setAlertInterval((prev) => prev + 5);
  };

  const handleIntervalDecrement = () => {
    setAlertInterval((prev) => (prev > 5 ? prev - 5 : prev));
  };

  const handleAddTelegramNickname = () => {
    setTelegramNicknames([...telegramNicknames, ""]);
  };

  const handleRemoveTelegramNickname = (index: number) => {
    const newNicknames = [...telegramNicknames];
    newNicknames.splice(index, 1);
    setTelegramNicknames(newNicknames);
  };

  const handleTelegramNicknameChange = (index: number, value: string) => {
    const newNicknames = [...telegramNicknames];
    newNicknames[index] = value;
    setTelegramNicknames(newNicknames);
  };

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleCreateNotification = () => {
    alert("Уведомление успешно создано!");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
      <Box
        sx={{
          width: "100%",
          maxWidth: { sm: "100%", md: "1700px" },
          p: 3,
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

        <Collapse in={showGraph}>
          {chartData && (
            <Box
              sx={{
                width: "100%",
                height: 615,
                mb: 3,
                backgroundColor: "background.paper",
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
        </Collapse>

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
          <TextField
            label="Пороговое значение"
            value={thresholdValue}
            onChange={(e) => setThresholdValue(Number(e.target.value))}
            fullWidth
            type="number"
            InputProps={{
              endAdornment: (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton size="small" onClick={handleThresholdDecrement}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleThresholdIncrement}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              ),
            }}
          />

          <FormControl fullWidth>
            <InputLabel id="frequency-label">Частота обновления</InputLabel>
            <Select
              labelId="frequency-label"
              value={updateFrequency}
              label="Частота обновления"
              onChange={(e) => setUpdateFrequency(e.target.value)}
            >
              <MenuItem value="1h">Каждый час</MenuItem>
              <MenuItem value="6h">Каждые 6 часов</MenuItem>
              <MenuItem value="12h">Каждые 12 часов</MenuItem>
              <MenuItem value="1d">Ежедневно</MenuItem>
              <MenuItem value="1w">Еженедельно</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="alert-scheme-label">Схема оповещения</InputLabel>
            <Select
              labelId="alert-scheme-label"
              value={alertScheme}
              label="Схема оповещения"
              onChange={(e) => setAlertScheme(e.target.value)}
            >
              <MenuItem value="above">above</MenuItem>
              <MenuItem value="below">below</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Интервал предупреждения (в минутах)"
            value={alertInterval}
            onChange={(e) => setAlertInterval(Number(e.target.value))}
            fullWidth
            type="number"
            InputProps={{
              endAdornment: (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton size="small" onClick={handleIntervalDecrement}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleIntervalIncrement}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              ),
            }}
          />
        </Box>

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
          <DatePicker
            label="Начало интервала"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
              },
            }}
          />
          <DatePicker
            label="Конец интервала"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
              },
            }}
          />
          <TimePicker
            label="Начало времени"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
              },
            }}
          />
          <TimePicker
            label="Окончание времени"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Контент уведомления
          </Typography>
          <TextField
            label="Название уведомления"
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Сообщение уведомления"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            fullWidth
            multiline
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Рассылка
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Telegram никнеймы
              </Typography>
              {telegramNicknames.map((nickname, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TextField
                    value={nickname}
                    onChange={(e) => handleTelegramNicknameChange(index, e.target.value)}
                    fullWidth
                  />
                  <IconButton onClick={() => handleRemoveTelegramNickname(index)}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddTelegramNickname}
                sx={{ mt: 1 }}
              >
                Добавить никнейм
              </Button>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Email адреса
              </Typography>
              {emails.map((email, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TextField
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    fullWidth
                    type="email"
                  />
                  <IconButton onClick={() => handleRemoveEmail(index)}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddEmail}
                sx={{ mt: 1 }}
              >
                Добавить email
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleCreateNotification}
            sx={{ px: 6, py: 2, fontSize: "1.1rem" }}
          >
            Создать уведомление
          </Button>
        </Box>

        <Box sx={{ mt: 6, pt: 3, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="h6" gutterBottom>
            Свяжитесь с нами
          </Typography>
          <Typography variant="body1" paragraph>
            Если у вас есть вопросы или вы хотите узнать больше:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <li>
              <Link href="mailto:support@forecastingtool.com" underline="hover">
                📧 Email: support@forecastingtool.com
              </Link>
            </li>
            <li>
              <Link href="tel:+79155488852" underline="hover">
                📞 Телефон: +7 (915) 548-88-52
              </Link>
            </li>
            <li>
              <Link href="http://horizontsd.ru/" target="_blank" underline="hover">
                🌐 Веб-сайт: horizontsd.ru
              </Link>
            </li>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
