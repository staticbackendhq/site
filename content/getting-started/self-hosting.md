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

### 🐳 Option 1: Docker (Recommended - 5 minutes)

**Best for:** Quick setup, development, production

Uses Docker Compose to run everything with one command. No manual configuration needed.

→ [Jump to Docker setup](#docker-setup)

### 📦 Option 2: Pre-built Binary (10 minutes)

**Best for:** Lightweight deployments, specific OS requirements

Download a ready-to-run binary for Linux, macOS, or Windows. You manage the database separately.

→ [Jump to binary setup](#binary-setup)

### 🛠️ Option 3: Build from Source (15 minutes)

**Best for:** Contributing to the project, custom modifications

Clone the repository and build with Go. Full control and customization.

→ [Jump to source build](#source-build)

---

## Docker Setup

The fastest way to get StaticBackend running. Everything included.

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

The defaults work for development. For production, update `.env` with your settings.

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
docker-compose -f docker-compose-demo.yml up
```

**That's it!** StaticBackend is now running at `http://localhost:8099`

### Step 5: Create your first app

1. Open your browser to [http://localhost:8099](http://localhost:8099)
2. Enter your email and click "Create app"
3. Check the terminal output for your API keys and tokens

**Save these credentials** - you'll need them to connect your app.

### What's included?

The Docker setup includes:
- StaticBackend API server
- PostgreSQL database
- Redis for caching
- All configuration handled automatically

---

## Binary Setup

Download a pre-built binary and run it with your own database.

### Requirements

- PostgreSQL or MongoDB
- Redis
- 10 minutes

### Step 1: Download the binary

Get the latest release for your OS:
[GitHub Releases](https://github.com/staticbackendhq/core/releases)

Available for:
- Linux (amd64, arm64)
- macOS (amd64, arm64)
- Windows (amd64)

### Step 2: Set up services

**Option A: Use Docker for services only**

```bash
# PostgreSQL + Redis
docker-compose up

# Or MongoDB + Redis
docker-compose -f docker-compose-mongo.yml up
```

**Option B: Install natively**

Install PostgreSQL (or MongoDB) and Redis on your system. Refer to their official documentation.

### Step 3: Configure environment variables

Create a `.env` file with your settings:

```bash
APP_ENV=dev
DATABASE_URL=postgresql://user:password@localhost:5432/staticbackend
# Or for MongoDB: mongodb://localhost:27017
DATA_STORE=pg  # or 'mongo' for MongoDB
REDIS_HOST=localhost:6379
REDIS_PASSWORD=your-redis-password
FROM_EMAIL=you@domain.com
FROM_NAME=Your Name
JWT_SECRET=your-secret-key-here
MAIL_PROVIDER=dev  # or 'ses' for AWS SES
STORAGE_PROVIDER=local  # or 's3' for AWS S3
LOCAL_STORAGE_URL=http://localhost:8099
```

### Step 4: Run the server

Make the binary executable (Linux/macOS):

```bash
chmod +x staticbackend
./staticbackend
```

Windows:

```bash
staticbackend.exe
```

StaticBackend is now running at `http://localhost:8099`

### Step 5: Create your app

Follow the same process as Docker setup to create your first app.

---

## Source Build

Build StaticBackend from source for complete control.

### Requirements

- Go 1.16 or later
- Git
- PostgreSQL or MongoDB
- Redis
- 15 minutes

### Step 1: Clone and setup

```bash
git clone https://github.com/staticbackendhq/core.git
cd core
```

### Step 2: Configure environment

Create your `.env` file (see Binary Setup for example).

### Step 3: Start services

Use Docker for services:

```bash
docker-compose up
```

Or install PostgreSQL/MongoDB and Redis natively.

### Step 4: Build and run

With `make` (Linux/macOS):

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
DATABASE_URL=your-production-db-url
# Use AWS SES for emails
MAIL_PROVIDER=ses
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_SES_ENDPOINT=https://email.us-east-1.amazonaws.com
AWS_REGION=us-east-1
# Use S3 for file storage
STORAGE_PROVIDER=s3
AWS_S3_BUCKET=your-bucket-name
AWS_CDN_URL=https://your-cdn-url.com
```

### Security checklist

Before deploying to production:

- ✅ Use strong `JWT_SECRET` (random 32+ characters)
- ✅ Secure your database with password
- ✅ Enable SSL/TLS for HTTPS
- ✅ Set up firewalls and security groups
- ✅ Use production database (not dev mode)
- ✅ Configure backups
- ✅ Set up monitoring and logging

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
3. Restart: `docker-compose restart` or restart the binary

---

## Getting help

- **[GitHub Discussions](https://github.com/staticbackendhq/core/discussions)** - Community support
- **[GitHub Issues](https://github.com/staticbackendhq/core/issues)** - Bug reports and features
- **[Documentation](/docs)** - API reference
- **[Source Code](https://github.com/staticbackendhq/core)** - Read the code

---

**Need simpler setup?** Try [managed hosting](/getting-started/quickstart) - same features, zero DevOps.

**Questions?** Check our [GitHub Discussions](https://github.com/staticbackendhq/core/discussions) or [contact us](/contact).


## Up and running in 30 seconds with Docker

If you already have a working Docker and Docker Compose environment you can be 
up and running with a fully working development mode instance.

Clone or download our [core repository](https://github.com/staticbackendhq/core)

```shell
$> git clone git@github.com:staticbackendhq/core.git
$> cd core
```

Create a `.env` file. You may start from the provided `.demo.env`:

```shell
$> cp .demo.env .env
```

Build the `staticbackend:latest` image.

If you have `make` available

```shell
$> make docker
```

Otherwise

```shell
$> docker build . -t staticbackend:latest
```

Run the backend and all required services via the demo docker-compose file we 
provide:

```shell
$> docker-compose -f docker-compose-demo.yml up
```

Leave the terminal open as you'll need it to grab your app tokens.

1. Open a browser and navigate to [http://localhost:8099](http://localhost:8099).
2. Create your first app by entering your email and click on "Create app" button.
3. Return to the terminal where you started docker-compose and look for the 
output to get all your credentials and tokens.

From there you're fully setup to start building your app.

Check out our [documentation](/docs) and select your desired programming 
language.

## Use the binaries or clone the repository

If you don't have or want to use Docker, here's how you can get started with a 
more manual setup.

You may use the 
[pre-built binaries](https://github.com/staticbackendhq/core/releases) for 
Linux, MacOS and Windows we provide on the release page on our GitHub repo.

You will need to clone or download the code:

```shell
$> git clone git@github.com:staticbackendhq/core.git
$> cd core
```

Either copy the binary in that directory or build the server (see later).


## Configure the necessary environment variables

StaticBackend relies heavily on either PostgreSQL or MongoDB, and Redis. 

Here are the environment variables you'll need.

```
APP_ENV=dev
MAIL_PROVIDER=dev or ses
STORAGE_PROVIDER=local or s3
DATABASE_URL=mongodb://localhost:27017 or user=postgres password=postgres dbname=postgres sslmode=disable
DATA_STORE=mongo or pg
REDIS_HOST=localhost:6379
REDIS_PASSWORD=your-redis-pw
FROM_EMAIL=you@domain.com
FROM_NAME=your-name
JWT_SECRET=something-here
```

If you're going to use the AWS implementation for sending email (`ses`) and file 
storage (`s3`) you'll need those environment variables:

```
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_SECRET_KEY=your-aws-key
AWS_SES_ENDPOINT=https://email.us-east-1.amazonaws.com
AWS_REGION=us-east-1
AWS_S3_BUCKET=your.bucketname.here
AWS_CDN_URL=https://your.cdnurlhere.com
```

The `DATA_STORE` determines if StaticBackend stores its data in PostgreSQL or 
MongoDB. Therefore, the `DATABASE_URL` should match your choice of data 
persistence.

For the `local` file storage you'll need this one:

```
LOCAL_STORAGE_URL=http://your.domain.com
```

Create an `.env` file at the root of the `core` project with the proper values 
for each variables.

## Provide services via docker or natively installed

The simplest way to provides the necessary services (PostgreSQL or MongoDB and 
Redis) is via Docker.

```shell
$> docker-compose up
```

This will start a PostgreSQL and Redis servers.

For MongoDB you may use the proper `docker-compose` file:

```shell
$> docker-compose -f docker-compose-mongo.yml up
```

This will start a MongoDB and Redis servers that are needed by StaticBackend.

_Please note_: The `docker-compose-demo.yml` is used to run all services and 
the backend server. If you're using a binary or compiling the source you 
may use the `docker-compose.yml` file.


You may install and run native PostgreSQL or MongoDB and Redis servers if you 
do not have access to Docker. Please refer to PostgreSQL, MongoDB, and Redis 
own documentation for how to install native servers on your development computer.

## Compile and start the server

If you've downloaded the binary for your OS you don't need to compile the source.

You'll need `Go` 1.16+ installed to compile the `core` project. 
[Refer to this page](https://golang.org/doc/install) to install Go.

If you are running Linux you most certainly have `make` available. Here's how 
to build and start the server locally:

```shell
$> make start
```

This compile and start the server using the `.env` file to setup the proper 
environment variables.

Your StaticBackend instance runs under `http://localhost:8099`

#### Manually compile and start

If you do not have `make` available.

1. Make sure that the environment variables are available in your current terminal session.
2. Compile the server with:

```shell
$> cd cmd && go build -o staticbackend && ./staticbackend
```

_Replace `./staticbackend` for `staticbackend.exe` if you're on Windows._

## Create an account on your instance

To start using your StaticBackend instance you'll need to create an account 
for your app.

The easiest way is:

1. Open a browser and navigate to [http://localhost:8099](http://localhost:8099)
2. Enter your email and click the "Create app" button
3. Return to the terminal where `staticbackend` is running and you'll see all 
your app's credentials and tokens.

You may also use our [CLI](/getting-started/cli).

Please refer to the documentation on how to install the version for your OS.

Once installed, add the following config file to your current directory:

**.backend.yml**:

```yml
region: dev
```

Than execute this command:

```shell
$> backend account create you@domain.com
```

This will create your account, a new database and an admin user with a 
`root token` to execute database request on server-side on behalf of other user.

You may now create your application and have a new `.backend.yml` with the 
created account info inside so any command you issue with the CLI in your 
application directory will be targeting this new account and database.

From there you may start using our client or server libraries with the tokens 
you received.

Refer to the [documentation](/docs) for more information about what 
you can do with your backend.