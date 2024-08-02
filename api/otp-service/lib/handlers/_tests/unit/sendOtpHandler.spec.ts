import { afterEach, before, describe, it } from "mocha";
import sinon from "sinon";
import assert from "node:assert";
import { lambdaHandler } from "../../../../app";
import { APIGatewayProxyEvent } from "aws-lambda";
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";


describe('POST /sent-otp', () => {

    before(async () => {

    });

    afterEach(async () => {
        sinon.restore();
    });

    describe('bad request', () => {

        it('should return 400 if email is undefined', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'post',
                body: '',
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/otp/send',
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
                    path: '/otp/send',
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

    it('should return 403 TOO_MANY_REQUESTS when otp in dynamo == otp limit config', async () => {

        const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');
        const sesSendStub = sinon.stub(SESClient.prototype, 'send');

        sendStub.onFirstCall().resolves({
            Items: [
                { receiver: 'receiver@mail.com', otp: '1234' },
                { receiver: 'receiver@mail.com', otp: '1235' },
                { receiver: 'receiver@mail.com', otp: '1236' }
            ],
            Count: 3,
            ScannedCount: 3
        })

        const event: APIGatewayProxyEvent = {
            httpMethod: 'post',
            body: JSON.stringify({
                receiver: "receiver@mail.com"
            }),
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/otp/send',
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
                path: '/otp/send',
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
            errorCode: "TOO_MANY_REQUESTS"
        }));

        sinon.assert.calledOnce(sendStub);
        sinon.assert.calledWith(sendStub.firstCall, sinon.match(function (command) {
            return command instanceof QueryCommand &&
                command.input.TableName === "OTP_TABLE_NAME" &&
                command.input.KeyConditionExpression === 'receiver = :receiver' &&
                command.input.ExpressionAttributeValues![':receiver'] === 'receiver@mail.com';
        }, "QueryCommand with correct parameters"));

        sinon.assert.notCalled(sesSendStub);
    });

    it('should return 403 TOO_MANY_REQUESTS when otp in dynamo > otp limit config', async () => {

        const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');
        const sesSendStub = sinon.stub(SESClient.prototype, 'send');

        sendStub.onFirstCall().resolves({
            Items: [
                { receiver: 'receiver@mail.com', otp: '1234' },
                { receiver: 'receiver@mail.com', otp: '1235' },
                { receiver: 'receiver@mail.com', otp: '1236' },
                { receiver: 'receiver@mail.com', otp: '1236' }
            ],
            Count: 3,
            ScannedCount: 3
        })

        const event: APIGatewayProxyEvent = {
            httpMethod: 'post',
            body: JSON.stringify({
                receiver: "receiver@mail.com"
            }),
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/otp/send',
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
                path: '/otp/send',
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
            errorCode: "TOO_MANY_REQUESTS"
        }));

        sinon.assert.calledOnce(sendStub);
        sinon.assert.calledWith(sendStub.firstCall, sinon.match(function (command) {
            return command instanceof QueryCommand &&
                command.input.TableName === "OTP_TABLE_NAME" &&
                command.input.KeyConditionExpression === 'receiver = :receiver' &&
                command.input.ExpressionAttributeValues![':receiver'] === 'receiver@mail.com';
        }, "QueryCommand with correct parameters"));

        sinon.assert.notCalled(sesSendStub);
    });


    it('should return 204 when otp is sent', async () => {

        const sendStub = sinon.stub(DynamoDBClient.prototype, 'send');
        const sesSendStub = sinon.stub(SESClient.prototype, 'send');

        sendStub.onFirstCall().resolves({
            Items: [
                { receiver: 'receiver@mail.com', otp: '1234' },
                { receiver: 'receiver@mail.com', otp: '1235' },
            ],
            Count: 2,
            ScannedCount: 2
        })

        sendStub.onSecondCall().resolves();
        sesSendStub.resolves();
        
        const mockNow = new Date(2020, 0, 1, 14, 48, 0);
        sinon.useFakeTimers(mockNow.getTime());

        sinon.stub(Math, 'random').returns(0.5);

        const event: APIGatewayProxyEvent = {
            httpMethod: 'post',
            body: JSON.stringify({
                receiver: "receiver@mail.com"
            }),
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/otp/send',
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
                path: '/otp/send',
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

        assert.equal(response.statusCode, 204);

        sinon.assert.calledTwice(sendStub);
        sinon.assert.calledWith(sendStub.firstCall, sinon.match(function (command) {
            return command instanceof QueryCommand &&
                command.input.TableName === "OTP_TABLE_NAME" &&
                command.input.KeyConditionExpression === 'receiver = :receiver' &&
                command.input.ExpressionAttributeValues![':receiver'] === 'receiver@mail.com';
        }, "QueryCommand with correct parameters"));

        sinon.assert.calledWith(sendStub.secondCall, sinon.match(function(command) {
            return command instanceof PutCommand &&
              command.input.TableName === "OTP_TABLE_NAME" &&
              command.input.Item!.createdAt === "2020-01-01T13:48:00.000Z" &&
              command.input.Item!.createdAtTimestamp === 1577886480 &&
              command.input.Item!.expiration === 1577886480 + 180 &&
              command.input.Item!.otp === 5500 &&
              command.input.Item!.receiver === 'receiver@mail.com';
          }, "PutCommand with correct parameters"));

        sinon.assert.calledOnce(sesSendStub);
        sinon.assert.calledWith(sesSendStub, sinon.match(function(command) {
            return command instanceof SendEmailCommand &&
              command.input.Destination!.ToAddresses![0] === 'receiver@mail.com' &&
              command.input.Message!.Body!.Text!.Data === `OTP: 5500` &&
              command.input.Message!.Subject!.Data === "Your OTP" &&
              command.input.Source === "sender@email.com";
          }, "SendEmailCommand with correct parameters"));
    });
});