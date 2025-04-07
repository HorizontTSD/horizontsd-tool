import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import Grid from "@mui/material/Grid";
import { useForecastData } from "hooks/useForecastData";

interface WeatherStat {
  id: number;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  interval?: string;
  data: number[];
}

const trendColors = (theme: Theme) => ({
  up: theme.palette.success.main,
  down: theme.palette.error.main,
  neutral: theme.palette.grey[500],
});

const trendLabels = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

const chipColors = {
  up: "success",
  down: "error",
  neutral: "default",
} as const;

const weatherStats: WeatherStat[] = [
  {
    id: 1,
    title: "Temperature",
    value: "40°F",
    change: "5°F",
    trend: "up",
    interval: "Last 30 days",
    data: [200, 24, 220, 260, 240],
  },
  {
    id: 2,
    title: "Wind Speed",
    value: "9 mph",
    change: "-2 mph",
    trend: "down",
    interval: "Last 30 days",
    data: [380, 100, 240, 280, 240],
  },
  {
    id: 3,
    title: "Humidity",
    value: "60%",
    change: "-4%",
    trend: "neutral",
    interval: "Last 30 days",
    data: [200, 300, 320, 360, 380],
  },
  {
    id: 4,
    title: "Pressure",
    value: "30.28 inHg",
    change: "-2.77 inHg",
    trend: "neutral",
    interval: "Last 30 days",
    data: [500, 600, 700, 800, 900],
  },
];

export const WeatherStatCard = () => {
  const theme = useTheme();
  const colors = trendColors(theme);

  return (
    <>
      {weatherStats.map((stat) => (
        <Grid key={stat.id} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Grid container spacing={2}>
            <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
              <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                  {stat.title}
                </Typography>
                <Stack direction="column" sx={{ gap: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{stat.value}</Typography>
                    <Chip
                      size="small"
                      label={`${trendLabels[stat.trend]} ${stat.change}`}
                      color={chipColors[stat.trend]}
                    />
                  </Stack>
                  {stat.interval && (
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      {stat.interval}
                    </Typography>
                  )}
                  <Box sx={{ width: "100%", height: 50 }}>
                    <SparkLineChart
                      colors={[colors[stat.trend] || colors.neutral]}
                      data={stat.data}
                      area
                      showHighlight
                      showTooltip
                      sx={{
                        [`& .${areaElementClasses.root}`]: {
                          fill: colors[stat.trend] || colors.neutral,
                          opacity: 0.3,
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ))}
    </>
  );
};
