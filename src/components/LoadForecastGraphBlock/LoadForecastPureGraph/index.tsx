import { useColorScheme } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";

interface TooltipParam {
  color: string;
  seriesName: string;
  value: [number, number];
}

interface LoadForecastPureGraphProps {
  sensorId: string;
  series: {
    name: string;
    data: [number, number][];
    color: string;
    lineWidth?: number;
  }[];
}

export const LoadForecastPureGraph = ({ series }: LoadForecastPureGraphProps) => {
  const { mode } = useColorScheme();
  const [isMobile, setIsMobile] = useState(false);
  const [textSize, setTextSize] = useState(false);

  const minValue = Math.min(...series.flatMap((s) => s.data.map((item) => item[1])));
  const maxValue = Math.max(...series.flatMap((s) => s.data.map((item) => item[1])));

  const rangeOffset = 0.1;

  const minValueY = minValue * (1 - rangeOffset);
  const maxValueY = maxValue * (1 + rangeOffset);

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
                <div style="width:10px;height:10px;background:${
                  param.color
                };margin-right:5px;"></div>
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
      data: series.map((s) => s.name),
      orient: isMobile ? "horizontal" : "vertical",
      bottom: isMobile ? 10 : "auto",
      right: 0,
      left: isMobile ? 0 : "auto",
      top: isMobile ? "0" : "10%",
      width: isMobile ? "auto" : 120,
      formatter: function (name: string) {
        const maxLineLength = 24;
        const words = name.split(" ");
        const lines = [];
        let currentLine = "";
        words.forEach((word: string) => {
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
      left: isMobile ? 6 : 6,
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
        formatter: (value: number) => {
          if (value === minValueY || value === maxValueY) {
            return "";
          }
          return value;
        },
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
      },
    ],
    series: series.map((series) => ({
      name: series.name,
      type: "line",
      showSymbol: false,
      data: series.data,
      itemStyle: { color: series.color },
      lineStyle: { width: series.lineWidth || 2 },
    })),
  };

  return (
    <ReactECharts
      option={chartOption}
      style={{ height: "100%", width: "100%" }}
      theme={mode}
      opts={{ renderer: "svg" }}
    />
  );
};
