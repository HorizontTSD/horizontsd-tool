export interface ForecastMetrics {
  [key: string]: number | string;
}

export interface MetricsCollection {
  [key: string]: {
    metrics_table: ForecastMetrics[];
  };
}

export interface MetricsTables {
  [key: string]: ForecastMetrics[];
}

export interface CustomRow {
  id: number;
  Time: string;
  [key: string]: number | string;
}
