#!/usr/bin/env bash
set -euo pipefail

apt update && apt upgrade -y
apt install -y curl git build-essential ca-certificates gnupg apache2 certbot python3-certbot-apache

curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs
npm install -g pm2

curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
cat > /etc/apt/sources.list.d/mongodb-org-7.0.list <<'EOF'
deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main
EOF
apt update
apt install -y mongodb-org
systemctl enable mongod
systemctl start mongod

a2enmod proxy proxy_http rewrite headers ssl
systemctl restart apache2

echo "Debian 12 Google Cloud MERN dependencies installed."
