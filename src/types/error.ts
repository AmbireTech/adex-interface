export enum ErrorLevel {
    WARNING,
    ERROR,
    CRITICAL
}

export type AppError = {
    severity: ErrorLevel,
    error: Error,
    message: string

}