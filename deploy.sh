#!/bin/bash

if [ -z "$1" ]; then
    # use "dev" as fallback
    ENV="dev"
else
    ENV="$1"
fi

echo "Deploying on: $ENV env"
export AWS_PROFILE=default

# rm -r .aws-sam

# 2. releasing on AWS
sam build
sam deploy --config-env $ENV

# 3. updating secrets (because after each deploy the secret are cleaned)
secret_name="Secrets"
secrets_file="./api/.secrets/$ENV/secrets.json"
jwt_private_key=$(jq -r '.jwtPrivateKey' "$secrets_file")

aws secretsmanager update-secret \
--secret-id "$secret_name" \
--secret-string '{"jwtPrivateKey":"'"$jwt_private_key"'"}'