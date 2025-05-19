export interface AlertState {
    label: string
    evaluate: number
    last_evaluation: number
    labels: string[]
    id: string
}

export interface Alert {
    state: AlertState
    name: string
    health: string
    summary: string
    next: number
}
