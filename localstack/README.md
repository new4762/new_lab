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

## SQS Commands
```bash
# Create a Queue
aws --endpoint-url=http://localhost:4566 --no-sign-request sqs create-queue --queue-name low-priority-work-core-queue

# List Queues
aws --endpoint-url=http://localhost:4566 --no-sign-request sqs list-queues

# Send a Message
aws --endpoint-url=http://localhost:4566 --no-sign-request sqs send-message \
  --queue-url http://localhost:4566/000000000000/low-priority-work-core-queue \
  --message-body '{"test":"job"}'

# Receive Messages
aws --endpoint-url=http://localhost:4566 --no-sign-request sqs receive-message \
  --queue-url http://localhost:4566/000000000000/low-priority-work-core-queue \
  --max-number-of-messages 10

# Delete a Message
aws --endpoint-url=http://localhost:4566 --no-sign-request sqs delete-message \
  --queue-url http://localhost:4566/000000000000/low-priority-work-core-queue \
  --receipt-handle <RECEIPT_HANDLE>

# Purge a Queue (delete all messages)
aws --endpoint-url=http://localhost:4566 --no-sign-request sqs purge-queue \
  --queue-url http://localhost:4566/000000000000/low-priority-work-core-queue
```


## Config for Ruby to connec to local stack

```Ruby

Aws.config.update(
  region: "us-east-1",                          # your desired region
  access_key_id: "brr",                          # your access key
  secret_access_key: "boo",                      # your secret key
  endpoint: "http://localhost:4566",            # optional, for localstack testing
  force_path_style: true,
)

```


Notes
- Mock Endpoint: All AWS commands must use the --endpoint-url=http://localhost:4566 parameter to interact with LocalStack.
- Temporary Data: Data is not persisted across container restarts.

## Stopping LocalStack
To stop LocalStack, run:
```bash
docker-compose down
```
