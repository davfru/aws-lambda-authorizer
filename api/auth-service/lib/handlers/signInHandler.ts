import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';
import { signInSchema, validateRequest } from '../validators';

const USER_POOL_ID: string = process.env.USER_POOL_ID!;
const USER_POOL_CLIENT_ID: string = process.env.USER_POOL_CLIENT_ID!;
const REFRESH_TOKEN_TABLE_NAME: string = process.env.REFRESH_TOKEN_TABLE_NAME!;
const REGION: string = process.env.REGION!;

export interface SignInRequestBody {
  email: string
  password: string
}

export interface RefreshTokenEntity {
  id: string
  refreshToken: string
  ttl: number
}

/**
*
* Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
* @param {Object} event - API Gateway Lambda Proxy Input Format
*
* Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
* @returns {Object} object - API Gateway Lambda Proxy Output Format
*
*/
export const signInHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // validate request

  console.info("event: ", event);

  const errorResponse = await validateRequest(signInSchema, event);

  if (errorResponse) {
    return errorResponse;
  }

  // business logic

  const { body } = event;

  const response = {
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",  // Allow from anywhere 
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: ""
  };

  const { email, password } = JSON.parse(body!);

  try {

    // sign in user
    const cognito = new CognitoIdentityProvider();
    const data = await cognito.adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: USER_POOL_ID,
      ClientId: USER_POOL_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });

    // persist refresh token
    const jwtPayload = jwt.decode(data?.AuthenticationResult?.IdToken!);
    const dynamoDbClient = new DynamoDBClient({ region: REGION });

    // persist refresh token on dynamo db
    await dynamoDbClient.send(new PutCommand({
      TableName: REFRESH_TOKEN_TABLE_NAME,
      Item: {
        id: jwtPayload?.sub,
        refreshToken: data.AuthenticationResult?.RefreshToken,

        // By default, the refresh token expires 30 days after your application user signs into your user pool.
        // Setting the ttl 25 days from now in order to be sure that the token is deleted by dynamo before it's expiration
        ttl: Math.floor(Date.now() / 1000) + (25 * 24 * 60 * 60) // ttl on dynamo db must be in seconds, not milliseconds
      }
    }));

    response.body = JSON.stringify({ // TODO interface
      AccessToken: data.AuthenticationResult?.AccessToken,
      IdToken: data.AuthenticationResult?.IdToken
    });

  } catch (error: any) {
    console.error('Something went wrong:', error);

    response.statusCode = 500;
    response.body = JSON.stringify({ "message": error });

    if (error.__type === 'NotAuthorizedException' || error.__type === 'UserNotFoundException') {
      response.statusCode = 401;
      response.body = JSON.stringify({ code: 'NOT_VALID_CREDENTIALS' });
    }
  }

  return response;
};
