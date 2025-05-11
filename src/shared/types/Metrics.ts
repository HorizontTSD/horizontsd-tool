export type MetricsResponse = {
  [key: string]: {
    MAE: number;
    RMSE: number;
    R2: number;
    MAPE: number;
  };
}[];

export type Metrics = {
  MAE: number;
  RMSE: number;
  R2: number;
  MAPE: number;
};
