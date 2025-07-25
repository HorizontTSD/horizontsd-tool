import type React from "react"

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
    name: string
    threshold_value: string | number
    alert_scheme: "Выше значения" | "Ниже значения"
    trigger_frequency: string | number
    message: string
    telegram_nicknames: string[]
    email_addresses: string[]
    include_graph: boolean
    date_start: string // Формат: 'YYYY-MM-DD'
    date_end: string // Формат: 'YYYY-MM-DD'
    time_start: string // Формат: 'HH:MM'
    time_end: string // Формат: 'HH:MM'
    start_warning_interval: string | number // Пример: '60m', '1h'
    sensor_id: string
    model: string
    atValue: number | string
    betweenValue1: number | string
    betweenValue2: number | string
    refreshRate: string
    from: string
    to: string
    email: string
    telegram: string
}

/**
 * Email and Telegram notification lists for an alert
 */
export interface AlertNotifications {
    email: string[]
    telegram: string[]
}

/**
 * Time interval for an alert (start and end date)
 */
export interface AlertTimeInterval {
    start_date: string
    end_date: string
}

/**
 * Props for the AlertBlock component
 */
export interface AlertBlockProps {
    name: string
    threshold: string | number
    scheme: string
    trigger_frequency: string | number
    message: string
    notifications: AlertNotifications
    include_graph: boolean
    time_interval: AlertTimeInterval
    start_warning_interval: string | number
    sensor_id: string
    model: string
    expanded: boolean
    onToggle: () => void
    onEdit?: () => void
    onDelete?: () => void
}

/**
 * Props for the AlertBlocks list component
 */
export interface AlertBlocksProps {
    filteredAlerts: { alert: AlertBlockProps; file_name: string }[]
    expandedIdx: number | null
    setExpandedIdx: (idx: number | null) => void
    setSelectedAlert: (alert: AlertBlockProps) => void
    setOpenEdit: (open: boolean) => void
    handleDeleteAlert: (fileName: string) => void
}

/**
 * Props for the MultipleSelectCheckmarks component
 */
export interface MultipleSelectCheckmarksProps {
    list: string[]
    selected: string[]
    onSelect: (selected: string[]) => void
    disabled?: boolean
    width?: number
}

/**
 * Props for the SensorAndModelSelection component
 */
export interface SensorAndModelSelectionProps {
    sensors: string[]
    selectedSensors: string[]
    handleSensorChange: (sensors: string[]) => void
    sensorsLoading: boolean
    availableModels: string[]
    selectedModels: string[]
    handleModelChange: (models: string[]) => void
}

/**
 * Props for the FiltersBar component
 */
export interface FiltersBarProps {
    availableModels: string[]
    handleModelChange: (models: string[]) => void
    handleSensorChange: (sensors: string[]) => void
    selectedModels: string[]
    selectedSensors: string[]
    sensors: string[]
    sensorsLoading: boolean
    search: string
    setSearch: (s: string) => void
    setOpenCreate: (open: boolean) => void
}

/**
 * Props for the CreateAlertModal component
 */
export interface CreateAlertModalProps {
    open: boolean
    onClose: () => void
    alert?: Alert | null
    onSubmit?: (alert: Alert | Omit<Alert, "id" | "eventId">) => Promise<void>
}

/**
 * Props for the AlerModalForm component (used inside CreateAlertModal)
 */
export interface AlerModalFormProps {
    isEdit: boolean
    formValues: CreateAlertFormValues
    handleChange: <K extends keyof CreateAlertFormValues>(field: K, value: CreateAlertFormValues[K]) => void
    handleSubmit: (e?: React.FormEvent) => void
    onClose: () => void
    handleReset: () => void
    availableModels: string[]
    sensors: string[]
}

/**
 * Generic onChange handler type for forms
 */
export type OnChange = <K extends keyof CreateAlertFormValues>(field: K, value: CreateAlertFormValues[K]) => void

/**
 * Props for the CreateAlertForm component
 */
export interface CreateAlertFormProps {
    values: CreateAlertFormValues
    onChange: OnChange
    onSubmit: () => void
    onReset: () => void
    sensorsList: string[]
}

/**
 * Props for the ForecastGraphPanel component
 */
export interface ForecastGraphPanelProps {
    selectedSensor: string | null
}

/**
 * Type for forecast data used in ForecastGraphPanel
 */
export type ForecastData = Record<string, unknown>
