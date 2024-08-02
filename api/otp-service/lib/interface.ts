export interface OtpEntity {
    receiver: string
    createdAt: string
    createdAtTimestamp: number
    otp: number
    expiration: number
}

export interface SendOtpBodyRequest {
    receiver: string
}

export interface VerifyOtpBodyRequest {
    receiver: string
    otp: string
}
