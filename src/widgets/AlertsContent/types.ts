export type AlertState = "normal" | "firing"

export interface Alert {
    id: string
    state: AlertState
    name: string
    health: string
    summary: string
    nextEval: string
}

export interface CreateAlertFormValues {
    name: string;
    threshold_value: number;
    alert_scheme: 'Выше значения' | 'Ниже значения';
    trigger_frequency: string;
    message: string;
    telegram_nicknames: string[];
    email_addresses: string[];
    include_graph: boolean;
    date_start: string; // Формат: 'YYYY-MM-DD'
    date_end: string; // Формат: 'YYYY-MM-DD'
    time_start: string; // Формат: 'HH:MM'
    time_end: string; // Формат: 'HH:MM'
    start_warning_interval: string; // Пример: '60m', '1h'
    sensor_id: string;
    model: string;
}