import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const USER_POOL_ID: string = process.env.USER_POOL_ID!;

/**
*
* Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
* @param {Object} event - API Gateway Lambda Proxy Input Format
*
* Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
* @returns {Object} object - API Gateway Lambda Proxy Output Format
*
*/
export const preSignUpHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

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

  console.info("event: ", event);
  
  const email = event.queryStringParameters?.email;

  if (!email) { // TODO add regex check
    response.statusCode = 400;
    return response;
  }

  // business logic

  try {

    const params = {
      UserPoolId: USER_POOL_ID,
      Filter: `email = "${email}"`,
      Limit: 1
    };

    const cognito = new CognitoIdentityProvider();
    const data = await cognito.listUsers(params);

    if (data.Users?.length/* && data.Users[0].UserStatus === "CONFIRMED"*/) {
      response.statusCode = 400; // user exist then the email cannot be used again
    }

    return response;

  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
};
