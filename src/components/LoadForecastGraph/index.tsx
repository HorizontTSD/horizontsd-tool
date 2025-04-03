import { Card, CircularProgress, useColorScheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useForecastData } from "hooks/useForecastData";

export const LoadForecastGraph = () => {
  const { mode } = useColorScheme();
  const { chartData } = useForecastData();

  if (!chartData) {
    return (
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          height: 415,
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
      formatter: (params: any) => {
        const date = new Date(params[0].value[0]);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const dateTimeStr = `${day}.${month}.${year} ${hours}:${minutes}`;

        let result = `<div>${dateTimeStr}</div>`;
        params.forEach((param: any) => {
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
      right: 0,
      orient: "vertical",
      top: "10%",
      itemGap: 15,
      textStyle: { padding: [0, 0, 0, 5] },
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
      left: "1%",
      right: "12%",
      bottom: "15%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLabel: {
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
    <Card variant="outlined" sx={{ width: "100%", height: 415, p: 2, borderRadius: "10px" }}>
      <ReactECharts option={chartOption} style={{ height: "100%", width: "100%" }} theme={mode} />
    </Card>
  );
};

// time actual consumption  predicted consumption Mape R2 RMSE MAE
