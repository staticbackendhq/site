+++
title = "Self-Hosting Guide"
gsmenu = "selfhost"
+++

Run StaticBackend on your own infrastructure with full control over your data and deployment.

StaticBackend is [open source](https://github.com/staticbackendhq/core) and free to self-host. You can deploy it on any server, cloud platform, or local machine.

## Why self-host?

**You should self-host if you need:**
- Complete control over data location and compliance
- Custom deployment environments
- Integration with existing infrastructure
- No monthly costs (just your hosting)
- Ability to modify the source code

**Consider managed hosting if you:**
- Want to ship faster without DevOps
- Prefer automatic updates and scaling
- Don't want to manage servers
- [See comparison](/getting-started) for more details

## Choose your setup method

We offer three ways to self-host, from easiest to most customizable:

### Docker (Recommended - 5 minutes)

**Best for:** Quick setup, development, production

Uses Docker Compose to run the API, PostgreSQL, and Redis with one command. No manual configuration needed.

[Jump to Docker setup](#docker-setup)

### Pre-built Binary (10 minutes)

**Best for:** Lightweight deployments, specific OS requirements

Download a ready-to-run binary for Linux, macOS, or Windows. You manage the database and Redis separately.

[Jump to binary setup](#binary-setup)

### Build from Source (15 minutes)

**Best for:** Contributing to the project, custom modifications

Clone the repository and build with Go. Full control and customization.

[Jump to source build](#source-build)

---

## Docker Setup

The fastest way to get StaticBackend running. Everything is included.

### Requirements

- Docker and Docker Compose installed
- 5 minutes

### Step 1: Clone the repository

```bash
git clone https://github.com/staticbackendhq/core.git
cd core
```

### Step 2: Configure environment

Copy the demo environment file:

```bash
cp .demo.env .env
```

The defaults work for local development. For production, update `.env` with your own secrets and service URLs.

### Step 3: Build the image

If you have `make`:

```bash
make docker
```

Otherwise:

```bash
docker build . -t staticbackend:latest
```

### Step 4: Start everything

```bash
docker compose -f docker-compose-demo.yml up
```

If your Docker installation still uses the older Compose command, run:

```bash
docker-compose -f docker-compose-demo.yml up
```

StaticBackend is now running at `http://localhost:8099`.

### Step 5: Create your first app

1. Open your browser to [http://localhost:8099](http://localhost:8099)
2. Enter your email and click "Create app"
3. Check the terminal output for your API keys and tokens

Save these credentials. You'll need them to connect your app.

### What's included?

The Docker setup includes:
- StaticBackend API server
- PostgreSQL database
- Redis for caching and pub/sub
- Local file storage
- Development email output in the terminal

---

## Binary Setup

Download a pre-built binary and run it with your own database and Redis services.

### Requirements

- PostgreSQL, MongoDB, SQLite, or the in-memory development provider
- Redis, unless you use the in-memory development cache
- 10 minutes

### Step 1: Download the binary

Get the latest release for your OS:
[GitHub Releases](https://github.com/staticbackendhq/core/releases)

Available for:
- Linux (amd64)
- macOS (amd64, arm64)
- Windows (amd64)

### Step 2: Set up services

**Option A: Use Docker for services only**

PostgreSQL and Redis:

```bash
docker compose up
```

MongoDB and Redis:

```bash
docker compose -f docker-compose-mongo.yml up
```

Use `docker-compose` instead of `docker compose` if your Docker installation requires it.

**Option B: Install natively**

Install PostgreSQL or MongoDB and Redis on your system. Refer to their official documentation.

### Step 3: Configure environment variables

Create a `.env` file with your settings:

```bash
APP_ENV=dev
APP_SECRET=a-very-long-random-key
APP_URL=http://localhost:8099

# PostgreSQL with the provided docker-compose.yml service
DATABASE_URL=host=localhost user=postgres password=postgres dbname=sb sslmode=disable
DATA_STORE=pg

# Or MongoDB:
# DATABASE_URL=mongodb://localhost:27017
# DATA_STORE=mongo

# Or SQLite:
# DATABASE_URL=dev.db
# DATA_STORE=sqlite

JWT_SECRET=another-long-random-key

# Redis can be configured with REDIS_URL or REDIS_HOST/REDIS_PASSWORD.
REDIS_HOST=localhost:6379
REDIS_PASSWORD=
# REDIS_URL=redis://localhost:6379

MAIL_PROVIDER=dev
FROM_EMAIL=you@domain.com
FROM_NAME=Your Name

STORAGE_PROVIDER=local
LOCAL_STORAGE_URL=http://localhost:8099
```

For a quick local-only process without external services, use the in-memory providers:

```bash
DATABASE_URL=mem
DATA_STORE=mem
REDIS_HOST=mem
```

### Step 4: Run the server

Make the binary executable on Linux or macOS:

```bash
chmod +x staticbackend
./staticbackend
```

Windows:

```bash
staticbackend.exe
```

StaticBackend is now running at `http://localhost:8099`.

### Step 5: Create your app

Follow the same process as Docker setup to create your first app.

---

## Source Build

Build StaticBackend from source for complete control.

### Requirements

- Go 1.25 or later
- Git
- PostgreSQL, MongoDB, SQLite, or the in-memory development provider
- Redis, unless you use the in-memory development cache
- 15 minutes

### Step 1: Clone and setup

```bash
git clone https://github.com/staticbackendhq/core.git
cd core
```

### Step 2: Configure environment

Create your `.env` file. You can start from `.demo.env` for the Docker demo, `.local.env` for local development, or use the Binary Setup example above.

### Step 3: Start services

Use Docker for PostgreSQL and Redis:

```bash
docker compose up
```

Or use Docker for MongoDB and Redis:

```bash
docker compose -f docker-compose-mongo.yml up
```

You may also install PostgreSQL, MongoDB, SQLite, or Redis natively.

### Step 4: Build and run

With `make` on Linux or macOS:

```bash
make start
```

Or manually:

```bash
cd cmd
go build -o staticbackend
./staticbackend
```

Windows:

```bash
cd cmd
go build -o staticbackend.exe
staticbackend.exe
```

---

## Production deployment

### Environment variables for production

Update your `.env` file for production:

```bash
APP_ENV=production
APP_SECRET=your-long-random-app-secret
APP_URL=https://api.yourdomain.com
JWT_SECRET=your-long-random-jwt-secret

DATABASE_URL=your-production-db-url
DATA_STORE=pg

REDIS_URL=redis://user:password@redis-host:6379

MAIL_PROVIDER=ses
FROM_EMAIL=you@domain.com
FROM_NAME=Your Name
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

STORAGE_PROVIDER=s3
S3_ACCESSKEY=your-access-key
S3_SECRETKEY=your-secret-key
S3_ENDPOINT=s3.amazonaws.com
S3_REGION=us-east-1
S3_BUCKET=your-bucket-name
S3_CDN_URL=https://your-cdn-url.com
```

The `ses` mail provider uses the AWS SDK credential chain, so `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are the simplest environment variables for a self-hosted server. StaticBackend also uses `S3_REGION` as the SES region.

For S3-compatible providers such as DigitalOcean Spaces or MinIO, set `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESSKEY`, `S3_SECRETKEY`, and `S3_CDN_URL` for that provider.

### Optional environment variables

```bash
# Use Mailpit instead of terminal-only dev email output.
MAIL_PROVIDER=local
MAILPIT_SMTP_ADDR=localhost:1025
MAILPIT_API_URL=http://localhost:8025

# Put the full-text search index on persistent storage.
FTS_INDEX_FILE=/var/lib/staticbackend/sb.fts

# If you run more than one instance, only the primary runs scheduled jobs.
PRIMARY_INSTANCE_HOSTNAME=server1.yourdomain.com

# Write logs to a file and control console verbosity.
LOG_FILENAME=/var/log/staticbackend.log
LOG_CONSOLE_LEVEL=info

# Load compiled plugins from a specific directory.
PLUGINS_PATH=/opt/staticbackend/plugins
```

### Security checklist

Before deploying to production:

- Use strong, different values for `APP_SECRET` and `JWT_SECRET`
- Secure your database and Redis with passwords and network restrictions
- Enable SSL/TLS for HTTPS
- Set `APP_URL` to the public backend URL
- Use production database and cache services, not the in-memory providers
- Put `FTS_INDEX_FILE` and local uploads on persistent storage if needed
- Configure backups
- Set up monitoring and logging

### Deployment platforms

StaticBackend runs anywhere Go applications run:

- **AWS** - EC2, ECS, or Lambda
- **Google Cloud** - Compute Engine or Cloud Run
- **DigitalOcean** - Droplets or App Platform
- **Heroku** - With database add-ons
- **Your own VPS** - Any Linux server
- **Kubernetes** - For large scale

---

## Managing your self-hosted instance

### Using the CLI

Install the [CLI](/getting-started/cli) to manage your instance:

```bash
npm install -g @staticbackend/cli
```

Create a `.backend.yml` file in your project:

```yaml
region: dev
```

Create an account:

```bash
backend account create your@email.com
```

Manage your database, users, and functions via CLI commands.

### Updating StaticBackend

To update your self-hosted instance:

1. Pull the latest code: `git pull`
2. Rebuild: `docker build . -t staticbackend:latest` or recompile
3. Restart: `docker compose restart` or restart the binary

Use `docker-compose restart` if your Docker installation requires the older command.

---

## Getting help

- **[GitHub Discussions](https://github.com/staticbackendhq/core/discussions)** - Community support
- **[GitHub Issues](https://github.com/staticbackendhq/core/issues)** - Bug reports and features
- **[Documentation](/docs)** - API reference
- **[Source Code](https://github.com/staticbackendhq/core)** - Read the code

Need simpler setup? Try [managed hosting](/getting-started/quickstart) - same features, zero DevOps.
