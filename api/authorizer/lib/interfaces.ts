export interface Event {
    type: 'TOKEN',
    methodArn: string,
    authorizationToken: string
}

export interface OtpDecodedJwt {
    user: string // can be email of phone number (in the future)
}

export interface CognitoDecodedJwt {
    sub: string;
    email_verified: boolean;
    iss: string;
    'cognito:username': string;
    origin_jti: string;
    aud: string;
    event_id: string;
    token_use: string;
    auth_time: number;
    exp: number;
    'custom:role': 'customer' | 'employee' | 'admin';
    iat: number;
    jti: string;
    email: string;
}

export interface DecodedJwt {
    email: string
    name?: string
    'cognito:username'?: string
    'custom:shop_id'?: string
    'custom:role'?: 'customer' | 'employee' | 'admin'
    sub?: string;
}