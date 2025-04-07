import { Box, Button, Card, CircularProgress, Typography, useColorScheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useForecastData } from "hooks/useForecastData";
import { useEffect, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import { ModelSelectorDropdown } from "components/ui/ModelSelectorDropdown";

interface TooltipParam {
  color: string;
  seriesName: string;
  value: [number, number];
}

export const LoadForecastGraph = () => {
  const { mode } = useColorScheme();
  const { chartData } = useForecastData();

  const [isMobile, setIsMobile] = useState(false);
  const [textSize, setTextSize] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const availableModels = ["Neural network", "XGBoost"];

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
      textStyle: {
        padding: [0, 0, 0, 5],
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
      name: `${chartData.description.sensor_name} ${chartData.legend.last_know_data_line.text.en}`,
      nameLocation: "end",
      nameTextStyle: { align: "left" },
      splitLine: { show: true, interval: "auto" },
      axisLabel: { formatter: "{value}" },
    },
    dataZoom: [
      { type: "inside", start: 0, end: 100 },
      { start: 0, end: 100 },
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <ModelSelectorDropdown
          availableModels={availableModels}
          selectedModel={selectedModel}
          onSelect={handleModelSelect}
        />
        <Typography variant="h4" component="div">
          Forecast chart Sensor name - {chartData.description.sensor_name} Sensor ID -{" "}
          {chartData.description.sensor_id}
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ ml: 2 }}
        >
          Скачать прогноз
        </Button>
      </Box>
      <Card variant="outlined" sx={{ width: "100%", height: 615, p: 2, borderRadius: "10px" }}>
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
