import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { useCallback, useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const QuickForecast = () => {
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsLoading(true);
      setFile(event.target.files[0]);
      setTimeout(() => setIsLoading(false), 2000);
    }
  }, []);

  const handleGoogleSheetsSubmit = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  }, [googleSheetsUrl]);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setIsLoading(true);
      setFile(event.dataTransfer.files[0]);
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Быстрый прогноз
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() =>
            setGoogleSheetsUrl("https://docs.google.com/spreadsheets/d/your-example-sheet-id/edit")
          }
          disabled={isLoading}
        >
          Попробуйте на примере правильного файла
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Введите URL-адрес файла Google Sheets
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Должен содержать столбцы 'время' и 'целевое значение'
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <input
            type="text"
            value={googleSheetsUrl}
            onChange={(e) => setGoogleSheetsUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            style={{
              flexGrow: 1,
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
            disabled={isLoading}
          />
          <Button
            variant="outlined"
            onClick={handleGoogleSheetsSubmit}
            disabled={!googleSheetsUrl || isLoading}
            sx={{ minWidth: 100 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Загрузить"}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          my: 3,
          "&::before, &::after": {
            content: '""',
            flex: 1,
            borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <Typography variant="body1" sx={{ px: 2 }}>
          Или
        </Typography>
      </Box>

      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          position: "relative",
          minHeight: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border: "2px dashed",
          borderColor: isDragging ? "primary.main" : "divider",
          borderRadius: 1,
          backgroundColor: isDragging ? "action.hover" : "background.paper",
          transition: "all 0.3s ease",
          p: 4,
        }}
      >
        {isLoading ? (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Идет загрузка...</Typography>
          </>
        ) : file ? (
          <Box sx={{ textAlign: "center" }}>
            <Typography>
              Выбран файл: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }} onClick={handleRemoveFile}>
              Удалить файл
            </Button>
          </Box>
        ) : (
          <>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{
                p: 3,
                borderStyle: "dashed",
                backgroundColor: "transparent",
              }}
            >
              <Typography>
                {isDragging
                  ? "Отпустите файл для загрузки"
                  : "Перетащите файл сюда или нажмите для выбора"}
              </Typography>
              <VisuallyHiddenInput
                type="file"
                accept=".csv, .xlsx, .xls"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              Максимальный размер файла: 200MB • Поддерживаемые форматы: CSV, XLSX
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};
