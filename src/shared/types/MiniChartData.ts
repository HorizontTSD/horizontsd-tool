export interface TextLocale {
    en: string;
    ru: string;
    it: string;
    [key: string]: string; // Allow for other locales
}

export interface MiniChartStat {
    title: TextLocale;
    description: TextLocale;
    values: string | number; // Assuming values can be string or number
    percentages: {
        value: number;
        mark: "positive" | "negative";
    };
    data: Array<{ value: number; datetime: string }>;
}

export type MiniChartData = Array<MiniChartStat>; 