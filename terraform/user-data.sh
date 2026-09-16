#!/bin/bash
set -e

dnf update -y
dnf install -y docker
systemctl enable --now docker

curl -SL https://github.com/docker/compose/releases/download/v2.32.1/docker-compose-linux-x86_64 \
  -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

aws ecr get-login-password --region ${aws_region} \
  | docker login --username AWS --password-stdin ${account_id}.dkr.ecr.${aws_region}.amazonaws.com

mkdir -p /opt/app
cat > /opt/app/docker-compose.yml <<'COMPOSE'
services:
  api:
    image: ACCOUNT.dkr.ecr.REGION.amazonaws.com/PROJECT-api:latest
    restart: always
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://DBHOST:3306/DBNAME
      SPRING_DATASOURCE_USERNAME: DBUSER
      SPRING_DATASOURCE_PASSWORD: DBPASS

  client:
    image: ACCOUNT.dkr.ecr.REGION.amazonaws.com/PROJECT-client:latest
    restart: always
    ports:
      - "80:80"
    depends_on:
      - api
COMPOSE

sed -i "s|ACCOUNT|${account_id}|g; s|REGION|${aws_region}|g; s|PROJECT|${project_name}|g; s|DBHOST|${db_host}|g; s|DBNAME|${db_name}|g; s|DBUSER|${db_username}|g; s|DBPASS|${db_password}|g" /opt/app/docker-compose.yml

cd /opt/app
docker-compose up -d