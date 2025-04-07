interface TextLocale {
  en: string;
  ru: string;
}

interface ColorLegendItem {
  text: TextLocale;
  color: string;
}

export interface TimeSeriesPoint {
  datetime: number;
  load_consumption: number;
}

interface ForecastMetrics {
  MAE: number;
  MSE: number;
  RMSE: number;
  MAPE: number;
  sMAPE: number;
  NRMSE: number;
  MARNE: number;
  WMAPE: number;
  R2: number;
  actual: number;
  XGBoost_predicted: number;
  datetime: number;
}

interface DownloadableDataPoint {
  datetime: number;
  XGBoost_predict: number;
  LSTM_predict: number;
  Ensemble_predict: number;
  Real_data?: number;
}

interface ModelEvaluation {
  metrics_table: ForecastMetrics[];
  text: TextLocale;
}

interface PredictionData {
  last_real_data: TimeSeriesPoint[];
  actual_prediction_lstm: TimeSeriesPoint[];
  actual_prediction_xgboost: TimeSeriesPoint[];
  ensemble: TimeSeriesPoint[];
}

interface ChartLegend {
  Ensemble_data_line: ColorLegendItem;
  LSTM_data_line: ColorLegendItem;
  XGBoost_data_line: ColorLegendItem;
  last_know_data_line: ColorLegendItem;
  real_data_line: ColorLegendItem;
}

interface MetricsCollection {
  XGBoost: ModelEvaluation;
  LSTM: ModelEvaluation;
}

export interface SensorData {
  [key: string]: {
    description: {
      sensor_name: string;
      sensor_id: string;
    };
    map_data: {
      data: PredictionData;
      last_know_data: string;
      legend: ChartLegend;
    };
    table_to_download: DownloadableDataPoint[];
    metrix_tables: MetricsCollection;
  };
}
