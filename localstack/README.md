# LocalStack with AWS CLI

This project uses [LocalStack](https://localstack.cloud/) to mock AWS services locally. Below are common AWS CLI commands to interact with the S3 service.

## Setup

1. Start LocalStack:
   ```bash
   docker-compose up -d
   ```
2. Confirm LocalStack is running:

```bash
docker ps
```

3. Use the AWS CLI with the LocalStack endpoint:

```bash
aws --endpoint-url=http://localhost:4566 --no-sign-request <service> <command> [parameters]
```
## S3 Commands
```bash

# Create a Bucket
aws --endpoint-url=http://localhost:4566 --no-sign-request s3 mb s3://my-temp-bucket

# Example for core bucket
aws --endpoint-url=http://localhost:4566 --no-sign-request s3 mb s3://omise-core-local

#List Buckets
aws --endpoint-url=http://localhost:4566 --no-sign-request s3 ls

#Upload a File
aws --endpoint-url=http://localhost:4566 --no-sign-request s3 cp myfile.txt s3://my-temp-bucket/

#Download a File
aws --endpoint-url=http://localhost:4566 --no-sign-request s3 cp s3://my-temp-bucket/myfile.txt ./myfile.txt

#Delete a File
aws --endpoint-url=http://localhost:4566 --no-sign-request s3 rm s3://my-temp-bucket/myfile.txt

#Delete a Bucket
aws --endpoint-url=http://localhost:4566 --no-sign-request s3 rb s3://my-temp-bucket --force

```
Notes
- Mock Endpoint: All AWS commands must use the --endpoint-url=http://localhost:4566 parameter to interact with LocalStack.
- Temporary Data: Data is not persisted across container restarts.

## Stopping LocalStack
To stop LocalStack, run:
```bash
docker-compose down
```
