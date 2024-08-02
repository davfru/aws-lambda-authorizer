import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { preSignUpHandler } from './lib/handlers/preSignUpHandler';
import { signUpHandler } from './lib/handlers/signUpHandler';
import { signInHandler } from './lib/handlers/signInHandler';

/**
*
* Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
* @param {Object} event - API Gateway Lambda Proxy Input Format
*
* Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
* @returns {Object} object - API Gateway Lambda Proxy Output Format
*
*/
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  if (event.path.includes('/auth/pre-sign-up')) return preSignUpHandler(event);
  if (event.path.includes('/auth/sign-in')) return signInHandler(event);
  if (event.path.includes('/auth/sign-up')) return signUpHandler(event);

  return {
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",  // Allow from anywhere 
      "Content-Type": "application/json",
    },
    statusCode: 404,
    body: "{ 'message': 'not found' }"
  };
};

