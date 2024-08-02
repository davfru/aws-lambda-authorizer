
export const generateResponse = (body: any, statusCode: number) => ({
    headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",  // Allow from anywhere 
        "Content-Type": "application/json",
    },
    statusCode: statusCode,
    body: JSON.stringify(body)
});
