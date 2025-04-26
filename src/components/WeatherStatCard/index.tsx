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
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "@/store/store";
import { useMiniChartData } from "@/hooks";

const trendColors = (theme: Theme) => ({
  positive: theme.palette.success.main,
  negative: theme.palette.error.main,
});

const trendLabels = {
  positive: "↑",
  negative: "↓",
};

const chipColors = {
  positive: "success",
  negative: "error",
} as const;

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return `${date.getDate()} ${date.toLocaleString("ru", { month: "short" })}`;
};

export const WeatherStatCard = () => {
  useMiniChartData();
  const theme = useTheme();
  const colors = trendColors(theme);
  const charts = useSelector((state: RootState) => state.miniCharts.charts);

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const lang = currentLanguage.split(`-`)[0] as "en" | "ru";
  
  return (
    <>
      {charts.map((stat) => (
        <Grid key={stat.values} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Grid container spacing={2}>
            <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
              <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                  {stat.title[lang]}
                </Typography>
                <Stack direction="column" sx={{ gap: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{stat.values}</Typography>
                    <Chip
                      size="small"
                      label={`${trendLabels[stat.percentages.mark]} ${stat.percentages.value}`}
                      color={chipColors[stat.percentages.mark]}
                    />
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {stat.description[lang]}
                  </Typography>
                  <Box sx={{ width: "100%", height: 50, overflow: "hidden" }}>
                    <SparkLineChart
                      color={colors[stat.percentages.mark]}
                      data={stat.data.map((el) => Number(el.value.toFixed(2)))}
                      area
                      showHighlight
                      showTooltip
                      xAxis={{
                        scaleType: "point",
                        data: stat.data.map((el) => formatDate(el.datetime)),
                      }}
                      sx={{
                        [`& .${areaElementClasses.root}`]: {
                          fill: colors[stat.percentages.mark],
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
