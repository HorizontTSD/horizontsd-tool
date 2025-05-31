export type AlertState = "normal" | "firing"
export type AlertHealth = "ok" | "error"

export interface Alert {
    id: string
    state: AlertState
    name: string
    health: AlertHealth
    summary: string
    nextEval: string
    evaluateEvery?: string
    keepFiringFor?: string
    lastEvaluation?: string
    labels?: string[]
    eventId?: string
}
