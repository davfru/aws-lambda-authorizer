import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createAppointmentHandler } from './lib/handlers/createAppointmentHandler';
import { listAppointmentHandler } from './lib/handlers/listAppointmentHandler';
import { generateResponse } from './lib/response';

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

  if (event.httpMethod == "POST" && event.path.includes('/customers/appointments')) return createAppointmentHandler(event);
  if (event.httpMethod == "GET" && event.path.includes('/customers/appointments')) return listAppointmentHandler(event);

  return generateResponse({ 'message': 'not found' }, 404);
};

