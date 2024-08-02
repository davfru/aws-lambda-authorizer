import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { generateResponse } from "../response";

export const listAppointmentHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.info("event: ", event);

    return generateResponse({
        appointements: [{
            id: 1,
            date: "2024-06-10",
            shop: "Barber Shop XYZ"
        }, {
            id: 2,
            date: "2024-07-10",
            shop: "Barber Shop XYZ"
        }], nextCursor: 123
    }, 200);
};
