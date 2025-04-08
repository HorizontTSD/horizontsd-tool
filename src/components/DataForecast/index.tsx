import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { WeatherStatCard, CustomizedDataGrid, LoadForecastGraphBlock } from "components";
// import CustomizedTreeView from "./CustomizedTreeView";
// import CustomizedDataGrid from "./CustomizedDataGrid";
// import HighlightedCard from "./HighlightedCard";
// import PageViewsBarChart from "./PageViewsBarChart";
// import SessionsChart from "./SessionsChart";
// import { StatCard } from "components";
import { useTranslation } from "react-i18next";
import { LoadForecastGraphBlockCopy } from "components/LoadForecastGraphBlockcopy";
import { MetrixDateRangeBlock } from "components/MetrixModelsBlock";

export const DataForecast = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const lang = currentLanguage.toLowerCase();
  const { t } = useTranslation();

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {t("ready_made_forecast_page.additional_info")}
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        <WeatherStatCard />
      </Grid>
      <Grid container spacing={2} columns={1} sx={{ mb: 2 }}>
        <Grid size={{ xs: 1, lg: 1 }}>
          {/* <LoadForecastGraphBlock /> */}
          <LoadForecastGraphBlockCopy />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        columns={1}
        sx={{
          mb: 2,
          border: `0.8px solid lightgray`,
          padding: 2,
          borderRadius: 1,
        }}
      >
        <Grid item xs={12}>
          <MetrixDateRangeBlock />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={1}>
        <Grid size={{ xs: 1, lg: 1 }}>
          <CustomizedDataGrid />
        </Grid>
      </Grid>
    </Box>
  );
};
