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

export const signInSchema = object({
    email: string().email().required().min(1).nonNullable(),
    password: string()
        .required()
        .min(1)
        .nonNullable()
});

export const signUpSchema = object({
    // email: string()
    //   .required('Email is required')
    //   .email('Must be a valid email'),
    // phoneNumber: string()
    //   .required('Phone number is required'), // TODO matches(...) for validation if needed
    role: string()
        .required('Role is required')
        .oneOf(['admin', 'customer'], 'Role must be either admin or customer'),
    password: string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
});
