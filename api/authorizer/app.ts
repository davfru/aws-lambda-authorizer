import { CognitoDecodedJwt, DecodedJwt, Event, OtpDecodedJwt } from './lib/interfaces';
import { JwtVerifier, VerifierRule } from './lib/jwt/jwtVerifier';

export const lambdaHandler = async (event: Event): Promise<any> => {
  console.info("Event: ", event); // TODO logger

  // const { method, resource } = parseArn(event.methodArn);
  const authorization = event.authorizationToken.split(' ')[1];

  const jwtVerifier = new JwtVerifier();
  let decodedPayload = null;

  try {
    decodedPayload = await jwtVerifier.otpJwtVerifier(authorization);
  } catch (e) {
    console.error("otpJwtVerifier fails: ", e);
  }

  if (!decodedPayload) {
    console.info("fall back on cognito jwt verifier");
    try {
      decodedPayload = await jwtVerifier.cognitoJwtVerifier(authorization);
    } catch (e) {
      console.error("cognitoJwtVerifier fails: ", e);
      return generatePolicy("Deny", [event.methodArn]);
    }
  }

  const role = decodedPayload!['custom:role'];

  if (!role) {
    return generatePolicy("Allow", guestAllowedResources, decodedPayload!);
  } else if (role == 'admin') {
    return generatePolicy("Allow", adminAllowedResources, decodedPayload!);
  } else if (role == 'customer') {
    return generatePolicy("Allow", customerAllowedResources, decodedPayload!);
  }

  throw new Error("cannot define allowed resource");

};

const generatePolicy = (effect: "Allow" | "Deny", resources: string[], decodedToken?: DecodedJwt) => {
  const policy: any = {
    policyDocument: {
      Version: "2012-10-17",
      Statement: resources.map(resource => 
        ({
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        }),
      )
    },

  };

  if (decodedToken) {
    policy.context = {
      ...decodedToken
    }
  }

  console.info("generated policy: ", JSON.stringify(policy));

  return policy;
};

// TODO put inside env var
const adminAllowedResources = [
  "arn:aws:execute-api:eu-central-1:*:*/dev/GET/admin/shop/appointments",
  "arn:aws:execute-api:eu-central-1:*:*/dev/POST/admin/shop/appointments",
  "arn:aws:execute-api:eu-central-1:*:*/dev/GET/admin/shop-details",
]

// TODO put inside env var
const guestAllowedResources = ["arn:aws:execute-api:eu-central-1:*:*/dev/POST/auth/sign-up"]

// TODO put inside env var
const customerAllowedResources = [
  "arn:aws:execute-api:eu-central-1:*:*/dev/GET/customers/appointments",
  "arn:aws:execute-api:eu-central-1:*:*/dev/POST/customers/appointments",
]
