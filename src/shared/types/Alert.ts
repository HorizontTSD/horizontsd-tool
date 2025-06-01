export type AlertState = "normal" | "firing"
export type AlertHealth = "ok" | "error"

export interface Alert {
    name: string;
    threshold_value: number;
    alert_scheme: string;
    trigger_frequency: string;
    message: string;
    telegram_nicknames: string[];
    email_addresses: string[];
    include_graph: boolean;
    date_start: string;
    date_end: string;
    time_start: string;
    time_end: string;
    start_warning_interval: string;
    sensor_id: string;
    model: string;
}
