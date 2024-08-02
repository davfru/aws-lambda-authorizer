import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import jwt from 'jsonwebtoken';
import { validateRequest, verifyOtpSchema } from '../validators';
import { OtpEntity, VerifyOtpBodyRequest } from '../interface';

const OTP_TABLE_NAME = process.env.OTP_TABLE_NAME!;
const REGION = process.env.REGION!;
const SECRET: string = process.env.SECRET!;
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
export const verifyOtpHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  // validate request

  console.info("event: ", event);

  const errorResponse = await validateRequest(verifyOtpSchema, event);

  if (errorResponse) {
    return errorResponse;
  }

  // business logic

  const { body } = event;

  const bodyRequest = JSON.parse(body!) as VerifyOtpBodyRequest;

  const response = {
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",  // Allow from anywhere 
      "Content-Type": "application/json",
    },
    statusCode: 200,
    body: ""
  };

  try {

    const dynamoDbClient = new DynamoDBClient({ region: REGION });

    // check otp limit
    const dynamoResponse = await dynamoDbClient.send(new QueryCommand({
      TableName: OTP_TABLE_NAME,
      KeyConditionExpression: 'receiver = :receiver',
      ExpressionAttributeValues: {
        ':receiver': bodyRequest.receiver
      },
      ScanIndexForward: false
    }));

    const numberOfOtp: number = dynamoResponse.Items?.length || 0;

    if (!numberOfOtp || ((dynamoResponse.Items![0] as OtpEntity).otp !== parseInt(bodyRequest.otp))) {
      response.statusCode = 403;
      response.body = JSON.stringify({
        errorCode: "INVALID_OTP"
      });
      return response;
    }

    // retrieve secret 
    const secretClient = new SecretsManagerClient({ region: REGION });
    const secretResponse = await secretClient.send(new GetSecretValueCommand({
      SecretId: SECRET
    }));

    const jwtSecretKey = JSON.parse(secretResponse.SecretString!)[JWT_SECRET_KEY];

    // generate jwt token
    const accessToken = jwt.sign({
      user: bodyRequest.receiver
    }, jwtSecretKey, { expiresIn: '1h' });

    response.body = JSON.stringify({
      accessToken
    });

    return response;

  } catch (error) {
    console.error('Error generating temporary jwt:', error);
    throw error;
  }
};

