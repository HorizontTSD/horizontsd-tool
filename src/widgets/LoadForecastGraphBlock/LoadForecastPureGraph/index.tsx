import { useEffect, useMemo, useRef, useState } from "react";
import { UPlotChart } from "@/shared/ui/uplot/UPlotChart";
import { useColorScheme } from "@mui/material";
import { createPopper } from "@popperjs/core";
import { Options } from "uplot";
import uPlot from "uplot";
import "./theme.css"

function tooltipPlugin(opts = {}) {
  let overlay: HTMLElement;
  let popperInstance: any;
  let uPlotInstance: any;

  // Create tooltip element
  overlay = document.createElement('div');
  overlay.className = 'uplot-tooltip';
  Object.assign(overlay.style, {
    position: 'absolute',
    display: 'none',
    background: 'rgba(255, 255, 255, 0.8)',
    color: 'black',
    padding: '4px 8px',
    borderRadius: '3px',
    fontSize: '12px',
    pointerEvents: 'none',
    zIndex: '1000'
  });
  document.body.appendChild(overlay);

  return {
    hooks: {
      init: (u) => {
        uPlotInstance = u;

        // Show/hide tooltip on mouse enter/leave
        u.over.addEventListener('mouseenter', () => {
          overlay.style.display = 'block';
        });

        u.over.addEventListener('mouseleave', () => {
          overlay.style.display = 'none';
        });
      },

      setCursor: (u) => {
        const { left, top, idx } = u.cursor;
        if (idx == null) return;

        // Update tooltip content
        overlay.innerHTML = ``
        u.data.slice(1).forEach((e, i) => {
          const val = document.createElement('div');
          val.style.display = `flex`
          val.style.flexDirection = `row`
          val.style.justifyContent = `start`
          val.style.alignItems = `center`
          val.style.padding = `2px`
          const label = document.createElement('div');
          label.style.marginRight = `8px`
          const text = document.createElement('div');
          const value = document.createElement('div');
          text.style.lineHeight = `1rem`
          text.style.fontFamily = `monospace`
          value.style.fontFamily = `monospace`
          text.style.textTransform = `uppercase`
          label.style.width = `10px`
          label.style.height = `10px`
          label.style.background = opts.series.slice(1)[i].stroke
          val.append(label)
          val.append(text)
          val.append(value)

          text.innerHTML = `${u.series.slice(1)[i].label}:`
          value.innerHTML = e[idx] || "none"
          overlay.append(val)
        })

        // Create a virtual anchor element at cursor position
        const virtualAnchor = {
          getBoundingClientRect: () => {
            const rect = u.over.getBoundingClientRect();
            return {
              width: 0,
              height: 0,
              top: rect.top + top,
              right: rect.left + left,
              bottom: rect.top + top,
              left: rect.left + left,
              x: rect.left + left,
              y: rect.top + top
            };
          },
          contextElement: u.over
        };

        // Initialize or update Popper
        if (!popperInstance) {
          popperInstance = createPopper(virtualAnchor, overlay, {
            placement: 'right-start',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [20, 20]
                }
              },
              {
                name: 'preventOverflow',
                options: {
                  boundary: u.root
                }
              },
              {
                name: 'flip',
                options: {
                  boundary: u.root,
                  padding: 10
                }
              }
            ]
          });
        } else {
          popperInstance.state.elements.reference = virtualAnchor;
          popperInstance.update();
        }
      },

      destroy: () => {
        if (popperInstance) {
          popperInstance.destroy();
        }
        overlay.remove();
      }
    }
  };
}

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
  // TODO: decrease rerenders
  // console.log(`update`)
  const { mode } = useColorScheme();
  const isDark = mode === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const plotRef = useRef<uPlot | null>(null);
  const animFrame = useRef<number | null>(null);
  const series_data = Object.entries(initialData.map_data.legend).slice(1)

  // global setup
  const total_hours = 24;
  const past_offset = Math.floor(total_hours / 2);
  const now_offset = total_hours - past_offset;
  const plugin_refresh_rate = 1000; // 1000ms

  // 
  const { map_data } = initialData;
  const { last_real_data, actual_prediction_lstm, actual_prediction_xgboost, ensemble } = map_data.data;
  const real_data = [...last_real_data].reverse();
  const prediction_lstm = [...actual_prediction_lstm].reverse();
  const prediction_xgboost = [...actual_prediction_xgboost].reverse();
  const prediction_ensemble = [...ensemble].reverse();
  let min_ts = real_data[0].datetime;
  let max_ts = real_data[0].datetime;
  const max_timeline_length = real_data.length + Math.max(
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

  const data = [
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
  ];

  // Create a function to generate options based on current mode
  const getOptions = (width: number, height: number): Options => ({
    title: `${initialData.description.sensor_id} ${initialData.description.sensor_name}`,
    width,
    height,
    pxAlign: false,
    scales: {
      x: { time: true },
      y: {} // range: [from,to]
    },
    series: [
      {},
      ...series_data.map(([key, value]) => ({
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
    legend: {
      markers: {
        fill: (u, seriesIdx) => u.series[seriesIdx].stroke(u, seriesIdx),
        stroke: "transparent"
      }

    }
  });

  // Memoize options to prevent unnecessary recalculations
  const opts = useMemo(() => {
    return getOptions(dimensions.width, dimensions.height);
  }, [dimensions.width, dimensions.height, isDark]);


  // Resize handler
  // Throttled resize handler
  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;

      // Only update state if dimensions actually changed
      if (clientWidth !== dimensions.width || clientHeight !== dimensions.height) {
        setDimensions({ width: clientWidth, height: clientHeight });
      }
    };

    const handleResize = () => {
      // Cancel any pending animation frame
      if (animFrame.current !== null) {
        cancelAnimationFrame(animFrame.current);
      }

      // Schedule new update
      animFrame.current = requestAnimationFrame(updateDimensions);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (animFrame.current !== null) {
        cancelAnimationFrame(animFrame.current);
      }
    };
  }, [dimensions.width, dimensions.height]);  // Only recreate when dimensions change


  return (
    <div
      ref={containerRef}
      style={{
        minWidth: "512px",
        height: "480px",
      }}
    >
      {data && (
        <UPlotChart
          data={data}
          opts={opts}
          plugins={[
            // box_whisker__legendAsTooltipPlugin()
            tooltipPlugin(opts)
          ]}
          callback={(u: uPlot) => {
            plotRef.current = u;
            // Set initial size
            if (containerRef.current) {
              u.setSize({
                width: containerRef.current.clientWidth,
                height: containerRef.current.clientHeight,
              });
            }
          }}
        />
      )}
    </div>
  );
};
