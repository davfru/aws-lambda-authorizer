import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { sendOtpHandler } from './lib/handlers/sendOtpHandler';
import { verifyOtpHandler } from './lib/handlers/verifyOtpHandler';

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

  if (event.path.includes('/otp/send')) return sendOtpHandler(event);
  if (event.path.includes('/otp/verify')) return verifyOtpHandler(event);

  return {
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",  // Allow from anywhere 
      "Content-Type": "application/json",
    },
    statusCode: 500,
    body: "{ 'message': 'something went wront'"
  };
};

