import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { CognitoDecodedJwt, DecodedJwt, OtpDecodedJwt } from "../interfaces";
import jwt from 'jsonwebtoken';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";

const REGION = process.env.REGION!;
const SECRET = process.env.SECRET!;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const COGNITO_POOL_ID = process.env.USER_POOL_ID!;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID!;

// rules
export const isAdmin = (payload: CognitoDecodedJwt) => {
    return payload['custom:role'] === 'admin';
};

export const isCustomer = (payload: CognitoDecodedJwt) => {
    return payload['custom:role'] === 'customer';
};

export type VerifierRule = {
    method: string;
    resourcePattern: string | RegExp;
    verifiers: ((authorization: string) => Promise<DecodedJwt | null>)[];
    authorizations: ((payload: any) => boolean)[];
};

export class JwtVerifier {

    /**
     * 
     * @param authorization Bearer token from the request
     * @returns the decoded jwt if present
     */
    otpJwtVerifier = async (authorization: string): Promise<DecodedJwt | null> => {

        console.info("otpJwtVerifier - authorization: ", authorization);

        const secretClient = new SecretsManagerClient({ region: REGION });
        const secretResponse = await secretClient.send(new GetSecretValueCommand({
            SecretId: SECRET
        }));

        const jwtSecretKey = JSON.parse(secretResponse.SecretString!)[JWT_SECRET_KEY];
        let decoded: OtpDecodedJwt = null as any;

        try {
            jwt.verify(authorization, jwtSecretKey);
            decoded = jwt.decode(authorization) as OtpDecodedJwt;
        } catch (e) {
            console.error("Failed verifying JWT: ", e);
            return null;
        }

        return {
            email: decoded.user,
        };
    }

    /**
     * 
     * @param event 
     * @returns 
     */
    cognitoJwtVerifier = async (authorization: string): Promise<DecodedJwt | null> => {

        const verifier = CognitoJwtVerifier.create({
            userPoolId: COGNITO_POOL_ID,
            tokenUse: "id",
            clientId: USER_POOL_CLIENT_ID,
        });

        let payload: CognitoIdTokenPayload | null = null;

        try {
            payload = await verifier.verify(authorization);
            // console.info("Token is valid. Payload:", payload);
        } catch (error) {
            console.error("Error verifying token: ", error);
            return null;
        }

        return {
            "cognito:username": payload["cognito:username"],
            "custom:role": payload["custom:role"] as any,
            "custom:shop_id": payload["custom:shop_id"] as string,
            name: payload.name as string,
            email: payload.email as string,
            sub: payload.sub
        }
    }
}