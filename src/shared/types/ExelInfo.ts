export interface ForecastDataPoint {
  datetime: number;
  XGBoost_predict: number;
  LSTM_predict: number;
  ensemble_predict: number;
}

export interface ExcelInfo {
  data: ForecastDataPoint[];
  sensorName: string;
  sensorId: string;
}
