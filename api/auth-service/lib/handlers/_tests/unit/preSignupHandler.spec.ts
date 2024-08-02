import test, { afterEach, before, describe, it } from "node:test";
import sinon from "sinon";
import assert from "node:assert";
import { lambdaHandler } from "../../../../app";
import { APIGatewayProxyEvent } from "aws-lambda";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";

describe('GET /pre-sign-up', () => {

    before(async () => {

    });

    afterEach(async () => {
        sinon.restore();
    });

    describe('bad request', () => {

        it('should return 400 if email is undefined', async () => {
            const event: APIGatewayProxyEvent = {
                httpMethod: 'get',
                body: '',
                headers: {},
                isBase64Encoded: false,
                multiValueHeaders: {},
                multiValueQueryStringParameters: {},
                path: '/auth/pre-sign-up',
                pathParameters: {},
                queryStringParameters: {
                },
                requestContext: {
                    accountId: '123456789012',
                    apiId: '1234',
                    authorizer: {},
                    httpMethod: 'get',
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
                    path: '/auth/pre-sign-up',
                    protocol: 'HTTP/1.1',
                    requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                    requestTimeEpoch: 1428582896000,
                    resourceId: '123456',
                    resourcePath: '/auth/pre-sign-up',
                    stage: 'dev',
                },
                resource: '',
                stageVariables: {},
            };

            const response = await lambdaHandler(event);

            assert.equal(response.statusCode, 400);
        });
    })

    test('should return 200 if email is not used', async () => {

        const listUsersStub = sinon.stub(CognitoIdentityProvider.prototype, 'listUsers');

        listUsersStub.resolves({ Users: [] })

        const event: APIGatewayProxyEvent = {
            httpMethod: 'get',
            body: '',
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/auth/pre-sign-up',
            pathParameters: {},
            queryStringParameters: {
                'email': 'user@email.com'
            },
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'get',
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
                path: '/auth/pre-sign-up',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/auth/pre-sign-up',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        const response = await lambdaHandler(event);

        assert.equal(response.statusCode, 200);

        sinon.assert.calledOnce(listUsersStub);

        sinon.assert.calledWith(listUsersStub, {
            UserPoolId: "USER_POOL_ID",
            Filter: `email = "user@email.com"`,
            Limit: 1
        })
    });

    test('should return 400 if email is used and the user is in FORCE_CHANGE_PASSWORD status', async () => {

        const listUsersStub = sinon.stub(CognitoIdentityProvider.prototype, 'listUsers');

        listUsersStub.resolves({
            Users: [{
                UserStatus: "FORCE_CHANGE_PASSWORD"
            }]
        })

        const event: APIGatewayProxyEvent = {
            httpMethod: 'get',
            body: '',
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/auth/pre-sign-up',
            pathParameters: {},
            queryStringParameters: {
                'email': 'user@email.com'
            },
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'get',
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
                path: '/auth/pre-sign-up',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/auth/pre-sign-up',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        const response = await lambdaHandler(event);

        assert.equal(response.statusCode, 400);
        
        sinon.assert.calledOnce(listUsersStub);

        sinon.assert.calledWith(listUsersStub, {
            UserPoolId: "USER_POOL_ID",
            Filter: `email = "user@email.com"`,
            Limit: 1
        })
    });

    test('should return 400 if email is used and the user is in CONFIRMED status', async () => {

        const listUsersStub = sinon
            .stub(CognitoIdentityProvider.prototype, 'listUsers')
            .resolves({
                Users: [{
                    UserStatus: "CONFIRMED"
                }]
            })

        const event: APIGatewayProxyEvent = {
            httpMethod: 'get',
            body: '',
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/auth/pre-sign-up',
            pathParameters: {},
            queryStringParameters: {
                'email': 'user@email.com'
            },
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'get',
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
                path: '/auth/pre-sign-up',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/auth/pre-sign-up',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        const response = await lambdaHandler(event);

        assert.equal(response.statusCode, 400);

        sinon.assert.calledOnce(listUsersStub);

        sinon.assert.calledWith(listUsersStub, {
            UserPoolId: "USER_POOL_ID",
            Filter: `email = "user@email.com"`,
            Limit: 1
        })
    });
});