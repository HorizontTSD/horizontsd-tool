import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Stack, StepLabel, Typography, useColorScheme } from "@mui/material";
import { ColorlibConnector, ColorlibStepIcon } from "./NewForecastStepperComponents";
import { DataChart } from "./dataChart";
import { DataTable } from "./dataTable";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SelectDataSource } from "./dataSelect";
import { useEffect, useState } from "react";
import * as React from 'react';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs, { Dayjs } from 'dayjs';
import ErrorIcon from '@mui/icons-material/Error';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import { useFuncGenerateForecastBackendV1GenerateForecastPostMutation } from "@/shared/api/backend";

import "./index.css"
import 'dayjs/locale/en-gb';
import { useTranslation } from 'react-i18next';
import { DateTimeValidationError, PickerChangeHandlerContext, PickerValue } from '@mui/x-date-pickers';



interface DataRow {
  [key: string]: string | number;
}

const LoadData = ({
  dataChartLoading,
  data,
  forecast,
  XY,
  forecast_horizon_time,
  setForecast_horizon_time
}: {
  dataChartLoading: boolean;
  data: DataRow[] | null;
  forecast: any;
  XY: string[];
  forecast_horizon_time: string | Dayjs | null;
  setForecast_horizon_time: React.Dispatch<React.SetStateAction<string | Dayjs | null>>;
}) => {
  const stts = (s: string | number | Date | Dayjs | null | undefined) => {
    if (s === null || s === undefined) return NaN;
    if (s instanceof Date) return s.valueOf();
    if (dayjs.isDayjs(s)) return s.valueOf();
    if (typeof s === 'string' && isNaN(Number(s))) {
      const parsedDate = new Date(s);
      if (!isNaN(parsedDate.valueOf())) return parsedDate.valueOf();
    }
    return new Date(Number(s)).valueOf();
  }
  const newest_date = (data && data.length > 0) ? data.slice().sort((a: DataRow, b: DataRow) => {
    const dateA = a[XY[0]];
    const dateB = b[XY[0]];
    return stts(dateB) - stts(dateA);
  })[0] : undefined;

  const [value, setValue] = React.useState<Dayjs | null>(
    newest_date && newest_date[XY[0]] ? dayjs(newest_date[XY[0]]) : null
  );

  const { t } = useTranslation('common');

  return (
    <Stack>
      <Stack spacing={1} sx={{ padding: `1rem 0` }}>
        <Typography>{t('widgets.newForecast.controlled_picker_label')}</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
          <DateTimePicker
            label={t('widgets.newForecast.controlled_picker_label')}
            value={value}
            onChange={(newValue: Dayjs | null) => {
              setValue(newValue);
              setForecast_horizon_time(newValue);
            }}
          />
        </LocalizationProvider>
      </Stack>
      {
        dataChartLoading || !forecast?.data || !data
          ? <Stack direction="column" spacing={2}>
            <Typography>{t('widgets.newForecast.loading')}</Typography>
            <CircularProgress />
          </Stack>
          : <DataChart
            dataChartLoading={dataChartLoading}
            payload={{
              data: {
                df: data.map(row => {
                  const formattedRow: { [key: string]: string | number } = {};
                  for (const key in row) {
                    if (Object.prototype.hasOwnProperty.call(row, key)) {
                      const value = row[key];
                      formattedRow[key] = (typeof value === 'string' || typeof value === 'number') ? value : String(value);
                    }
                  }
                  return formattedRow;
                }),
                time_column: XY[0],
                col_target: XY[1],
                forecast_horizon_time: forecast_horizon_time ? dayjs(forecast_horizon_time).toISOString().replace(`T`, ` `).replace(`.000Z`, ``) : ""
              },
              forecast: forecast.data,
              target_time: XY[0],
              target_value: XY[1],
            }} />
      }
    </Stack>
  )
}

