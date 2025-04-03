import { Card, useColorScheme } from "@mui/material";
import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

export const LoadForecastGraph = () => {
  const { mode } = useColorScheme();
  const [chartData, setChartData] = useState<{
    description: { sensor_name: string; sensor_id: string };
    map_data: {
      data: {
        last_real_data: { datetime: number; load_consumption: number };
        actual_prediction_lstm: { datetime: number; load_consumption: number };
        actual_prediction_xgboost: { datetime: number; load_consumption: number };
        ensemble: { datetime: number; load_consumption: number };
      };
      last_know_data: string;
      legend: {
        Ensemble_data_line: { text: { en: string; ru: string }; color: string };
        LSTM_data_line: { text: { en: string; ru: string }; color: string };
        XGBoost_data_line: { text: { en: string; ru: string }; color: string };
        last_know_data_line: { text: { en: string; ru: string }; color: string };
        real_data_line: { text: { en: string; ru: string }; color: string };
      };
    };
    metrix_tables: {
      XGBoost: { metrics_table: string; text: { en: string; ru: string } };
      LSTM: { metrics_table: string; text: { en: string; ru: string } };
    };
    table_to_download: string;
  } | null>(null);

  useEffect(() => {
    const savedData = localStorage.getItem("forecastData");

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const firstKey = Object.keys(parsedData)[0];
        const sensorData = parsedData[firstKey];

        if (!sensorData?.map_data?.data || !sensorData?.description) {
          console.warn("Нет данных для графика или описания сенсора");
          return;
        }

        const newData = {
          description: {
            sensor_name: sensorData.description.sensor_name,
            sensor_id: sensorData.description.sensor_id,
          },
          map_data: {
            data: {
              last_real_data: sensorData.map_data.data.last_real_data,
              actual_prediction_lstm: sensorData.map_data.data.actual_prediction_lstm,
              actual_prediction_xgboost: sensorData.map_data.data.actual_prediction_xgboost,
              ensemble: sensorData.map_data.data.ensemble,
            },
            last_know_data: sensorData.map_data.last_know_data,
            legend: sensorData.map_data.legend,
          },
          metrix_tables: sensorData.metrix_tables,
          table_to_download: sensorData.table_to_download || "",
        };

        setChartData(newData);
      } catch (error) {
        console.error("Ошибка при парсинге данных:", error);
      }
    }
  }, []);

  const parseSeriesData = (data: any) => {
    if (!data) return [];
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      return parsed.map((item: any) => [item.datetime, item.load_consumption]);
    } catch (e) {
      console.error("Error parsing series data:", e);
      return [];
    }
  };

  const getChartOption = () => {
    if (!chartData) return {};

    const realData = parseSeriesData(chartData.map_data.data.last_real_data);
    const lstmData = parseSeriesData(chartData.map_data.data.actual_prediction_lstm);
    const xgboostData = parseSeriesData(chartData.map_data.data.actual_prediction_xgboost);
    const ensembleData = parseSeriesData(chartData.map_data.data.ensemble);
    const modelName = chartData.description.sensor_name;

    const allChartData = [...realData, ...lstmData, ...xgboostData, ...ensembleData];
    const sortedData = allChartData.sort((a, b) => a[0] - b[0]);
    const lastDate = sortedData[sortedData.length - 1][0];
    const firstDate = sortedData[0][0];
    const visibleDuration = 2 * 24 * 60 * 60 * 1000;
    const calculatedMin = Math.max(firstDate, lastDate - visibleDuration);

    const legendData = [
      chartData.map_data.legend.real_data_line.text.en,
      chartData.map_data.legend.LSTM_data_line.text.en,
      chartData.map_data.legend.XGBoost_data_line.text.en,
      chartData.map_data.legend.Ensemble_data_line.text.en,
    ];

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",

        formatter: (params: any) => {
          const date = new Date(params[0].value[0]);
          const dateStr = date.toLocaleString();
          let result = `<div>${dateStr}</div>`;

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
          label: {
            backgroundColor: "#6a7985",
          },
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
        data: legendData,
        right: 0,
        orient: "vertical",
        top: "10%",
        itemGap: 15,
        textStyle: {
          padding: [0, 0, 0, 5],
        },
        selected: {},
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
        splitLine: {
          show: true,
          interval: "auto",
        },

        type: "time",
        boundaryGap: false,
        min: calculatedMin,
        max: lastDate,
        axisLabel: {
          formatter: (value: number) => {
            return echarts.time.format(value, "{HH}:{mm}\n {MM}/{dd} {yyyy}", false);
          },
        },
      },
      yAxis: {
        type: "value",
        name: `${modelName} ${chartData.map_data.legend.last_know_data_line.text.en}`,
        nameLocation: "end",
        nameTextStyle: {
          align: "left",
        },
        splitLine: {
          show: true,
          interval: "auto",
        },
        axisLabel: {
          formatter: "{value}",
        },
      },
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: 100,
        },
        {
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: chartData.map_data.legend.real_data_line.text.en,
          type: "line",
          showSymbol: false,
          data: realData,
          itemStyle: {
            color: chartData.map_data.legend.real_data_line.color,
          },
          lineStyle: {
            width: 2,
          },
        },
        {
          name: chartData.map_data.legend.LSTM_data_line.text.en,
          type: "line",
          showSymbol: false,
          data: lstmData,
          itemStyle: {
            color: chartData.map_data.legend.LSTM_data_line.color,
          },
          lineStyle: {
            width: 2,
          },
        },
        {
          name: chartData.map_data.legend.XGBoost_data_line.text.en,
          type: "line",
          showSymbol: false,
          data: xgboostData,
          itemStyle: {
            color: chartData.map_data.legend.XGBoost_data_line.color,
          },
          lineStyle: {
            width: 2,
          },
        },
        {
          name: chartData.map_data.legend.Ensemble_data_line.text.en,
          type: "line",
          showSymbol: false,
          data: ensembleData,
          itemStyle: {
            color: chartData.map_data.legend.Ensemble_data_line.color,
          },
          lineStyle: {
            width: 3,
          },
        },
      ],
    };
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        height: 415,
        p: 2,
        borderRadius: "10px",
      }}
    >
      <ReactECharts
        option={getChartOption()}
        style={{ height: "100%", width: "100%" }}
        notMerge={true}
        lazyUpdate={true}
        theme={mode}
      />
    </Card>
  );
};
