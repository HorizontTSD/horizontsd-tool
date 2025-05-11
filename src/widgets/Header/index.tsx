import { useColorScheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { LanguageDropdown } from "../dropdowns/LanguageDropdown";
import { ColorModeIconDropdown } from "../ColorModeIconDropdown";

export function Header() {
  const { mode } = useColorScheme();
  const isDark = mode === "dark";
  const bgPalette = ['var(--mui-palette-secondary-dark)', 'var(--mui-palette-secondary-main)']
  const bg = bgPalette[~~(!isDark)]
  return (
    <Stack
      sx={{
        alignItems: "center",
        background: bg,
        display: "flex",
        flexDirection: `row`,
        justifyContent: "center",
        minHeight: `60px`,
        width: `100%`,
        padding: `1rem`
      }}
    >
      <Stack direction={"row"} justifyContent={"start"} alignItems={"baseline"} sx={{ width: `100%` }}>
        <Typography variant="h5" sx={{ color: `var(--mui-palette-common-white)` }}>FORECAST</Typography>
        <Typography variant="caption" sx={{ color: `var(--mui-palette-common-white)` }}>© 2025 Horizon TSD</Typography>
      </Stack>
      <Stack
        direction="row"
        justifySelf="end"
        spacing={1}
        sx={{
          width: '100%',
          justifyContent: 'end',
          alignItems: 'center',
        }}>
        <LanguageDropdown />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  )
}