export const NewForecast = () => {
  const { mode, setMode } = useColorScheme()
  const isDark = mode === "dark"
  const bgPalette = ["var(--mui-palette-primary-light)", "var(--mui-palette-primary-dark)"]
  const bg = bgPalette[~~isDark]



  const { t } = useTranslation('common');
  const steps = [t('widgets.newForecast.steps.select_data'), t('widgets.newForecast.steps.choose_xy'), t('widgets.newForecast.steps.choose_time')];

  // State declarations
  const [selected_data, setSelected] = useState<string | null>(null)
  const [load_data, setLoaddata] = useState(false)
  const [data, setData] = useState<DataRow[] | null>(null)
  const [selected_axis, setSelected_axis] = useState<string[]>(["", ""])
  const [dataChartLoading, setDataChartLoading] = useState(true)
  const [activeStep, setActiveStep] = React.useState(0);
  const [forecast_horizon_time, setForecast_horizon_time] = React.useState<string | Dayjs | null>(null);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  // Effects
  const [generateForecast, result] = useFuncGenerateForecastBackendV1GenerateForecastPostMutation();

  useEffect(() => {
    if (selected_data != null && selected_axis.every(value => value.length !== 0) && completedSteps() === totalSteps() && data != null) {
      generateForecast({
        predictRequest: {
          df: data ? data.map(row => {
            const formattedRow: { [key: string]: string | number } = {};
            for (const key in row) {
              if (Object.prototype.hasOwnProperty.call(row, key)) {
                const value = row[key];
                formattedRow[key] = (typeof value === 'string' || typeof value === 'number') ? value : String(value);
              }
            }
            return formattedRow;
          }) : [],
          col_target: selected_axis[1],
          time_column: selected_axis[0],
          forecast_horizon_time: forecast_horizon_time ? dayjs(forecast_horizon_time).toISOString().replace(`T`, ` `).replace(`.000Z`, ``) : ""
        }
      }).unwrap()
        .then((payload) => {
          return payload
        })
        .catch((error) => {
          console.error(t('widgets.newForecast.error_generating_forecast'), error);
        });
    }
  }, [selected_data, selected_axis, completed, data, forecast_horizon_time, t]);

  useEffect(() => {
    setDataChartLoading(result.isLoading);
  }, [result.isLoading]);

  const totalSteps = () => steps.length

  const completedSteps = () => Object.keys(completed).length;

  const isLastStep = () => activeStep === totalSteps() - 1;

  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    const newActiveStep = isLastStep() && !allStepsCompleted()
      ? steps.findIndex((step, i) => !(i in completed))
      : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleStep = (step: number) => () => setActiveStep(step);

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    setSelected(null)
    setLoaddata(false)
    setSelected_axis(["", ""])
    setDataChartLoading(true)
  };

  const handleDownload = () => {
    if (result.data) {
      const jsonString = JSON.stringify(result.data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'forecast.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const steps_requrements = [
    [selected_data != null, (load_data == true || selected_data == "Example")],
    [selected_axis.every(value => value.length !== 0)],
    [selected_data != null, selected_axis.every(value => value.length !== 0)]
  ]

  const steps_description = [
    () => (
      <Stack direction={"column"}>
        <Stack direction={"row"}>
          {selected_data != null && <CheckCircleIcon color="success" fontSize="small" />}
          <Typography variant="overline" sx={{ marginLeft: `0.3rem`, lineHeight: `1.4rem` }}>
            {t('widgets.newForecast.select_data_description')}
          </Typography>
        </Stack>
        <Stack direction={"row"}>
          {load_data || selected_data == "Example" ? <CheckCircleIcon color="success" fontSize="small" /> : <ErrorIcon color="error" fontSize="small" />}
          <Typography variant="overline" sx={{ marginLeft: `0.3rem`, lineHeight: `1.4rem` }}>
            {t('widgets.newForecast.load_data_description')}
          </Typography>
        </Stack>
      </Stack>
    ),
    () => (
      <Stack direction={"column"}>
        <Stack direction={"row"}>
          {selected_axis[0].length != 0 && <CheckCircleIcon color="success" fontSize="small" />}
          <Typography>{t('widgets.newForecast.select_x_axis_description')}</Typography>
        </Stack>
        <Stack direction={"row"}>
          {selected_axis[1].length != 0 && <CheckCircleIcon color="success" fontSize="small" />}
          <Typography>{t('widgets.newForecast.select_y_axis_description')}</Typography>
        </Stack>
      </Stack>
    ),
    () => (
      <>
        <Typography>{t('widgets.newForecast.select_forecast_date_description')}</Typography>
        <Typography>{t('widgets.newForecast.send_button_description')}</Typography>
      </>
    )
  ]

  const MsetData = (args: { [key: string]: DataRow[] }) => {
    let first = Object.keys(args)[0]
    setData(args[first])
  }

  return (
    <Stack
      sx={{
        padding: `1rem`,
        overflow: `auto`,
        minHeight: `50%`
      }}
    >
      <header style={{
        top: `0`,
        position: `sticky`,
        background: bg,
        padding: `1rem`,
        borderRadius: `1rem`,
        zIndex: 100
      }}>
        <Stepper nonLinear alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]} sx={{ display: `flex`, flexDirection: `column`, justifyContent: `center`, alignItems: `center` }}>
              <StepLabel
                StepIconComponent={ColorlibStepIcon}
                onClick={() => completed[index] && setActiveStep(index)}
              >
                <Typography variant="subtitle2" color={completed[index] ? "success" : index == activeStep ? "warning" : "textDisabled"}>{label}</Typography>
              </StepLabel>
              {
                !allStepsCompleted() && index == activeStep && <Stack direction={"column"} sx={{ display: `flex`, margin: `0`, padding: `0`, border: `none`, justifyContent: `center` }}>
                  {steps_description[index]()}
                </Stack>
              }
            </Step>
          ))}
        </Stepper>
        <div>
          {allStepsCompleted() ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                {t('widgets.newForecast.all_steps_completed')}
              </Typography>
              <Stack direction={"row"} spacing={1}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button variant="contained" onClick={handleReset}>{t('widgets.newForecast.reset_button')}</Button>
                <Button variant="contained" onClick={handleDownload}>{t('widgets.newForecast.download_button')}</Button>
              </Stack>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  variant="contained"
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  {t('widgets.newForecast.back_button')}
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {
                  completed[activeStep] &&
                  <Button onClick={handleNext} sx={{ mr: 1 }} variant="contained">
                    {t('widgets.newForecast.next_button')}
                  </Button>
                }
                {activeStep !== steps.length &&
                  (completed[activeStep] ? (
                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                      {t('widgets.newForecast.step_completed_message', { stepNumber: activeStep + 1 })}
                    </Typography>
                  ) : (
                    <Button
                      onClick={
                        completedSteps() < (totalSteps() - 1)
                          ? handleComplete
                          : handleComplete
                      }
                      variant="contained"
                      disabled={
                        steps_requrements[activeStep].some(value => value == false)
                      }>
                      {completedSteps() < (totalSteps() - 1)
                        ? t('widgets.newForecast.complete_step_button')
                        : t('widgets.newForecast.send_button')}
                    </Button>
                  ))}
              </Box>
            </React.Fragment>
          )}
        </div>
      </header>
      <section style={{ height: `100%` }}>
        {
          [
            <SelectDataSource
              selected_data={selected_data}
              setSelected={setSelected}
              load_data={load_data}
              setLoaddata={setLoaddata}
              data={data}
              setData={MsetData}
            />,
            <DataTable selected_axis={selected_axis} setSelected_axis={setSelected_axis} data={data} />,
            <LoadData
              dataChartLoading={dataChartLoading}
              data={data}
              forecast={result}
              XY={selected_axis}
              forecast_horizon_time={forecast_horizon_time}
              setForecast_horizon_time={setForecast_horizon_time}
            />
          ][activeStep]
        }
      </section>
      <footer>
        <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
          {t('widgets.newForecast.current_step_message', { stepNumber: activeStep + 1 })}
        </Typography>
      </footer>
    </Stack>
  );
};