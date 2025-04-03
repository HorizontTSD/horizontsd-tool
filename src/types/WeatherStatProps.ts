export type WeatherStatProps = {
  title: string;
  value: string;
  interval: string;
  change: string;
  trend: "up" | "down" | "neutral";
  data: number[];
};
