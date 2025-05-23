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
    atValue: number
    betweenValue1: number
    betweenValue2: number
    refreshRate: string
    from: string
    to: string
    email: string
    telegram: string
    message: string
    selectedSensor: string | null
}
