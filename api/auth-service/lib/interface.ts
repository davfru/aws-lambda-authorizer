export interface SignUpRequestBody {
    // email: string
    role: "admin" | "customer"
    // phoneNumber: string
    password: string
}

export interface DecodedJwt {
    user: string // can be email of phone number (in the future)
}
