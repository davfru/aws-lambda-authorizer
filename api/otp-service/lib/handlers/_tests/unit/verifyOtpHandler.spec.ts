import test, { afterEach, before, describe, it } from "mocha";
import sinon from "sinon";
import assert from "node:assert";
import { lambdaHandler } from "../../../../app";
import { APIGatewayProxyEvent } from "aws-lambda";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import jwt, { Secret } from 'jsonwebtoken';

describe('POST /verify-otp', () => {

    before(async () => {

    });

    afterEach(async () => {
        sinon.restore();
    });

    describe('bad request', () => {

        it('should return 400 if receiver is undefined', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    otp: 1234
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/otp/verify',
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
                    path: '/otp/verify',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 400);
        });

        it('should return 400 if otp is undefined', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: JSON.stringify({
                    receiver: "email@email.com"
                }),
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/otp/verify',
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
                    path: '/otp/verify',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 400);
        });
    })

    it('should return 403 INVALID_OTP when no otp in dynamo', async () => {

        const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');
        const jwtStub = sinon.stub(jwt);
        const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');

        sendStub.resolves({
            Items: [
            ],
            Count: 0,
            ScannedCount: 0
        })

        const event: APIGatewayProxyEvent = {
            httpMethod: 'post',
            body: JSON.stringify({
                receiver: "receiver@mail.com",
                otp: 1234
            }),
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/otp/verify',
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
                path: '/otp/verify',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        const response = await lambdaHandler(event);

        assert.equal(response.statusCode, 403);
        assert.equal(response.body, JSON.stringify({
            errorCode: "INVALID_OTP"
        }));

        sinon.assert.calledOnce(sendStub);
        sinon.assert.calledWith(sendStub.firstCall, sinon.match(function (command) {
            return command instanceof QueryCommand &&
                command.input.TableName === "OTP_TABLE_NAME" &&
                command.input.KeyConditionExpression === 'receiver = :receiver' &&
                command.input.ExpressionAttributeValues![':receiver'] === 'receiver@mail.com' &&
                command.input.ScanIndexForward === false
        }, "QueryCommand with correct parameters"));

        sinon.assert.notCalled(secretSendStub);
        sinon.assert.notCalled(jwtStub.sign);
    });

    it('should return 403 INVALID_OTP when sent otp is invalid', async () => {

        const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');
        const jwtStub = sinon.stub(jwt);
        const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');

        sendStub.resolves({
            Items: [
                { otp: 1234 },
                { otp: 1233 }
            ],
            Count: 2,
            ScannedCount: 2
        })

        const event: APIGatewayProxyEvent = {
            httpMethod: 'post',
            body: JSON.stringify({
                receiver: "receiver@mail.com",
                otp: 1232
            }),
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/otp/verify',
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
                path: '/otp/verify',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        const response = await lambdaHandler(event);

        assert.equal(response.statusCode, 403);
        assert.equal(response.body, JSON.stringify({
            errorCode: "INVALID_OTP"
        }));

        sinon.assert.calledOnce(sendStub);
        sinon.assert.calledWith(sendStub.firstCall, sinon.match(function (command) {
            return command instanceof QueryCommand &&
                command.input.TableName === "OTP_TABLE_NAME" &&
                command.input.KeyConditionExpression === 'receiver = :receiver' &&
                command.input.ExpressionAttributeValues![':receiver'] === 'receiver@mail.com' &&
                command.input.ScanIndexForward === false
        }, "QueryCommand with correct parameters"));

        sinon.assert.notCalled(secretSendStub);
        sinon.assert.notCalled(jwtStub.sign);
    });

    it('should return 200 when sent otp is valid', async () => {

        const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');
        const jwtSignStub = sinon.stub(jwt, 'sign') as unknown as sinon.SinonStub<[any, Secret, any], string>;

        jwtSignStub.returns("accessToken");

        const secretSendStub = sinon.stub(SecretsManagerClient.prototype, 'send');

        sendStub.resolves({
            Items: [
                { otp: 1234 },
                { otp: 1233 }
            ],
            Count: 2,
            ScannedCount: 2
        });

        secretSendStub.resolves({
            SecretString: "{\"jwtPrivateKey\": \"IamASecret\"}"
        });

        const event: APIGatewayProxyEvent = {
            httpMethod: 'post',
            body: JSON.stringify({
                receiver: "receiver@mail.com",
                otp: 1234
            }),
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/otp/verify',
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
                path: '/otp/verify',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        const response = await lambdaHandler(event);

        assert.equal(response.statusCode, 200);
        assert.equal(response.body, JSON.stringify({
            accessToken: "accessToken"
        }));

        sinon.assert.calledOnce(sendStub);
        sinon.assert.calledWith(sendStub.firstCall, sinon.match(function (command) {
            return command instanceof QueryCommand &&
                command.input.TableName === "OTP_TABLE_NAME" &&
                command.input.KeyConditionExpression === 'receiver = :receiver' &&
                command.input.ExpressionAttributeValues![':receiver'] === 'receiver@mail.com' &&
                command.input.ScanIndexForward === false
        }, "QueryCommand with correct parameters"));

        sinon.assert.calledOnce(secretSendStub);
        sinon.assert.calledWith(secretSendStub, sinon.match(function (command) {
            return command instanceof GetSecretValueCommand &&
                command.input.SecretId === "SECRET"
        }, "GetSecretValueCommand with correct parameters"));

        sinon.assert.calledOnce(jwtSignStub);
        sinon.assert.calledWithExactly(jwtSignStub, { user: "receiver@mail.com" }, "IamASecret", { expiresIn: '1h' })
    });
});