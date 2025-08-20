export type AlertState = "normal" | "firing"
export type AlertHealth = "ok" | "error"

export interface Alert {
    name: string
    threshold: number
    scheme: string
    trigger_frequency: string
    message: string
    notifications?: {
        email: string[]
        telegram: string[]
    }
    // Legacy fields for backward compatibility
    telegram_nicknames?: string[]
    email_addresses?: string[]
    include_graph: boolean
    time_interval?: {
        start_date: string
        end_date: string
    }
    // Legacy date fields for backward compatibility
    date_start?: string
    date_end?: string
    time_start?: string
    time_end?: string
    start_warning_interval: string
    sensor_id: string
    model: string
}
