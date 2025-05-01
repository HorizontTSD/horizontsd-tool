interface TimeSeriesData {
  timestamps: number[];
  values: number[];
}

/**
 * Generates random time series data between two Unix timestamps
 * @param startTimestamp Unix timestamp in milliseconds
 * @param endTimestamp Unix timestamp in milliseconds
 * @param interval Interval between data points in milliseconds
 * @param minValue Minimum value for the random data
 * @param maxValue Maximum value for the random data
 * @param noiseFactor Factor to control the amount of noise in the data (0-1)
 * @returns Object containing arrays of timestamps and values
 */
export function generateTimeSeriesData(
  startTimestamp: number,
  endTimestamp: number,
  interval: number = 3600000, // 1 hour default interval
  minValue: number = 0,
  maxValue: number = 100,
  noiseFactor: number = 0.1
): TimeSeriesData {
  const timestamps: number[] = [];
  const values: number[] = [];
  
  // Calculate number of points
  const numPoints = Math.floor((endTimestamp - startTimestamp) / interval) + 1;
  
  // Generate base trend
  const baseTrend = (maxValue - minValue) / numPoints;
  let currentValue = minValue + (maxValue - minValue) * Math.random();
  
  // Generate data points
  for (let i = 0; i < numPoints; i++) {
    const timestamp = startTimestamp + (i * interval);
    timestamps.push(timestamp);
    
    // Add some randomness to the trend
    const noise = (Math.random() - 0.5) * (maxValue - minValue) * noiseFactor;
    currentValue += baseTrend + noise;
    
    // Ensure value stays within bounds
    currentValue = Math.max(minValue, Math.min(maxValue, currentValue));
    values.push(currentValue);
  }
  
  return { timestamps, values };
}

/**
 * Converts TimeSeriesData to uPlot format (2D array)
 * @param data TimeSeriesData object
 * @returns 2D array in uPlot format [timestamps, values]
 */
export function convertToUPlotFormat(data: TimeSeriesData): number[][] {
  return [data.timestamps, data.values];
} 