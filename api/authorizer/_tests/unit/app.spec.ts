import { afterEach, before, describe, it } from "mocha";
import sinon from "sinon";
import assert from "node:assert";
import { lambdaHandler } from "../../app";
import { Event } from "../../lib/interfaces";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import jwt from 'jsonwebtoken';
import { CognitoJwtVerifier } from "aws-jwt-verify";

describe('authorizer', () => {

    before(async () => {

    });

    afterEach(async () => {
        sinon.restore();
    });

    it('when guest', async () => {
        const event: Event = {
            type: 'TOKEN',
            methodArn: 'arn:aws:execute-api:eu-central-1:735523598888:r5zy697x58/ESTestInvoke-stage/GET/shops/search/123',
            authorizationToken: 'Bearer eyJraWQiOiJZYmlsdlNqY3J3a1ZFYlFmdjFTY1wvSEJabGxoQ0xZeERneDV0RmtzVkd6TT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1Mzc0ZjgxMi04MDgxLTcwMDUtYWIxYi0zZGVjOTBhNzVkYWIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfVlJLYkRvODJUIiwiY29nbml0bzp1c2VybmFtZSI6IjUzNzRmODEyLTgwODEtNzAwNS1hYjFiLTNkZWM5MGE3NWRhYiIsIm9yaWdpbl9qdGkiOiIwM2Y0YjNkNy1lMzYyLTQ1MTAtODQzYi0xNGJkMmMxN2YzOTYiLCJhdWQiOiIxcG1kNDhodGMzNnQ0YXJ0ZDJpYXNjMHN2biIsImV2ZW50X2lkIjoiNTU5MGY3ZjctZmQwZS00MDg2LWEyZjctNjVmZWY2MDY4ZTZhIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MjI0MTI0MzYsImV4cCI6MTcyMjQxNjAzNiwiY3VzdG9tOnJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcyMjQxMjQzNiwianRpIjoiMWVlNTU3MzAtYTg3Ni00YTcyLTg3YzMtZDJmOGRkODhhZmQzIiwiZW1haWwiOiJkYXZpZGUuZnJ1Y2lAZ21haWwuY29tIn0.jdDv1yFtPQKLML60HpKL4iP-bPaAwqrtfV_OTWeQtc928l4PuNJ6u49fefWOrro1ZL7_AUFAR0dWYrgUsMu_46Dj1N4PdOhDHtXs8BI_XJq6qxMJCEudQS39chHtNU5OfbbSN1tFQbEv5QqRzUgyEWMrhCV1AcTU0sHpbWx1W-LiqeiJFtmeERJhHXg9NeNCXXnxnhZJyqcWYPrzP3Zm_j-4VEkvTopQLDfjEkwDpIReZIEqzPzQ1Af2qfin1Hsbx0pRC7F1_j-tMExGuxNXNX3nFJRHn_QNQRkAmYzwhFXH94U-acKT78MT7GFDwzllhW33ow_lz117deuT87GkEw'
        }

        // otp verifier mock
        const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');
        secretSendStub.resolves({
            SecretString: "{\"jwtPrivateKey\": \"IamASecret\"}"
        });

        const jwtStub = sinon.stub(jwt);
        jwtStub.verify.returns();
        jwtStub.decode.returns({
            user: "user@email.com"
        });

        // cognito verifier mock
        const verifierInstanceMock = {
            verify: sinon.stub()
        };

        sinon.stub(CognitoJwtVerifier, "create").returns(verifierInstanceMock as any);

        const validPayload = {
            email: "user@email.com"
        };
        verifierInstanceMock.verify.resolves(validPayload);

        const response = await lambdaHandler(event);

        assert.deepEqual(response, {
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: "arn:aws:execute-api:eu-central-1:*:*/dev/POST/auth/sign-up",
                    }
                ],
            },
            "context": {
                email: "user@email.com"
            }
        });
    })

    it('when customer role', async () => {

        const event: Event = {
            type: 'TOKEN',
            methodArn: 'arn:aws:execute-api:eu-central-1:735523598888:r5zy697x58/ESTestInvoke-stage/GET/shops/search/123',
            authorizationToken: 'Bearer eyJraWQiOiJZYmlsdlNqY3J3a1ZFYlFmdjFTY1wvSEJabGxoQ0xZeERneDV0RmtzVkd6TT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1Mzc0ZjgxMi04MDgxLTcwMDUtYWIxYi0zZGVjOTBhNzVkYWIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfVlJLYkRvODJUIiwiY29nbml0bzp1c2VybmFtZSI6IjUzNzRmODEyLTgwODEtNzAwNS1hYjFiLTNkZWM5MGE3NWRhYiIsIm9yaWdpbl9qdGkiOiIwM2Y0YjNkNy1lMzYyLTQ1MTAtODQzYi0xNGJkMmMxN2YzOTYiLCJhdWQiOiIxcG1kNDhodGMzNnQ0YXJ0ZDJpYXNjMHN2biIsImV2ZW50X2lkIjoiNTU5MGY3ZjctZmQwZS00MDg2LWEyZjctNjVmZWY2MDY4ZTZhIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MjI0MTI0MzYsImV4cCI6MTcyMjQxNjAzNiwiY3VzdG9tOnJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcyMjQxMjQzNiwianRpIjoiMWVlNTU3MzAtYTg3Ni00YTcyLTg3YzMtZDJmOGRkODhhZmQzIiwiZW1haWwiOiJkYXZpZGUuZnJ1Y2lAZ21haWwuY29tIn0.jdDv1yFtPQKLML60HpKL4iP-bPaAwqrtfV_OTWeQtc928l4PuNJ6u49fefWOrro1ZL7_AUFAR0dWYrgUsMu_46Dj1N4PdOhDHtXs8BI_XJq6qxMJCEudQS39chHtNU5OfbbSN1tFQbEv5QqRzUgyEWMrhCV1AcTU0sHpbWx1W-LiqeiJFtmeERJhHXg9NeNCXXnxnhZJyqcWYPrzP3Zm_j-4VEkvTopQLDfjEkwDpIReZIEqzPzQ1Af2qfin1Hsbx0pRC7F1_j-tMExGuxNXNX3nFJRHn_QNQRkAmYzwhFXH94U-acKT78MT7GFDwzllhW33ow_lz117deuT87GkEw'
        }

        // otp verifier mock
        const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');
        secretSendStub.resolves({
            SecretString: "{\"jwtPrivateKey\": \"IamASecret\"}"
        });

        const jwtStub = sinon.stub(jwt);
        jwtStub.verify.throws("error");

        // cognito verifier mock
        const verifierInstanceMock = {
            verify: sinon.stub()
        };

        sinon.stub(CognitoJwtVerifier, "create").returns(verifierInstanceMock as any);

        const validPayload = {
            "cognito:username": "1234",
            "custom:role": "customer",
            sub: 123,
            name: "Davide",
            email: "customer@email.com"
        };
        verifierInstanceMock.verify.resolves(validPayload);

        const response = await lambdaHandler(event);

        assert.deepEqual(response, {
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: "arn:aws:execute-api:eu-central-1:*:*/dev/GET/customers/appointments",
                    },
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: "arn:aws:execute-api:eu-central-1:*:*/dev/POST/customers/appointments",
                    }
                ],
            },
            "context": {
                "cognito:username": "1234",
                "custom:role": "customer",
                "custom:shop_id": undefined,
                sub: 123,
                name: "Davide",
                email: "customer@email.com"
            }
        });
    })

    it('when admin role', async () => {

        const event: Event = {
            type: 'TOKEN',
            methodArn: 'arn:aws:execute-api:eu-central-1:735523598888:r5zy697x58/ESTestInvoke-stage/GET/shops/search/123',
            authorizationToken: 'Bearer eyJraWQiOiJZYmlsdlNqY3J3a1ZFYlFmdjFTY1wvSEJabGxoQ0xZeERneDV0RmtzVkd6TT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1Mzc0ZjgxMi04MDgxLTcwMDUtYWIxYi0zZGVjOTBhNzVkYWIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfVlJLYkRvODJUIiwiY29nbml0bzp1c2VybmFtZSI6IjUzNzRmODEyLTgwODEtNzAwNS1hYjFiLTNkZWM5MGE3NWRhYiIsIm9yaWdpbl9qdGkiOiIwM2Y0YjNkNy1lMzYyLTQ1MTAtODQzYi0xNGJkMmMxN2YzOTYiLCJhdWQiOiIxcG1kNDhodGMzNnQ0YXJ0ZDJpYXNjMHN2biIsImV2ZW50X2lkIjoiNTU5MGY3ZjctZmQwZS00MDg2LWEyZjctNjVmZWY2MDY4ZTZhIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MjI0MTI0MzYsImV4cCI6MTcyMjQxNjAzNiwiY3VzdG9tOnJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcyMjQxMjQzNiwianRpIjoiMWVlNTU3MzAtYTg3Ni00YTcyLTg3YzMtZDJmOGRkODhhZmQzIiwiZW1haWwiOiJkYXZpZGUuZnJ1Y2lAZ21haWwuY29tIn0.jdDv1yFtPQKLML60HpKL4iP-bPaAwqrtfV_OTWeQtc928l4PuNJ6u49fefWOrro1ZL7_AUFAR0dWYrgUsMu_46Dj1N4PdOhDHtXs8BI_XJq6qxMJCEudQS39chHtNU5OfbbSN1tFQbEv5QqRzUgyEWMrhCV1AcTU0sHpbWx1W-LiqeiJFtmeERJhHXg9NeNCXXnxnhZJyqcWYPrzP3Zm_j-4VEkvTopQLDfjEkwDpIReZIEqzPzQ1Af2qfin1Hsbx0pRC7F1_j-tMExGuxNXNX3nFJRHn_QNQRkAmYzwhFXH94U-acKT78MT7GFDwzllhW33ow_lz117deuT87GkEw'
        }

        // otp verifier mock
        const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');
        secretSendStub.resolves({
            SecretString: "{\"jwtPrivateKey\": \"IamASecret\"}"
        });

        const jwtStub = sinon.stub(jwt);
        jwtStub.verify.throws("error");

        // cognito verifier mock
        const verifierInstanceMock = {
            verify: sinon.stub()
        };

        sinon.stub(CognitoJwtVerifier, "create").returns(verifierInstanceMock as any);

        const validPayload = {
            "cognito:username": "1234",
            "custom:role": "admin",
            "custom:shop_id": "1",
            sub: 123,
            name: "Davide",
            email: "admin@email.com"
        };
        verifierInstanceMock.verify.resolves(validPayload);

        const response = await lambdaHandler(event);

        assert.deepEqual(response, {
            policyDocument: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: "arn:aws:execute-api:eu-central-1:*:*/dev/GET/admin/shop/appointments",
                    },
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: "arn:aws:execute-api:eu-central-1:*:*/dev/POST/admin/shop/appointments",
                    },
                    {
                        Action: "execute-api:Invoke",
                        Effect: "Allow",
                        Resource: "arn:aws:execute-api:eu-central-1:*:*/dev/GET/admin/shop-details",
                    }
                ],
            },
            "context": {
                "cognito:username": "1234",
                "custom:role": "admin",
                "custom:shop_id": "1",
                sub: 123,
                name: "Davide",
                email: "admin@email.com"
            }
        });
    })
})