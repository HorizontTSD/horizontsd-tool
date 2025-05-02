import { UPlotChart } from "@/components/UPlotChart/UPlotChart";
import { useColorScheme } from "@mui/material";

import { useEffect, useRef, useState } from "react";

import { Options } from "uplot";
import uPlot from "uplot";

import "./theme.css"

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function populate({
  point,
  amount,
  offset
}: {
  [key: string]: number;
}) {
  let result = []
  if (offset > 0) {
    for (let i = 0; i < offset; i++) {
      result.push(null)
    }
  }
  if (point !== null && amount > 0) {
    let amp = [point, point]
    const gen_val = (v, i = 1) => {
      const func = [Math.random, Math.log1p, Math.cosh, Math.tan, Math.cos, Math.asin][~~(Math.random() * 5)]

      return clamp(func(v), amp[0], amp[1])
    }

    if (offset > 0) {
      result.push(point)
      amount--
    }

    if (result.length == 0) {
      result.push(gen_val(point))
      amount--
    }

    for (let i = 0; i < amount; i++) {
      amp[0] -= 0.6
      amp[1] += 0.6
      result.push(gen_val(result[result.length - 1]))
    }

  }

  return result
}

interface LoadForecastPureGraphProps {
  initialData: any;
}

export const LoadForecastPureGraph = ({ initialData }: LoadForecastPureGraphProps) => {
  console.log(`update`)
  const { mode } = useColorScheme();
  const isDark = mode === "dark";
  const containerRef = useRef<HTMLDivElement>(null);

  // global setup
  const total_hours = 24;
  const past_offset = Math.floor(total_hours / 2);
  const now_offset = total_hours - past_offset;
  const plugin_refresh_rate = 1000; // 1000ms

  const [data, setData] = useState<number[][]>();
  const plotRef = useRef<uPlot | null>(null);
  const animFrame = useRef<number | null>(null);
  const now = useRef(Date.now() / plugin_refresh_rate);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Create a function to generate options based on current mode
  const getOptions = (width: number, height: number): Options => ({
    title: `${initialData.description.sensor_id} ${initialData.description.sensor_name}`,
    width,
    height,
    pxAlign: false,
    scales: {
      x: { time: true },
      y: {},
    },
    series: [
      {},
      ...Object.entries(initialData.map_data.legend)
        .slice(1)
        .map(([key, value]) => ({
          label: key,
          stroke: (value as any).color,
        })),
    ],
    axes: [
      {
        label: "X Axis (Time)",
        stroke: isDark ? `rgba(255, 255, 255, 1)` : `rgba(0, 0, 0, 1)`,
        grid: {
          width: 1,
          stroke: isDark ? `rgba(255, 255, 255, 0.1)` : `rgba(0, 0, 0, 0.1)`,
        },
      },
      {
        side: 1,
        label: "Y Axis (Amount)",
        stroke: isDark ? `rgba(255, 255, 255, 1)` : `rgba(0, 0, 0, 1)`,
        grid: {
          width: 1,
          stroke: isDark ? `rgba(255, 255, 255, 0.1)` : `rgba(0, 0, 0, 0.1)`,
        },
      },
    ],
  });

  // Initialize options with default dimensions
  const [opts, setOpts] = useState<Options>(() => getOptions(800, 400));

  // Handle data initialization
  useEffect(() => {
    const date_now = Date.now();
    now.current = date_now / plugin_refresh_rate;

    let { map_data } = initialData;
    let { data, legend } = map_data;
    let { last_real_data, actual_prediction_lstm, actual_prediction_xgboost, ensemble } = data;

    let real_data = [...last_real_data].reverse();
    let prediction_lstm = [...actual_prediction_lstm].reverse();
    let prediction_xgboost = [...actual_prediction_xgboost].reverse();
    let prediction_ensemble = [...ensemble].reverse();

    let min_ts = real_data[0].datetime;
    let max_ts = real_data[0].datetime;
    let max_timeline_length = real_data.length + Math.max(
      prediction_lstm.length,
      prediction_xgboost.length,
      prediction_ensemble.length
    );

    for (let i = 0; i < real_data.length; i++) {
      min_ts = Math.min(min_ts, real_data[i].datetime);
      max_ts = Math.max(max_ts, real_data[i].datetime);
    }
    for (let i = 0; i < prediction_lstm.length; i++) {
      min_ts = Math.min(min_ts, prediction_lstm[i].datetime);
      max_ts = Math.max(max_ts, prediction_lstm[i].datetime);
    }
    for (let i = 0; i < prediction_xgboost.length; i++) {
      min_ts = Math.min(min_ts, prediction_xgboost[i].datetime);
      max_ts = Math.max(max_ts, prediction_xgboost[i].datetime);
    }
    for (let i = 0; i < prediction_ensemble.length; i++) {
      min_ts = Math.min(min_ts, prediction_ensemble[i].datetime);
      max_ts = Math.max(max_ts, prediction_ensemble[i].datetime);
    }

    const timestep_size = Math.floor((max_ts - min_ts) / max_timeline_length);
    const xs = Array.from({ length: max_timeline_length }, (v, i) =>
      (min_ts + timestep_size * i) / plugin_refresh_rate
    );
    const load_consumption = [null, ...real_data].map((e) => e?.load_consumption);

    setData([
      xs,
      load_consumption,
      populate({ offset: xs.length - prediction_lstm.length }).concat(
        prediction_lstm.map((e) => e.load_consumption)
      ),
      populate({ offset: xs.length - prediction_xgboost.length }).concat(
        prediction_xgboost.map((e) => e.load_consumption)
      ),
      populate({ offset: xs.length - prediction_ensemble.length }).concat(
        prediction_ensemble.map((e) => e.load_consumption)
      ),
    ]);
  }, []);

  // Handle resize and initial dimension setup
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        let { clientWidth, clientHeight } = containerRef.current;
        setDimensions({
          width: clientWidth,
          height: clientHeight,
        });
        setOpts(prev => ({
          ...prev,
          width: clientWidth,
          height: clientHeight,
        }));

        // If the plot already exists, resize it
        if (plotRef.current) {
          plotRef.current.setSize({
            width: clientWidth,
            height: clientHeight,
          });
        }
      }
    };

    // Initial measurement
    updateDimensions();

    // Set up resize observer for container
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (animFrame.current) {
        cancelAnimationFrame(animFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setOpts(getOptions(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      ));
    }
  }, [mode, dimensions]);


  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {data && (
        <UPlotChart
          data={data}
          opts={opts}
          callback={(u: uPlot) => {
            plotRef.current = u;
            // Set initial size
            if (containerRef.current) {
              u.setSize({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight - 64,
              });
            }
          }}
        />
      )}
    </div>
  );
};