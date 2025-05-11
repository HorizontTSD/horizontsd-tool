import { useColorScheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Stack, Typography } from "@mui/material";

import Icon from "./Icon";

export const Sidebar = () => {
	const { mode } = useColorScheme();
	const isDark = mode === "dark";
	const bgPalette = ['var(--mui-palette-secondary-dark)', 'var(--mui-palette-secondary-main)']
	const bg = bgPalette[~~(!isDark)]

	return (
		<Stack direction={"column"} sx={{
			height: `100%`,
			width: `15%`,
			minWidth: `200px`,
			justifyContent: `start`,
			alignItems: `center`
		}}>
			<Box
				sx={{
					width: `100%`,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: `row`,
					minHeight: `60px`,
					boxSizing: `border-box`,
					borderBottom: "2px solid",
					borderColor: bg,
					boxShadow: `none`
				}}
			>
				<Icon color={bg} size="s" />
				<Typography variant="h5" sx={{ marginLeft: `1rem`, lineHeight: `1rem`, marginBottom: `-3px` }}>HorizonTSD</Typography>
			</Box>
			<Stack
				direction={"column"}
				sx={{
					height: `100%`,
					width: `100%`,
					display: "flex",
					flexDirection: "column",
				}}
			>
				MenuContent
			</Stack>
		</Stack>
	);
};
