import { useColorScheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectProps } from "@mui/material/Select";

export const ColorModeSelect = (props: SelectProps) => {
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <Select
      value={mode}
      onChange={(event) => setMode(event.target.value as "light" | "dark")}
      SelectDisplayProps={
        {
          "data-screenshot": "toggle-mode",
        } as React.HTMLAttributes<HTMLDivElement> & { "data-screenshot": string }
      }
      {...props}
    >
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
    </Select>
  );
};
