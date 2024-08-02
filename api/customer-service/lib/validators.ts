import { APIGatewayProxyEvent } from "aws-lambda";
import { array, object, string } from "yup";

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

export const createAppointmentSchema = object({
    shopId: string()
        .required("shopId is required")
        .matches(/^\d+$/, "shopId must be a valid number")
        .min(1, "shopId must be at least 1 character long")
        .nonNullable(),
    services: array()
        .of(
            string()
                .required("Service ID is required")
                .matches(/^\d+$/, "Each service ID must be a valid number")
        )
        .min(1, "At least one service must be selected")
        .required("services is required")
        .nonNullable(),
    employeeId: string()
        .required("employeeId is required")
        .min(1, "employeeId must be at least 1 character long")
        .nonNullable(),
    date: string()
        .required("date is required")
        .matches(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format")
        .nonNullable(),
    startAt: string()
        .required("startAt is required")
        .matches(/^\d{2}:\d{2}$/, "startAt must be in HH:MM format")
        .nonNullable(),
    endAt: string()
        .required("endAt is required")
        .matches(/^\d{2}:\d{2}$/, "endAt must be in HH:MM format")
        .nonNullable(),
});