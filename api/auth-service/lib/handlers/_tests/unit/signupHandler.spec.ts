import { afterEach, before, describe, it } from "mocha";
import sinon from "sinon";
import assert from "node:assert";
import { lambdaHandler } from "../../../../app";
import { APIGatewayProxyEvent } from "aws-lambda";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";

describe('POST /signup', () => {

    before(async () => {

    });

    afterEach(async () => {
        sinon.restore();
    });

    describe('bad request', () => {

        it('should return 401 is missing Authorization header', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    "password": "Password123!",
                    "role": "admin"
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-up',
                pathParameters: {},
                queryStringParameters: {
                },
                requestContext: {
                    accountId: '123456789012',
                    apiId: '1234',
                    authorizer: {},
                    httpMethod: 'post',
                    identity: {
                        accessKey: '',
                        accountId: '',
                        apiKey: '',
                        apiKeyId: '',
                        caller: '',
                        clientCert: {
                            clientCertPem: '',
                            issuerDN: '',
                            serialNumber: '',
                            subjectDN: '',
                            validity: { notAfter: '', notBefore: '' },
                        },
                        cognitoAuthenticationProvider: '',
                        cognitoAuthenticationType: '',
                        cognitoIdentityId: '',
                        cognitoIdentityPoolId: '',
                        principalOrgId: '',
                        sourceIp: '',
                        user: '',
                        userAgent: '',
                        userArn: '',
                    },
                    path: '/auth/sign-up',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-up',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 401);
        });

        it('should return 401 is wrong Authorization header', async () => {

            const jwtStub = sinon.stub(jwt);
            const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');

            jwtStub.verify.throws(new JsonWebTokenError("invalid token"))

            secretSendStub.resolves({
                SecretString: "{\"jwtPrivateKey\": \"IamASecret\"}"
            });

            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    "password": "Password123!",
                    "role": "admin"
                }),
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s"
                },
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-up',
                pathParameters: {},
                queryStringParameters: {
                },
                requestContext: {
                    accountId: '123456789012',
                    apiId: '1234',
                    authorizer: {},
                    httpMethod: 'post',
                    identity: {
                        accessKey: '',
                        accountId: '',
                        apiKey: '',
                        apiKeyId: '',
                        caller: '',
                        clientCert: {
                            clientCertPem: '',
                            issuerDN: '',
                            serialNumber: '',
                            subjectDN: '',
                            validity: { notAfter: '', notBefore: '' },
                        },
                        cognitoAuthenticationProvider: '',
                        cognitoAuthenticationType: '',
                        cognitoIdentityId: '',
                        cognitoIdentityPoolId: '',
                        principalOrgId: '',
                        sourceIp: '',
                        user: '',
                        userAgent: '',
                        userArn: '',
                    },
                    path: '/auth/sign-up',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-up',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 401);

            sinon.assert.calledOnce(secretSendStub);
            sinon.assert.calledWith(secretSendStub, sinon.match(function (command) {
                return command instanceof GetSecretValueCommand &&
                    command.input.SecretId === "SECRET"
            }, "GetSecretValueCommand with correct parameters"));

            sinon.assert.calledOnce(jwtStub.verify);
            sinon.assert.calledWithExactly(jwtStub.verify, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s", "IamASecret")

        });

        it('should return 400 when password is undefined', async () => {

            const jwtStub = sinon.stub(jwt);
            const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');

            jwtStub.verify.resolves();

            secretSendStub.resolves({
                SecretString: "{\"jwtPrivateKey\": \"IamASecret\"}"
            });

            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    "role": "admin"
                }),
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s"
                },
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-up',
                pathParameters: {},
                queryStringParameters: {
                },
                requestContext: {
                    accountId: '123456789012',
                    apiId: '1234',
                    authorizer: {},
                    httpMethod: 'post',
                    identity: {
                        accessKey: '',
                        accountId: '',
                        apiKey: '',
                        apiKeyId: '',
                        caller: '',
                        clientCert: {
                            clientCertPem: '',
                            issuerDN: '',
                            serialNumber: '',
                            subjectDN: '',
                            validity: { notAfter: '', notBefore: '' },
                        },
                        cognitoAuthenticationProvider: '',
                        cognitoAuthenticationType: '',
                        cognitoIdentityId: '',
                        cognitoIdentityPoolId: '',
                        principalOrgId: '',
                        sourceIp: '',
                        user: '',
                        userAgent: '',
                        userArn: '',
                    },
                    path: '/auth/sign-up',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-up',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 400);

            sinon.assert.calledOnce(secretSendStub);
            sinon.assert.calledWith(secretSendStub, sinon.match(function (command) {
                return command instanceof GetSecretValueCommand &&
                    command.input.SecretId === "SECRET"
            }, "GetSecretValueCommand with correct parameters"));

            sinon.assert.calledOnce(jwtStub.verify);
            sinon.assert.calledWithExactly(jwtStub.verify, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s", "IamASecret")

        });

        it('should return 400 when role is undefined', async () => {

            const jwtStub = sinon.stub(jwt);
            const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');

            jwtStub.verify.resolves();

            secretSendStub.resolves({
                SecretString: "{\"jwtPrivateKey\": \"IamASecret\"}"
            });

            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    "password": "Password123!"
                }),
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s"
                },
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-up',
                pathParameters: {},
                queryStringParameters: {
                },
                requestContext: {
                    accountId: '123456789012',
                    apiId: '1234',
                    authorizer: {},
                    httpMethod: 'post',
                    identity: {
                        accessKey: '',
                        accountId: '',
                        apiKey: '',
                        apiKeyId: '',
                        caller: '',
                        clientCert: {
                            clientCertPem: '',
                            issuerDN: '',
                            serialNumber: '',
                            subjectDN: '',
                            validity: { notAfter: '', notBefore: '' },
                        },
                        cognitoAuthenticationProvider: '',
                        cognitoAuthenticationType: '',
                        cognitoIdentityId: '',
                        cognitoIdentityPoolId: '',
                        principalOrgId: '',
                        sourceIp: '',
                        user: '',
                        userAgent: '',
                        userArn: '',
                    },
                    path: '/auth/sign-up',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-up',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 400);

            sinon.assert.calledOnce(secretSendStub);
            sinon.assert.calledWith(secretSendStub, sinon.match(function (command) {
                return command instanceof GetSecretValueCommand &&
                    command.input.SecretId === "SECRET"
            }, "GetSecretValueCommand with correct parameters"));

            sinon.assert.calledOnce(jwtStub.verify);
            sinon.assert.calledWithExactly(jwtStub.verify, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s", "IamASecret")

        });

        it('should return 400 when role has wrong value', async () => {

            const jwtStub = sinon.stub(jwt);
            const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');

            jwtStub.verify.resolves();

            secretSendStub.resolves({
                SecretString: "{\"jwtPrivateKey\": \"IamASecret\"}"
            });

            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    "password": "Password123!",
                    "role": "IamWrong"
                }),
                headers: {
                    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s"
                },
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-up',
                pathParameters: {},
                queryStringParameters: {
                },
                requestContext: {
                    accountId: '123456789012',
                    apiId: '1234',
                    authorizer: {},
                    httpMethod: 'post',
                    identity: {
                        accessKey: '',
                        accountId: '',
                        apiKey: '',
                        apiKeyId: '',
                        caller: '',
                        clientCert: {
                            clientCertPem: '',
                            issuerDN: '',
                            serialNumber: '',
                            subjectDN: '',
                            validity: { notAfter: '', notBefore: '' },
                        },
                        cognitoAuthenticationProvider: '',
                        cognitoAuthenticationType: '',
                        cognitoIdentityId: '',
                        cognitoIdentityPoolId: '',
                        principalOrgId: '',
                        sourceIp: '',
                        user: '',
                        userAgent: '',
                        userArn: '',
                    },
                    path: '/auth/sign-up',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-up',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 400);

            sinon.assert.calledOnce(secretSendStub);
            sinon.assert.calledWith(secretSendStub, sinon.match(function (command) {
                return command instanceof GetSecretValueCommand &&
                    command.input.SecretId === "SECRET"
            }, "GetSecretValueCommand with correct parameters"));

            sinon.assert.calledOnce(jwtStub.verify);
            sinon.assert.calledWithExactly(jwtStub.verify, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s", "IamASecret")

        });
    })

    it('should return 409 when user already exists in cognito', async () => {

        const jwtStub = sinon.stub(jwt);
        jwtStub.verify.returns();
        jwtStub.decode.returns({
            user: "user@email.com"
        });

        const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');
        secretSendStub.resolves({
            SecretString: "{\"jwtPrivateKey\": \"IamASecret\"}"
        });

        const listUsersStub = sinon.stub(CognitoIdentityProvider.prototype, 'listUsers');
        listUsersStub.resolves({
            Users: [{
                UserStatus: "CONFIRMED"
            }]
        })

        const adminCreateUserStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminCreateUser');
        const adminSetUserPasswordStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminSetUserPassword');
        const adminInitiateAuthStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminInitiateAuth');

        const event: APIGatewayProxyEvent = {
            httpMethod: 'post',
            body: JSON.stringify({
                "password": "Password123!",
                "role": "admin"
            }),
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s"
            },
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/auth/sign-up',
            pathParameters: {},
            queryStringParameters: {
            },
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'post',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    clientCert: {
                        clientCertPem: '',
                        issuerDN: '',
                        serialNumber: '',
                        subjectDN: '',
                        validity: { notAfter: '', notBefore: '' },
                    },
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                },
                path: '/auth/sign-up',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/auth/sign-up',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        const response = await lambdaHandler(event);
        assert.equal(response.statusCode, 409);

        sinon.assert.calledOnce(secretSendStub);
        sinon.assert.calledWith(secretSendStub, sinon.match(function (command) {
            return command instanceof GetSecretValueCommand &&
                command.input.SecretId === "SECRET"
        }, "GetSecretValueCommand with correct parameters"));

        sinon.assert.calledOnce(jwtStub.verify);
        sinon.assert.calledWithExactly(jwtStub.verify, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s", "IamASecret")

        sinon.assert.calledOnce(listUsersStub);
        sinon.assert.calledWith(listUsersStub, {
            UserPoolId: "USER_POOL_ID",
            Filter: `email = "user@email.com"`,
            Limit: 1
        })

        sinon.assert.notCalled(adminCreateUserStub);
        sinon.assert.notCalled(adminSetUserPasswordStub);
        sinon.assert.notCalled(adminInitiateAuthStub);

    });

    it('should return 200', async () => {
        const jwtStub = sinon.stub(jwt);
        jwtStub.verify.returns();
        jwtStub.decode.returns({
            user: "user@email.com"
        });

        const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');
        secretSendStub.resolves({
            SecretString: "{\"jwtPrivateKey\": \"IamASecret\"}"
        });

        const listUsersStub = sinon.stub(CognitoIdentityProvider.prototype, 'listUsers');
        listUsersStub.resolves({
            Users: []
        })

        const adminCreateUserStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminCreateUser');
        adminCreateUserStub.resolves();

        const adminSetUserPasswordStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminSetUserPassword');
        adminSetUserPasswordStub.resolves();

        const adminInitiateAuthStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminInitiateAuth');
        adminInitiateAuthStub.resolves({
            AuthenticationResult: {
                AccessToken: "12345",
                IdToken: "67890",
            }
        });

        const event: APIGatewayProxyEvent = {
            httpMethod: 'post',
            body: JSON.stringify({
                "password": "Password123!",
                "role": "admin"
            }),
            headers: {
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s"
            },
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/auth/sign-up',
            pathParameters: {},
            queryStringParameters: {
            },
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'post',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    clientCert: {
                        clientCertPem: '',
                        issuerDN: '',
                        serialNumber: '',
                        subjectDN: '',
                        validity: { notAfter: '', notBefore: '' },
                    },
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                },
                path: '/auth/sign-up',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/auth/sign-up',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        const response = await lambdaHandler(event);
        assert.equal(response.statusCode, 200);
        assert.equal(response.body, JSON.stringify({
            AccessToken: "12345",
            IdToken: "67890",
        }))

        sinon.assert.calledOnce(secretSendStub);
        sinon.assert.calledWith(secretSendStub, sinon.match(function (command) {
            return command instanceof GetSecretValueCommand &&
                command.input.SecretId === "SECRET"
        }, "GetSecretValueCommand with correct parameters"));

        sinon.assert.calledOnce(jwtStub.verify);
        sinon.assert.calledWithExactly(jwtStub.verify, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZGF2aWRlLmZydWNpQGdtYWlsLmNvbSIsImlhdCI6MTcxOTE0ODAxMCwiZXhwIjoxNzE5MTUxNjEwfQ.zBNHrUQIs3plxXXC_i4PlIoUwzm1sN7MgUy2j47r95s", "IamASecret")

        sinon.assert.calledOnce(listUsersStub);
        sinon.assert.calledWith(listUsersStub, {
            UserPoolId: "USER_POOL_ID",
            Filter: `email = "user@email.com"`,
            Limit: 1
        })

        sinon.assert.calledOnce(adminCreateUserStub);
        sinon.assert.calledWith(adminCreateUserStub, {
            UserPoolId: "USER_POOL_ID",
            Username: "user@email.com",
            TemporaryPassword: "Password123!",
            UserAttributes: [
                {
                    Name: 'email',
                    Value: "user@email.com"
                },
                {
                    Name: 'email_verified',
                    Value: 'true'
                },
                { Name: "custom:role", Value: "admin" }
            ],
            MessageAction: 'SUPPRESS'
        })

        sinon.assert.calledOnce(adminSetUserPasswordStub);
        sinon.assert.calledWith(adminInitiateAuthStub, {
            AuthFlow: "ADMIN_NO_SRP_AUTH",
            UserPoolId: "USER_POOL_ID",
            ClientId: "USER_POOL_CLIENT_ID",
            AuthParameters: {
                USERNAME: "user@email.com",
                PASSWORD: "Password123!"
            }
        });
    })
});