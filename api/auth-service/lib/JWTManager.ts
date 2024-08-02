import jwt from 'jsonwebtoken';

export interface SigninJwtPayload {
    email: string
    sub: string
}
export class JWTManager {

    private secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    generateJwt(payload: any, expiresIn?: string): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: expiresIn || '1h' });
    }

    /**
     * 
     * @param jwtToken generate by checkout API and used to sign up
     * @returns jwt's payload
     */
    parseAndVerifySignUpJwt<JwtPayload>(jwtToken: string): JwtPayload | null {
        try {
            const decoded = jwt.verify(jwtToken, this.secretKey) as JwtPayload;
            return decoded;
        } catch (error) {
            return null;
        }
    }

        /**
     * 
     * @param jwtToken generate by login API ex 'Bearer ..'
     * @returns jwt's payload
     */
    static parseSigninJwt<SigninJwtPayload>(jwtToken: string): SigninJwtPayload | null {
        try {
            const decoded = jwt.decode(jwtToken.split(' ')[1]) as SigninJwtPayload;
            return decoded;
        } catch (error) {
            return null;
        }
    }
}