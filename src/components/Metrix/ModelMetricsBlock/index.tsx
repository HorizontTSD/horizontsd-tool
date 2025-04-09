// import { Grid, Card, CardContent, Typography, Stack, Chip } from "@mui/material";
// import { useMetrics } from "hooks";

// interface ModelMetrics {
//   MAE: number;
//   MAPE: number;
//   R2: number;
//   RMSE: number;
//   mark?: string;
//   markColor?: string;
// }

// interface Metrics {
//   [modelName: string]: ModelMetrics;
// }

// export const ModelMetricsBlock = () => {
//   return (
//     <Grid
//       container
//       spacing={2}
//       sx={{
//         width: "100%",
//         display: "flex",
//         gap: 5,
//         justifyContent: "center",
//         flexWrap: "wrap",
//         marginTop: 3,
//         p: 2,
//       }}
//     >
//       {metrics &&
//         Object.entries(metrics).map(([modelName, modelMetrics]) => (
//           <Grid key={modelName} component="div">
//             <Card
//               variant="outlined"
//               sx={{
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 boxShadow: 3,
//                 "&:hover": {
//                   boxShadow: 3,
//                   transform: "scale(1.15)",
//                   transition: "0.3s",
//                 },
//               }}
//             >
//               <CardContent sx={{ flexGrow: 1 }}>
//                 <Typography
//                   component="h2"
//                   variant="h6"
//                   sx={{
//                     fontWeight: "bold",
//                     marginBottom: 1,
//                     color: "text.primary",
//                     fontSize: "1.1rem",
//                     textAlign: "center",
//                     textTransform: "capitalize",
//                   }}
//                 >
//                   {modelName}
//                 </Typography>

//                 <Stack direction="column" sx={{ gap: 1 }}>
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       fontSize: "1rem",
//                       color: "text.secondary",
//                       fontWeight: 500,
//                       display: "flex",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <span>MAPE:</span>
//                     <span style={{ fontWeight: "bold", color: "primary.main" }}>
//                       {modelMetrics.MAPE}
//                     </span>
//                   </Typography>

//                   <Typography
//                     variant="body1"
//                     sx={{
//                       fontSize: "1rem",
//                       color: "text.secondary",
//                       fontWeight: 500,
//                       display: "flex",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <span>R2:</span>
//                     <span style={{ fontWeight: "bold", color: "primary.main" }}>
//                       {modelMetrics.R2}
//                     </span>
//                   </Typography>

//                   <Typography
//                     variant="body1"
//                     sx={{
//                       fontSize: "1rem",
//                       color: "text.secondary",
//                       fontWeight: 500,
//                       display: "flex",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <span>MAE:</span>
//                     <span style={{ fontWeight: "bold", color: "primary.main" }}>
//                       {modelMetrics.MAE}
//                     </span>
//                   </Typography>

//                   <Typography
//                     variant="body1"
//                     sx={{
//                       fontSize: "1rem",
//                       color: "text.secondary",
//                       fontWeight: 500,
//                       display: "flex",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <span> RMSE: </span>
//                     <span style={{ fontWeight: "bold", color: "primary.main" }}>
//                       {modelMetrics.RMSE}
//                     </span>
//                   </Typography>

//                   {modelMetrics.mark && (
//                     <Chip
//                       size="small"
//                       label={modelMetrics.mark}
//                       color={modelMetrics.markColor || "default"}
//                       sx={{
//                         marginTop: 1,
//                         fontSize: "0.875rem",
//                       }}
//                     />
//                   )}
//                 </Stack>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//     </Grid>
//   );
// };
