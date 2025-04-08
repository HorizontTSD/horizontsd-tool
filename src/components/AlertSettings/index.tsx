import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useState } from "react";

export const AlertSettings = () => {
  const [showGraph, setShowGraph] = useState(false);

  const handleToggleGraph = () => {
    setShowGraph(!showGraph);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, p: 3 }}>
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

      {showGraph && (
        <Box
          sx={{
            transition: "max-height 0.5s ease-out",
            maxHeight: showGraph ? "1000px" : "0",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            mb: 3,
          }}
        >
          ГРАФИК
        </Box>
      )}
    </Box>
  );
};
