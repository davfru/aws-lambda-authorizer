export interface CreateAppointmentRequest {
    shopId: string
    services: string[]
    employeeId: string
    date: string
    startAt: string
    endAt: string
}