import { Theme, useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import { areaElementClasses } from "@mui/x-charts/LineChart";
import { useFuncGetMiniChartsDataBackendV1GetMiniChartsDataGetQuery } from "@/shared/api/backend";

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

export const WeatherStatCard = () => {
  const theme = useTheme();
  const colors = trendColors(theme);
  const { data: charts, isLoading, error } = useFuncGetMiniChartsDataBackendV1GetMiniChartsDataGetQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading charts data</div>;
  if (!charts) return null;

  return (
    <Stack direction={"row"} sx={{ justifyContent: `space-between`, width: `100%`, alignItems: `center`, padding: `1rem 0` }}>
      {charts.map((stat, i) => (
        <Card key={i} variant="outlined" sx={{ maxHeight: `360px`, width: `100%`, marginRight: i < charts.length - 1 ? `1rem` : "none" }}>
          <Stack direction="column" sx={{ padding: `1rem` }}>
            <Typography variant="h6" gutterBottom>
              {stat.title['en']}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">{stat.values}</Typography>
              <Chip
                sx={{ lineHeight: `1rem`, fontSize: `1rem` }}
                size="small"
                label={`${stat.percentages.value} ${trendLabels[stat.percentages.mark]}`}
                color={chipColors[stat.percentages.mark]}
              />
            </Stack>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {stat.description['en']}
            </Typography>
            <SparkLineChart
              color={colors[stat.percentages.mark]}
              data={stat.data.map((el) => el.value)}
              area
              showHighlight
              showTooltip
              xAxis={{
                scaleType: "point",
                data: stat.data.map((el) => new Date(el.datetime)),
              }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: colors[stat.percentages.mark],
                  opacity: 0.3,
                },
              }}
            />
          </Stack>
        </Card>
      ))
      }
    </Stack>
  );
};
