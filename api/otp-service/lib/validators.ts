import { APIGatewayProxyEvent } from "aws-lambda";
import { object, string } from "yup";

export const validateRequest = async (schema: any, request: APIGatewayProxyEvent) => {

    try {
        await schema.validate(JSON.parse(request.body || '{}'), { abortEarly: false });
        return null;
    } catch (e: any) { // TODO

        return {
            headers: {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",  // Allow from anywhere 
                "Content-Type": "application/json",
            },
            statusCode: 400,
            body: JSON.stringify({
                errors: Object.values(e.inner.reduce((acc: any, { path, type }: { path: string, type: string }) => {
                    if (!acc[path]) acc[path] = { property: path, messages: [] };
                    acc[path].messages.push(type);
                    return acc;
                }, {}))
            })
        }
    }
}

export const sendOtpSchema = object({
    receiver: string().required().min(1).nonNullable(), // TODO match email or phoneNumber
});

export const verifyOtpSchema = object({
    receiver: string().required().min(1).nonNullable(), // TODO match email or phoneNumber
    otp: string().required().min(1).nonNullable()
});
