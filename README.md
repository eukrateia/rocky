# MERN MongoDB Auth Starter — Debian 12 + Google Cloud

A ready-to-run full-stack starter template with:

- React + TypeScript + Vite
- Tailwind CSS dark dashboard UI
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT access tokens
- Refresh tokens stored in HTTP-only cookies
- Zod validation
- Protected React routes
- Protected Express routes
- Debian 12 local setup notes
- Google Cloud deployment notes for Compute Engine

---

## Project Structure

```txt
mern-mongo-gcp-debian12-starter/
├── client/
├── server/
├── shared/
├── deploy/
└── README.md
```

---

## Debian 12 Requirements

Install system packages:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential ca-certificates gnupg
```

Install Node.js LTS:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Install MongoDB Community Edition on Debian 12:

```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
```

---

## Local Development

### 1. Configure server env

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_gcp_starter
CLIENT_URL=http://localhost:5173
JWT_SECRET=change_me_access_secret
JWT_REFRESH_SECRET=change_me_refresh_secret
NODE_ENV=development
```

### 2. Run backend

```bash
cd server
npm install
npm run dev
```

### 3. Run frontend

```bash
cd client
npm install
npm run dev
```

Open:

```txt
http://localhost:5173
```

---

## API Routes

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
GET  /api/protected
```

---

## Google Cloud Compute Engine Deployment

This template is designed for a Debian 12 VM on Google Cloud Compute Engine.

### 1. Create a VM

Recommended starting point:

- OS: Debian 12
- Machine: e2-small or e2-medium
- Firewall: allow HTTP/HTTPS

### 2. SSH into VM

```bash
gcloud compute ssh YOUR_VM_NAME --zone YOUR_ZONE
```

### 3. Run server setup script

```bash
chmod +x deploy/debian12-gcp-setup.sh
sudo ./deploy/debian12-gcp-setup.sh
```

### 4. Upload or clone this repo

Example:

```bash
git clone YOUR_REPO_URL /opt/mern-app
cd /opt/mern-app
```

### 5. Backend production setup

```bash
cd /opt/mern-app/server
cp .env.example .env
nano .env
npm install
npm run build
pm2 start dist/server.js --name mern-api
pm2 save
pm2 startup
```

Use production env values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_gcp_starter
CLIENT_URL=https://yourdomain.com
JWT_SECRET=use_a_long_random_secret
JWT_REFRESH_SECRET=use_another_long_random_secret
NODE_ENV=production
```

### 6. Frontend production build

```bash
cd /opt/mern-app/client
npm install
npm run build
sudo mkdir -p /var/www/mern-app
sudo cp -r dist/* /var/www/mern-app/
```

### 7. Apache reverse proxy

Copy Apache config:

```bash
sudo cp /opt/mern-app/deploy/apache-mern-app.conf /etc/apache2/sites-available/mern-app.conf
sudo nano /etc/apache2/sites-available/mern-app.conf
sudo a2ensite mern-app.conf
sudo a2dissite 000-default.conf
sudo systemctl reload apache2
```

### 8. HTTPS with Certbot

```bash
sudo certbot --apache
```

---

## Security Notes

For production:

- Use long random JWT secrets.
- Set `NODE_ENV=production`.
- Use HTTPS.
- Keep refresh tokens in HTTP-only cookies.
- Avoid storing access tokens in localStorage for highly sensitive apps; this starter keeps them in memory and rehydrates from `/me` where possible.
- Add rate limiting before public launch.

---

## Useful Commands

Backend restart:

```bash
pm2 restart mern-api
```

View logs:

```bash
pm2 logs mern-api
```

Mongo shell:

```bash
mongosh
```
