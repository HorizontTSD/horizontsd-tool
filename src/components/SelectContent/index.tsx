import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent, selectClasses } from "@mui/material/Select";
import type {} from "@mui/material/themeCssVarsAugmentation";
import { useState } from "react";

export const SelectContent = () => {
  const [company, setCompany] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setCompany(event.target.value as string);
  };

  return (
    <Select
      labelId="company-select"
      id="company-simple-select"
      value={company}
      onChange={handleChange}
      displayEmpty
      inputProps={{ "aria-label": "Select company" }}
      fullWidth
      sx={{
        marginBottom: 54,
        maxHeight: 56,
        width: 215,
        "&.MuiList-root": {
          p: "8px",
        },
        [`& .${selectClasses.select}`]: {
          display: "flex",
          alignItems: "center",
          gap: "2px",
          pl: 1,
        },
      }}
    >
      <MenuItem value="">
        <ListItemText primary="XGBoost" />
      </MenuItem>
      <MenuItem value={10}>
        <ListItemText primary="Neural network" />
      </MenuItem>
    </Select>
  );
};
