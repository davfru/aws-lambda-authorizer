import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { generateResponse } from "../response";

export const createAppointmentHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return generateResponse({ message: "Appointment created successfully." }, 201);
};
