import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { sendOtpSchema, validateRequest } from "../validators";
import { OtpEntity, SendOtpBodyRequest } from "../interface";
import { QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SendEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const generateOtp = (digitCount: number) => {
    const min = Math.pow(10, digitCount - 1);
    const max = Math.pow(10, digitCount) - 1;
    return Math.floor(min + Math.random() * (max - min + 1));
};

const EMAIL_SENDER = process.env.EMAIL_SENDER!;
const OTP_LIMIT: number = parseInt(process.env.OTP_LIMIT || "3");
const OTP_EXPIRATION: number = parseInt(process.env.OTP_EXPIRATION || "3");
const OTP_TABLE_NAME = process.env.OTP_TABLE_NAME!;
const REGION = process.env.REGION!;

export const sendOtpHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // validate request

    console.info("event: ", event);

    const errorResponse = await validateRequest(sendOtpSchema, event);

    if (errorResponse) {
        return errorResponse;
    }

    // business logic

    const { body } = event;

    const bodyRequest = JSON.parse(body!) as SendOtpBodyRequest;

    const response = {
        headers: {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",  // Allow from anywhere 
            "Content-Type": "application/json",
        },
        statusCode: 204,
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
        }));

        const numberOfOtp: number = dynamoResponse.Items?.length || 0;

        if (numberOfOtp >= OTP_LIMIT) {
            response.statusCode = 403;
            response.body = JSON.stringify({
                errorCode: "TOO_MANY_REQUESTS"
            });
            return response;
        }

        // generete OTP
        const otp = generateOtp(4);
        const createdAt = new Date();
        const createdAtTimestamp = Math.floor(createdAt.getTime() / 1000);

        // persist OTP
        await dynamoDbClient.send(new PutCommand({
            TableName: OTP_TABLE_NAME,
            Item: {
                createdAt: createdAt.toISOString(),
                createdAtTimestamp: createdAtTimestamp,
                expiration: createdAtTimestamp + (OTP_EXPIRATION * 60),
                otp: otp,
                receiver: bodyRequest.receiver
            } as OtpEntity
        }));

        // send otp
        const sesClient = new SESClient({ region: REGION });

        const params = {
            Destination: {
                ToAddresses: [bodyRequest.receiver],
            },
            Message: {
                Body: {
                    Text: { Data: `OTP: ${otp}` },
                },
                Subject: { Data: "Your OTP" },
            },
            Source: EMAIL_SENDER
        };

        await sesClient.send(new SendEmailCommand(params));

        return response;

    } catch (error) {
        console.error('Error sending otp:', error);
        throw error;
    }
}