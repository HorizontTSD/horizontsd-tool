import { useState, useEffect } from "react";
import { Grid, Stack, Typography, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';


interface DateRangeResponse {
  [sensorId: string]: {
    earliest_date: string;
    max_date: string;
    start_default_date: string;
    end_default_date: string;
  };
}

interface MetricsResponse {
  [sensorId: string]: {
    [model: string]: {
      MAE: number;
      R2: number;
      MAPE: number;
    };
  };
}


const ModelMetricsBlock = ({ metrics }) => {
  return (
    <Grid
      container
      spacing={5}
      sx={{
        width: 'fit-content',
        display: 'center',
        gap: 3,
        justifyItems: 'center',
        alignItems: 'center',
        margin: '0 auto',
      }}
    >
      {metrics &&
        Object.entries(metrics).map(([modelName, modelMetrics]) => (
          <Grid item key={modelName}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                display: 'flex',
                flexDirection: 'row',
                ml: 3,
                mr: 3,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 3,
                  transform: 'scale(1.15)',
                  transition: '0.3s',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 2, direction: 'column', }}>
                <Typography
                  component="h2"
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    marginBottom: 1,
                    color: 'text.primary',
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    textTransform: 'capitalize'

                  }}
                >
                  {modelName}
                </Typography>

                <Stack direction="column" sx={{ gap: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1rem',
                      color: 'text.secondary',
                      fontWeight: 500,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>MAPE:</span>
                    <span style={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {modelMetrics.MAPE}
                    </span>
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1rem',
                      color: 'text.secondary',
                      fontWeight: 500,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>R2:</span>
                    <span style={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {modelMetrics.R2}
                    </span>
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1rem',
                      color: 'text.secondary',
                      fontWeight: 500,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>MAE:</span>
                    <span style={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {modelMetrics.MAE}
                    </span>
                  </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '1rem',
                        color: 'text.secondary',
                        fontWeight: 500,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span> RMSE: </span>
                      <span style={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {modelMetrics.RMSE}
                      </span>
                    </Typography>

                  {modelMetrics.mark && (
                    <Chip
                      size="small"
                      label={modelMetrics.mark}
                      color={modelMetrics.markColor || 'default'}
                      sx={{
                        marginTop: 1,
                        fontSize: '0.875rem', // Меньший шрифт для чипа
                      }}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

//
//
// const ModelMetricsBlock = ({ metrics }) => {
//   return (
//     <Grid
//       container
//       spacing={5}
//       sx={{
//         width: 'fit-content',
//         display: 'center',
//         gap: 5,
//         justifyItems: 'center',
//         alignItems: 'center',
//         margin: '0 auto',
//       }}
//     >
//       {metrics &&
//         Object.entries(metrics).map(([modelName, modelMetrics]) => (
//           <Grid item key={modelName}>
//             <Card
//               variant="outlined"
//               sx={{
//                 display: 'grid',
//                 gap: 40,
//                 justifyItems: 'center',
//                 alignItems: 'start',
//                 margin: '1 auto',
//                 width: '100%',
//                 maxWidth: '1000px',
//               }
//           }
//             >
//               <CardContent sx={{ flexGrow: 2, direction: 'column', }}>
//                 <Typography
//                   component="h2"
//                   variant="h6"
//                   sx={{
//                     fontWeight: 'bold',
//                     marginBottom: 1,
//                     color: 'text.primary',
//                     fontSize: '1.1rem',
//                     textAlign: 'center',
//                     textTransform: 'capitalize'
//
//                   }}
//                 >
//                   {modelName}
//                 </Typography>
//
//                 <Stack direction="column" sx={{ gap: 1 }}>
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       fontSize: '1rem',
//                       color: 'text.secondary',
//                       fontWeight: 500,
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                     }}
//                   >
//                     <span>MAPE:</span>
//                     <span style={{ fontWeight: 'bold', color: 'primary.main' }}>
//                       {modelMetrics.MAPE}
//                     </span>
//                   </Typography>
//
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       fontSize: '1rem',
//                       color: 'text.secondary',
//                       fontWeight: 500,
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                     }}
//                   >
//                     <span>R2:</span>
//                     <span style={{ fontWeight: 'bold', color: 'primary.main' }}>
//                       {modelMetrics.R2}
//                     </span>
//                   </Typography>
//
//                   <Typography
//                     variant="body1"
//                     sx={{
//                       fontSize: '1rem',
//                       color: 'text.secondary',
//                       fontWeight: 500,
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                     }}
//                   >
//                     <span>MAE:</span>
//                     <span style={{ fontWeight: 'bold', color: 'primary.main' }}>
//                       {modelMetrics.MAE}
//                     </span>
//                   </Typography>
//
//                     <Typography
//                       variant="body1"
//                       sx={{
//                         fontSize: '1rem',
//                         color: 'text.secondary',
//                         fontWeight: 500,
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                       }}
//                     >
//                       <span> RMSE: </span>
//                       <span style={{ fontWeight: 'bold', color: 'primary.main' }}>
//                         {modelMetrics.RMSE}
//                       </span>
//                     </Typography>
//
//                   {modelMetrics.mark && (
//                     <Chip
//                       size="small"
//                       label={modelMetrics.mark}
//                       color={modelMetrics.markColor || 'default'}
//                       sx={{
//                         marginTop: 1,
//                         fontSize: '0.875rem', // Меньший шрифт для чипа
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


export const MetrixDateRangeBlock = ({ sensorId }: { sensorId: string }) => {
  const { t } = useTranslation();

  const [dateStart, setDateStart] = useState<Date | null>(null);
  const [dateEnd, setDateEnd] = useState<Date | null>(null);

  const [earliestDate, setEarliestDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  const [metrics, setMetricsState] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const sensorId = "arithmetic_1464947681"
    const fetchDateRange = async () => {
      const request_data = { sensor_ids: [sensorId] };
      try {
        const response = await axios.post<DateRangeResponse>(
          "http://77.37.136.11:7072/backend/v1/fetch_possible_date_for_metrix",
          request_data
        );
        const data = response.data[sensorId];
        setDateStart(new Date(data.start_default_date));
        setDateEnd(new Date(data.end_default_date));

        setEarliestDate(new Date(data.earliest_date)); // Устанавливаем earliestDate
        setMaxDate(new Date(data.max_date));


      } catch (error) {
        console.error("Ошибка при загрузке диапазона дат:", error);
        setError("Не удалось загрузить диапазон дат.");
      }
    };

    fetchDateRange();
  }, [sensorId]);

  useEffect(() => {
    if (dateStart && dateEnd) {
      fetchMetrics();
    }
  }, [dateStart, dateEnd]);


  const fetchMetrics = async () => {

     setError(null);

     const earliestDateISO = dayjs(earliestDate).format("YYYY-MM-DD HH:mm:ss");
     const maxDateISO = dayjs(maxDate).format("YYYY-MM-DD HH:mm:ss");


    if (new Date(dateStart) < new Date(earliestDate) || new Date(dateEnd) > new Date(maxDate)) {
      setError(`Выберите дату в пределах допустимого диапазона. Допустимый диапазон - с ${earliestDateISO} по ${maxDateISO}.`);
      return;
    }

    if (new Date(dateStart) > new Date(dateEnd)) {
      setError(`Дата начала должна быть меньше даты конца`);
      return;
    }

    setError(null);

    const dateStartISO = dayjs(dateStart).format("YYYY-MM-DD HH:mm:ss");
    const dateEndISO = dayjs(dateEnd).format("YYYY-MM-DD HH:mm:ss");

    setLoading(true);

    const sensorId = "arithmetic_1464947681"

    const requestData = {
      "sensor_ids": [sensorId],
      "date_start": dateStartISO,
      "date_end": dateEndISO,
    };


    try {
      const response = await axios.post<MetricsResponse>(
        "http://77.37.136.11:7072/backend/v1/metrix_by_period",
        requestData
      );

      const data = response.data[0];
      setMetricsState(data);
    } catch (error) {
      console.error("Ошибка при загрузке метрик:", error);
      setError("Не удалось загрузить метрики.");
    } finally {
      setLoading(false);
    }
  };
return (
  <>
    <Stack sx={{ padding: 1, gap: 6 }}>
      <Grid container spacing={5} alignItems="center">
        <Typography variant="h6">Диапазон дат</Typography>
        <Grid item xs={6} sm={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Начало"
              value={dateStart}
              onChange={(newValue) => setDateStart(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disabled={loading}
              ampm={false}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6} sm={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Конец"
              value={dateEnd}
              onChange={(newValue) => setDateEnd(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              disabled={loading}
              ampm={false}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Stack>

    {error && (
      <Typography color="error" variant="body1">
        {error}
      </Typography>
    )}

    <Stack>
      <Grid
        container
        spacing={5}
        direction="row"
        justifyContent="center"
        alignItems="center"
        padding={2}
      >
        <ModelMetricsBlock metrics={metrics} />
      </Grid>
    </Stack>
  </>
);


};