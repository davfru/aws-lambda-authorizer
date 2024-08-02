import { afterEach, before, describe, it } from "mocha";
import sinon from "sinon";
import assert from "node:assert";
import { lambdaHandler } from "../../../../app";
import { APIGatewayProxyEvent } from "aws-lambda";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

describe('POST /signin', () => {

    before(async () => {

    });

    afterEach(async () => {
        sinon.restore();
    });

    describe('bad request', () => {

        it('should return 400 if email and password are undefined', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: '',
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 400);
        });

        // password

        it('should return 400 if password is null', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    password: null
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 400);
        });

        it('should return 400 if password is empty', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    password: ''
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 400);
        });

        it('should return 400 if password is not policy compliant', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    password: 'password'
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);
            assert.equal(response.statusCode, 400);
        });

        // email

        it('should return 400 if email is null', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    email: null
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);
            assert.equal(response.statusCode, 400);
        });

        it('should return 400 if email is empty', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    email: ''
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);
            assert.equal(response.statusCode, 400);
        });

        it('should return 400 if email is invalid', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    email: 'email'
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);
            assert.equal(response.statusCode, 400);
        });
    })

    describe('auth', () => {

        it('should return 401 if user not exists', async () => {

            const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');

            const adminInitiateAuthStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminInitiateAuth');
            adminInitiateAuthStub.throws({
                __type: "UserNotFoundException"
            });

            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    email: 'mail@mail.com',
                    password: 'Cristallo23!'
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 401);
            assert.deepEqual(JSON.parse(response.body), { code: "NOT_VALID_CREDENTIALS" });

            sinon.assert.calledOnce(adminInitiateAuthStub);
            sinon.assert.calledWith(adminInitiateAuthStub, {
                AuthFlow: 'ADMIN_NO_SRP_AUTH',
                UserPoolId: "USER_POOL_ID",
                ClientId: "USER_POOL_CLIENT_ID",
                AuthParameters: {
                    USERNAME: 'mail@mail.com',
                    PASSWORD: 'Cristallo23!'
                }
            })

            sinon.assert.notCalled(sendStub);

        });

        it('should return 401 if wrong credentials', async () => {

            const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');

            const adminInitiateAuthStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminInitiateAuth');
            adminInitiateAuthStub.throws({
                __type: "NotAuthorizedException"
            });

            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    email: 'mail@mail.com',
                    password: 'Cristallo23!'
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 401);
            assert.deepEqual(JSON.parse(response.body), { code: "NOT_VALID_CREDENTIALS" });

            sinon.assert.calledOnce(adminInitiateAuthStub);
            sinon.assert.calledWith(adminInitiateAuthStub, {
                AuthFlow: 'ADMIN_NO_SRP_AUTH',
                UserPoolId: "USER_POOL_ID",
                ClientId: "USER_POOL_CLIENT_ID",
                AuthParameters: {
                    USERNAME: 'mail@mail.com',
                    PASSWORD: 'Cristallo23!'
                }
            })

            sinon.assert.notCalled(sendStub);

        });

        it('should return 500 if cognito return not managed error', async () => {

            const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');

            const adminInitiateAuthStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminInitiateAuth');
            adminInitiateAuthStub.throws({
                code: "UnhandleError"
            });

            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    email: 'mail@mail.com',
                    password: 'Cristallo23!'
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 500);
            assert.deepEqual(JSON.parse(response.body), { message: { code: "UnhandleError" } });

            sinon.assert.calledOnce(adminInitiateAuthStub);
            sinon.assert.calledWith(adminInitiateAuthStub, {
                AuthFlow: 'ADMIN_NO_SRP_AUTH',
                UserPoolId: "USER_POOL_ID",
                ClientId: "USER_POOL_CLIENT_ID",
                AuthParameters: {
                    USERNAME: 'mail@mail.com',
                    PASSWORD: 'Cristallo23!'
                }
            })

            sinon.assert.notCalled(sendStub);
        });

        it('should return 500 if dynamo return not managed error', async () => {

            const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');
            sendStub.throws({
                code: "UnhandleError"
            });

            const adminInitiateAuthStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminInitiateAuth');
            adminInitiateAuthStub.resolves({
                AuthenticationResult: {
                    AccessToken: "accessToken",
                    RefreshToken: "refreshToken",
                    IdToken: "eyJraWQiOiJZYmlsdlNqY3J3a1ZFYlFmdjFTY1wvSEJabGxoQ0xZeERneDV0RmtzVkd6TT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3Mzk0NTgzMi1iMGMxLTcwZjUtYWRjYy1mZmQ4ODU1ZDFlNTQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfVlJLYkRvODJUIiwiY29nbml0bzp1c2VybmFtZSI6IjczOTQ1ODMyLWIwYzEtNzBmNS1hZGNjLWZmZDg4NTVkMWU1NCIsIm9yaWdpbl9qdGkiOiJmZWI3ODBlZi1hYzQxLTQxMDUtYjc3Yi0zMjRmODg2NDZiYWEiLCJhdWQiOiIxcG1kNDhodGMzNnQ0YXJ0ZDJpYXNjMHN2biIsImV2ZW50X2lkIjoiZDA0Zjg3MGYtZGIyNS00ODc0LTk3YzUtOGQyY2I2ODMxMzBlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTkxNTU3NTgsImV4cCI6MTcxOTE1OTM1OCwiY3VzdG9tOnJvbGUiOiJhZG1pbiIsImlhdCI6MTcxOTE1NTc1OCwianRpIjoiNmZmYTFhZDktODAyMS00Mjc2LTkyOGQtMmM1NTVkNzM3NWI0IiwiZW1haWwiOiJkYXZpZGUuZnJ1Y2lAZ21haWwuY29tIn0.iwsOg45JW5e7zUtckNfnjUivvvpva7Yhriqvc7MPMRRy2wsuK0V6nYNwhFIcrWL3MAD7nS1oi9PbjulMlFO0yhdfGgIOBGQtLFlgBrxLmyaz8g-5iiRynqIRkzJLyzEZuKamGxQZszeYouRmedmYvgpQMNfP-MDEzt-zuCm8icsN6bknrolSlTp41_5qi-QB1YV02WwRuOafPzjLEfvOlRoSO5nr5MlTI4uESeGKRne0iDFUOW4m2QF_SiWV3iyi4Bn6Qw1VDH1modOaBOE0P2h6gbphA41irw3O-ujZd4Uq8u0GgvWhE0T6_6rQh60aBwS3xxgW-1t1R3TxO6F6w"
                }
            });

            const mockNow = new Date(2020, 0, 1, 14, 48, 0);
            sinon.useFakeTimers(mockNow.getTime());

            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    email: 'mail@mail.com',
                    password: 'Cristallo23!'
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/sign-in',
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
                    path: '/auth/sign-in',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/sign-in',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 500);
            assert.deepEqual(JSON.parse(response.body), { message: { code: "UnhandleError" } });

            sinon.assert.calledOnce(adminInitiateAuthStub);
            sinon.assert.calledWith(adminInitiateAuthStub, {
                AuthFlow: 'ADMIN_NO_SRP_AUTH',
                UserPoolId: "USER_POOL_ID",
                ClientId: "USER_POOL_CLIENT_ID",
                AuthParameters: {
                    USERNAME: 'mail@mail.com',
                    PASSWORD: 'Cristallo23!'
                }
            })

            sinon.assert.calledOnce(sendStub);
            sinon.assert.calledWith(sendStub, sinon.match(function (command) {
                return command instanceof PutCommand &&
                    command.input.TableName === "REFRESH_TOKEN_TABLE_NAME" &&
                    command.input.Item!.id === "73945832-b0c1-70f5-adcc-ffd8855d1e54" &&
                    command.input.Item!.refreshToken === "refreshToken" &&
                    command.input.Item!.ttl === 1580046480
            }, "PutCommand with correct parameters"));
        });
    })

    it('should return 200 id user has been successfully login', async () => {

        const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');
        sendStub.resolves();

        const adminInitiateAuthStub = sinon.stub(CognitoIdentityProvider.prototype, 'adminInitiateAuth');
        adminInitiateAuthStub.resolves({
            AuthenticationResult: {
                AccessToken: "accessToken",
                RefreshToken: "refreshToken",
                IdToken: "eyJraWQiOiJZYmlsdlNqY3J3a1ZFYlFmdjFTY1wvSEJabGxoQ0xZeERneDV0RmtzVkd6TT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3Mzk0NTgzMi1iMGMxLTcwZjUtYWRjYy1mZmQ4ODU1ZDFlNTQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfVlJLYkRvODJUIiwiY29nbml0bzp1c2VybmFtZSI6IjczOTQ1ODMyLWIwYzEtNzBmNS1hZGNjLWZmZDg4NTVkMWU1NCIsIm9yaWdpbl9qdGkiOiJmZWI3ODBlZi1hYzQxLTQxMDUtYjc3Yi0zMjRmODg2NDZiYWEiLCJhdWQiOiIxcG1kNDhodGMzNnQ0YXJ0ZDJpYXNjMHN2biIsImV2ZW50X2lkIjoiZDA0Zjg3MGYtZGIyNS00ODc0LTk3YzUtOGQyY2I2ODMxMzBlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTkxNTU3NTgsImV4cCI6MTcxOTE1OTM1OCwiY3VzdG9tOnJvbGUiOiJhZG1pbiIsImlhdCI6MTcxOTE1NTc1OCwianRpIjoiNmZmYTFhZDktODAyMS00Mjc2LTkyOGQtMmM1NTVkNzM3NWI0IiwiZW1haWwiOiJkYXZpZGUuZnJ1Y2lAZ21haWwuY29tIn0.iwsOg45JW5e7zUtckNfnjUivvvpva7Yhriqvc7MPMRRy2wsuK0V6nYNwhFIcrWL3MAD7nS1oi9PbjulMlFO0yhdfGgIOBGQtLFlgBrxLmyaz8g-5iiRynqIRkzJLyzEZuKamGxQZszeYouRmedmYvgpQMNfP-MDEzt-zuCm8icsN6bknrolSlTp41_5qi-QB1YV02WwRuOafPzjLEfvOlRoSO5nr5MlTI4uESeGKRne0iDFUOW4m2QF_SiWV3iyi4Bn6Qw1VDH1modOaBOE0P2h6gbphA41irw3O-ujZd4Uq8u0GgvWhE0T6_6rQh60aBwS3xxgW-1t1R3TxO6F6w"
            }
        });

        const mockNow = new Date(2020, 0, 1, 14, 48, 0);
        sinon.useFakeTimers(mockNow.getTime());

        const event: APIGatewayProxyEvent = {
            httpMethod: 'post',
            body: JSON.stringify({
                email: 'mail@mail.com',
                password: 'Cristallo23!'
            }),
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/auth/sign-in',
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
                path: '/auth/sign-in',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/auth/sign-in',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        const response = await lambdaHandler(event);

        assert.equal(response.statusCode, 200);
        assert.deepEqual(JSON.parse(response.body), {
            AccessToken: "accessToken",
            IdToken: "eyJraWQiOiJZYmlsdlNqY3J3a1ZFYlFmdjFTY1wvSEJabGxoQ0xZeERneDV0RmtzVkd6TT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI3Mzk0NTgzMi1iMGMxLTcwZjUtYWRjYy1mZmQ4ODU1ZDFlNTQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9ldS1jZW50cmFsLTFfVlJLYkRvODJUIiwiY29nbml0bzp1c2VybmFtZSI6IjczOTQ1ODMyLWIwYzEtNzBmNS1hZGNjLWZmZDg4NTVkMWU1NCIsIm9yaWdpbl9qdGkiOiJmZWI3ODBlZi1hYzQxLTQxMDUtYjc3Yi0zMjRmODg2NDZiYWEiLCJhdWQiOiIxcG1kNDhodGMzNnQ0YXJ0ZDJpYXNjMHN2biIsImV2ZW50X2lkIjoiZDA0Zjg3MGYtZGIyNS00ODc0LTk3YzUtOGQyY2I2ODMxMzBlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MTkxNTU3NTgsImV4cCI6MTcxOTE1OTM1OCwiY3VzdG9tOnJvbGUiOiJhZG1pbiIsImlhdCI6MTcxOTE1NTc1OCwianRpIjoiNmZmYTFhZDktODAyMS00Mjc2LTkyOGQtMmM1NTVkNzM3NWI0IiwiZW1haWwiOiJkYXZpZGUuZnJ1Y2lAZ21haWwuY29tIn0.iwsOg45JW5e7zUtckNfnjUivvvpva7Yhriqvc7MPMRRy2wsuK0V6nYNwhFIcrWL3MAD7nS1oi9PbjulMlFO0yhdfGgIOBGQtLFlgBrxLmyaz8g-5iiRynqIRkzJLyzEZuKamGxQZszeYouRmedmYvgpQMNfP-MDEzt-zuCm8icsN6bknrolSlTp41_5qi-QB1YV02WwRuOafPzjLEfvOlRoSO5nr5MlTI4uESeGKRne0iDFUOW4m2QF_SiWV3iyi4Bn6Qw1VDH1modOaBOE0P2h6gbphA41irw3O-ujZd4Uq8u0GgvWhE0T6_6rQh60aBwS3xxgW-1t1R3TxO6F6w"
        });

        sinon.assert.calledOnce(adminInitiateAuthStub);
        sinon.assert.calledWith(adminInitiateAuthStub, {
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            UserPoolId: "USER_POOL_ID",
            ClientId: "USER_POOL_CLIENT_ID",
            AuthParameters: {
                USERNAME: 'mail@mail.com',
                PASSWORD: 'Cristallo23!'
            }
        })

        sinon.assert.calledOnce(sendStub);
        sinon.assert.calledWith(sendStub, sinon.match(function (command) {
            return command instanceof PutCommand &&
                command.input.TableName === "REFRESH_TOKEN_TABLE_NAME" &&
                command.input.Item!.id === "73945832-b0c1-70f5-adcc-ffd8855d1e54" &&
                command.input.Item!.refreshToken === "refreshToken" &&
                command.input.Item!.ttl === 1580046480
        }, "PutCommand with correct parameters"));
    });

});