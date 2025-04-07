import { Box, Button, Card, CircularProgress, Typography, useColorScheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useForecastData } from "hooks/useForecastData";
import { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import { ModelSelectorDropdown } from "components/ui/ModelSelectorDropdown";
import { useTranslation } from "react-i18next";


interface TooltipParam {
  color: string;
  seriesName: string;
  value: [number, number];
}

export const LoadForecastGraph = () => {

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const lang = currentLanguage.toLowerCase();
  const { t } = useTranslation();

  const { mode } = useColorScheme();
  const { chartData } = useForecastData();

  const [isMobile, setIsMobile] = useState(false);
  const [textSize, setTextSize] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const availableModels = ["sensor_id_1", "sensor_id_2", "sensor_id_3"];

  const handleDownload = () => {
    console.log("Download button clicked");
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    console.log(`Selected model: ${model}`);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 960);
      setTextSize(window.innerWidth <= 1090);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!chartData) {
    return (
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          height: 615,
          p: 2,
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          sx={{ display: "flex", margin: "0 auto", justifyContent: "center", alignItems: "center" }}
          size={150}
          value={100}
        />
      </Card>
    );
  }

  const minValue = Math.min(...chartData.series.flatMap((s) => s.data.map((item) => item[1])));
  const maxValue = Math.max(...chartData.series.flatMap((s) => s.data.map((item) => item[1])));

  const rangeOffset = 0.1;

  const minValueY =  minValue * (1 - rangeOffset);
  const maxValueY =  maxValue * (1 + rangeOffset);

  const chartOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      formatter: (params: TooltipParam[]): string => {
        const date = new Date(params[0].value[0]);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const dateTimeStr = `${day}.${month}.${year} ${hours}:${minutes}`;

        let result = `<div>${dateTimeStr}</div>`;
        params.forEach((param) => {
          result += `<div style="display:flex;align-items:center;">
            <div style="width:10px;height:10px;background:${param.color};margin-right:5px;"></div>
            ${param.seriesName}: <strong>${param.value[1]?.toFixed(2) || "N/A"}</strong>
          </div>`;
        });
        return result;
      },
      axisPointer: {
        type: "cross",
        label: { backgroundColor: "#6a7985" },
        lineStyle: {
          type: "dashed",
          width: 1,
          color: "#666",
        },
        crossStyle: {
          color: "#666",
        },
        snap: true,
      },
    },
    legend: {
      data: chartData.series.map((s) => s.name),
      orient: isMobile ? "horizontal" : "vertical",
      bottom: isMobile ? 10 : "auto",
      right: 0,
      left: isMobile ? 0 : "auto",
      top: isMobile ? "0" : "10%",
      width: isMobile ? "auto" : 120,
        formatter: function(name) {
          const maxLineLength = 24;
          const words = name.split(" ");
          let lines = [];
          let currentLine = "";
          words.forEach(word => {
            if ((currentLine + (currentLine ? " " : "") + word).length <= maxLineLength) {
              currentLine += (currentLine ? " " : "") + word;
            } else {
              if (currentLine) {
                lines.push(currentLine);
              }
              currentLine = word;
            }
          });
          if (currentLine) {
            lines.push(currentLine);
          }
          return lines.join("\n");
        },
      textStyle: {
        padding: [0, 0, 0, 5],
        overflow: 'break',
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: "#666",
        backgroundColor: "transparent",
        borderRadius: 0,
      },
      itemWidth: 20,
      itemHeight: 0,
      inactiveColor: "#ddd",
      inactiveBorderColor: "#ddd",
      emphasis: {
        itemStyle: {
          borderColor: "#000",
          borderWidth: 1.5,
        },
      },
    },
    grid: {
      left: isMobile ? 5 : 0,
      right: isMobile ? 5 : 190,
      bottom: "15%",
      top: isMobile ? "15%" : "10%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLabel: {
        fontSize: window.innerWidth <= 500 ? 5.5 : textSize || isMobile ? 8 : 12,
        formatter: (value: number) => {
          const date = new Date(value);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          const year = date.getFullYear().toString().padStart(2, "0");
          return `\n${hours}:${minutes} \n${day}.${month}.${year}`;
        },
      },
      splitLine: { show: true, interval: "auto" },
    },

    yAxis: {
      type: "value",
      nameLocation: "end",
      nameTextStyle: { align: "left" },
      splitLine: { show: true, interval: "auto" },
      axisLabel: {
          formatter: (value) => {
            if (value === minValueY || value === maxValueY) {
              return "";
            }
            return value;
          }
      },
      min: minValueY,
      max: maxValueY,
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
        throttle: 5,
        moveOnMouseMove: false,
        minSpan: 10,
      },
      {
        type: "slider",
        start: 0,
        end: 100,
        throttle: 100,
      }
    ],
    series: chartData.series.map((series) => ({
      name: series.name,
      type: "line",
      showSymbol: false,
      data: series.data,
      itemStyle: { color: series.color },
      lineStyle: { width: series.lineWidth || 2 },
    })),
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2}}>
        <ModelSelectorDropdown
          availableModels={availableModels}
          selectedModel={selectedModel}
          onSelect={handleModelSelect}
        />
        <Typography component="div" style={{ fontSize: 'clamp(8px, 1.2vw, 20px)',  fontWeight: 'bold' }}>
          {t("ready_made_forecast_page.forecast_chart")}: {' '}
          {t("ready_made_forecast_page.sensor_name")} - {' '}
          <span
            style={{
              backgroundColor: 'rgba(0, 123, 255, 0.2)',
              color: 'inherit',
              border: '1px solid blue',
              borderRadius: '12px',
              padding: '2px 8px',
              fontWeight: 'bold',
            }}
          >
            {chartData.description.sensor_name}
          </span>
           {' '} : {' '}
          <span style={{ fontWeight: 'bold' }}>
            {t("ready_made_forecast_page.sensor_id")} - {' '}
            <span
              style={{
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                color: 'inherit',
                border: '1px solid red',
                borderRadius: '12px',
                padding: '2px 8px',
                fontWeight: 'bold',
              }}
            >
              {chartData.description.sensor_id}
            </span>
          </span>
        </Typography>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{
            ml: 2,
            fontSize: 'clamp(8px, 1.5vw, 16px)',
            padding: '6px 16px',
            backgroundColor: 'rgb(129, 199, 132)',
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'rgb(70, 130, 180',
            },
          }}
        >
          {t("ready_made_forecast_page.download_button")}
        </Button>
      </Box>

      <Card variant="outlined" sx={{ width: "100%", height: 615, p: 2, pt: 0,  borderRadius: "10px" }}>
        <ReactECharts
          option={chartOption}
          style={{ height: "100%", width: "100%" }}
          theme={mode}
          opts={{ renderer: "svg" }}
        />
      </Card>
    </>
  );
};
