import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  LoadForecastGraph,
  OriginalProjectInfo,
  WeatherStatCard,
  CustomizedDataGrid,
} from "components";
// import CustomizedTreeView from "./CustomizedTreeView";
// import CustomizedDataGrid from "./CustomizedDataGrid";
// import HighlightedCard from "./HighlightedCard";
// import PageViewsBarChart from "./PageViewsBarChart";
// import SessionsChart from "./SessionsChart";
// import { StatCard } from "components";

export const MainGrid = () => {
  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Additional information
      </Typography>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        <WeatherStatCard />
      </Grid>
      <Grid container spacing={2} columns={1} sx={{ mb: 2 }}>
        <Grid size={{ xs: 1, lg: 1 }}>
          <LoadForecastGraph />
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={1}>
        <Grid size={{ xs: 1, lg: 1 }}>
          <CustomizedDataGrid />
        </Grid>
      </Grid>
      <OriginalProjectInfo sx={{ my: 4 }} />
    </Box>
  );
};
