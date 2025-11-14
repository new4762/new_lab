# Setup

```
# create a jwt secret for auth
echo "JWT_SECRET_KEY=$(openssl rand -hex 32)" >> .env

docker compose up
```


# Hoop commands


## Bash into hoop
```bash
docker exec -it hoop-gateway-1 /bin/sh
```

## Docker Tails log
```bash
docker logs hoop-gateway-1 -f

docker logs hoop-agent-1 -f
```

## chek coonection to github inside pod
```bash
hoop admin get runbooks -o json
```
