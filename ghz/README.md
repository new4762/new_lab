
ghz --config=./config.json -c 40 -n 1000


# grpc.health.v1.Health/Check
``` curl
grpcurl -plaintext -proto proto/health.proto localhost:50051 grpc.health.v1.Health/Check
```
