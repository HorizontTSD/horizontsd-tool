import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import { useForecastData } from "@/hooks/useForecastData";

interface GridDropdownProps {
  selectedModel: string | null;
  onSelect: (model: string) => void;
}

export const GridDropdown = ({ selectedModel, onSelect }: GridDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { metricsTables } = useForecastData();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModelSelect = (model: string) => {
    onSelect(model);
    handleClose();
  };

  const availableModels = Object.entries(metricsTables || {})
    .filter(([, value]) => value && value.length > 0)
    .map(([model]) => model);

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          minWidth: 160,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          padding: "6px 12px",
          width: "auto",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        <Typography variant="body2" sx={{ mr: 1, textTransform: "none" }}>
          {selectedModel || "Select model"}
        </Typography>
        <ArrowDropDownIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 160,
            maxHeight: 300,
            boxShadow: 2,
            mt: 1,
            "& .MuiMenuItem-root": {
              minHeight: 36,
            },
          },
        }}
      >
        {[...availableModels].map((model) => (
          <MenuItem
            key={model}
            selected={model === selectedModel}
            onClick={() => handleModelSelect(model)}
            sx={{
              pl: 2,
              "&.Mui-selected": {
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.selected",
                },
              },
            }}
          >
            <Typography variant="body2" sx={{ textTransform: "none" }}>
              {model}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
