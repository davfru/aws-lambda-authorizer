import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import jwt from 'jsonwebtoken';
import { DecodedJwt, SignUpRequestBody } from '../interface';
import { signUpSchema, validateRequest } from '../validators';

const USER_POOL_ID: string = process.env.USER_POOL_ID!;
const USER_POOL_CLIENT_ID: string = process.env.USER_POOL_CLIENT_ID!;
const SECRET: string = process.env.SECRET!;
const REGION = process.env.REGION!;
const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY!;


/**
*
* Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
* @param {Object} event - API Gateway Lambda Proxy Input Format
*
* Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
* @returns {Object} object - API Gateway Lambda Proxy Output Format
*
*/
export const signUpHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.info("event: ", event);

  const response = {
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",  // Allow from anywhere 
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: ""
  };

  // validate request

  const authorization = event.headers["Authorization"];

  if (!authorization) {
    response.statusCode = 401;
    return response;
  }

  // validate request - retrieve secret 

  const secretClient = new SecretsManagerClient({ region: REGION });
  const secretResponse = await secretClient.send(new GetSecretValueCommand({
    SecretId: SECRET
  }));

  const jwtSecretKey = JSON.parse(secretResponse.SecretString!)[JWT_SECRET_KEY];

  // validate request - check if authorization is correct

  let decoded: DecodedJwt = null as any;

  try {
    const token = authorization.split(" ")[1];
    jwt.verify(token, jwtSecretKey);
    decoded = jwt.decode(token) as DecodedJwt;
  } catch (e) {
    console.error("Failed verifying JWT: ", e);
    response.statusCode = 401;
    return response;
  }

  // validate request - validate request body

  const errorResponse = await validateRequest(signUpSchema, event);

  if (errorResponse) {
    return errorResponse;
  }

  const { body } = event;
  const { password, role }: SignUpRequestBody = JSON.parse(body!);

  // check if user already exists in cognito

  const email = decoded.user;

  const cognito = new CognitoIdentityProvider();
  const data = await cognito.listUsers({
    UserPoolId: USER_POOL_ID,
    Filter: `email = "${email}"`,
    Limit: 1
  });

  if (data.Users?.length) {
    response.statusCode = 409;
    response.body = (JSON.stringify({ // TODO interface
      code: "USER_ALREADY_EXISTS"
    }));

    return response;
  }

  // create user

  await cognito.adminCreateUser({
    UserPoolId: USER_POOL_ID,
    Username: email,
    TemporaryPassword: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      },
      {
        Name: 'email_verified',
        Value: 'true'
      },
      { Name: "custom:role", Value: role }
    ],
    MessageAction: 'SUPPRESS'
  });

  // activate user

  await cognito.adminSetUserPassword({
    Password: password,
    Username: email,
    UserPoolId: USER_POOL_ID,
    Permanent: true
  });

  // login the user

  const loginData = await cognito.adminInitiateAuth({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    UserPoolId: USER_POOL_ID,
    ClientId: USER_POOL_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  });

  response.body = (JSON.stringify({ // TODO interface
    AccessToken: loginData.AuthenticationResult?.AccessToken,
    IdToken: loginData.AuthenticationResult?.IdToken
  }));

  return response;
};
