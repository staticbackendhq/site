+++
title			= "Self hosting"

gsmenu = "selfhost"
+++

### Self hosting our open source backend

We've released StaticBackend as an 
[open source project](https://github.com/staticbackendhq/core) you may self host 
for free.

**Here are the steps you need to do to have a local version working**:

1. [Up and running in 30 seconds with Docker](#up-and-running-in-30-seconds-with-docker)
2. [Use the binaries or clone the repository](#use-the-binaries-or-clone-the-repository)
3. [Configure the necessary environment variables](#configure-the-necessary-environment-variables)
4. [Provide services via docker or natively installed](#provide-services-via-docker-or-natively-installed)
5. [Compile and start the server](#compile-and-start-the-server)
6. [Create an account on your instance](#create-an-account-on-your-instance)


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