+++
title				= "How to get started with StaticBackend self-hosted version"
publishDate	= "2021-08-04"
slug				= "get-started-self-hosted-version"
vid = "/videos/self-hosting-getting-started.mp4"

metadesc = "This tutorial explains how to get started with the free and open-source self-hosted version of StaticBackend server API."
cardimg = "https://staticbackend.com/img/blog/self-hosted-gs-snip.png"
+++

Let's start by getting the server code to your local development environment.

There are three options to have a running StaticBackend instance:

1. Docker and Docker Compose
2. Pre-built binaries
3. Compiling the source

No matter which way you prefer, you'll need to get the latest source code first.

```shell
$> git clone git@github.com:staticbackendhq/core.git
$> cd core
```

### Docker and Docker Compose

If you already have access to Docker, you may execute the following commands to 
have your backend up and running quickly.

We'll first need to build the Docker image.

There are two options to do this:

1. Using `make`
2. Using Docker

#### Build the image

Before you can run any `make` commands, you'll need to have an environment file 
ready named `.env`.

_You'll need that file even if you're not using the `make` comamnd_

We provide a sample named `.demo.env`, let's use that one which is all set to 
run in local mode:

```shell
$> mv .demo.env .env
```

We can now build the image with `make`:

```shell
$> make docker
```

Or with Docker directly:


```shell
$> docker build . -t staticbackend:latest
```

### Pre-built binaries or compiling the source

Please refer to our 
[self-hosted getting started guide](/getting-started/self-hosting/) for all 
details on how to use pre-built binaries or compiling the source.

### Start everything

The easiest way to run all dependencies and the server itself is by using 
Docker Compose.

We provide two Docker compose files. One that only includes the dependencies 
services. The other is a demo that includes dependencies and the backend 
server.

```shell
$> docker-compose -f docker-compose-demo.yml up
```

If you do not have access to Docker Compose, you'll need MongoDB and Redis 
servers. Inside your `.env` file, configure the proper keys to match your 
server's access points.

### Access your local instance web UI

You should be able to access the web UI via a browser when you navigate to 
[http://localhost:8099](http://localhost:8099).

#### Create your first app

To start using the backend API inside your application, you'll need to create 
an app inside your local StaticBackend instance.

An app has its own database, file storage isolation, and admin portal.

You simply enter an email and click the button. You'll see the email output in 
the terminal that started the Docker Compose or the binary.

You'll need those credentials and tokens in your app to perform any operations.

### Simple JavaScript sample app

Let's create a quick example JavaScript application that uses our self-hosted 
backend instance.

You'll need the following installed to follow along:

1. `npm` or `yarn` installed
2. A text editor

Let's initialize our JavaScript application:

```shell
$> npm init -y
```

#### Installing StaticBackend JavaScript client library

Your JavaScript application needs to install our client-side library to performs 
backend operations.

```shell
$> npm install @staticbackend/js
```

#### Create our demo.ts file

We will only have one file for this sample. Inside the `src` directory, we can 
create our `demo.ts` file with the following code.

```shell
$> mkdir src
$> touch src/demo.ts
```

_Note: `touch` is used here only to show the creation of the file, not required 
you may create this file however you want_.

Here's the code:

```typescript
import {Backend} from "@staticbackend/js"

let bkn = new Backend("YOUR_PUBLICK_KEY_HERE", "dev");
let token = "";

let login = async () => {
  let result = await bkn.login("you@domain.com", "YOUR_ADMIN_PASSWORD");
  if (!result.ok) {
    console.error(result.content)
    return
  }

  token = result.content;

  createTask();
}

let createTask = async () => {
  const task = {
    desc: "my first task",
    done: false
  }

  let result = await bkn.create(token, "tasks", task)
  if (!result.ok) {
    console.error(result.content)
    return
    }

    console.log("created", result.content);
  listTasks();
}

listTasks = async () => {
  let result = await bkn.list(token, "tasks");
  if (!result.ok) {
    console.error(result.content);
    return;
  }

  console.log("list", result.content);
}

window.onload = () => {
  login();
}
```

To reach the correct database, your client-side library needs to know which app 
you're looking for. You achieve this by using the `SB_PUBLIC_KEY` you received 
when you created your application.

```javascript
var bkn = new Backend("Public Key Here", "dev")
```

We're using `"dev"` for the region, which indicates our client-side library to 
target your local instance and not a production one.

We can log in using the credentials we received when we created the app. A valid 
session token is required for each API call. We store that session token into a 
global variable so it's easy to use everywhere.

From there, it's just a matter of using the database operations on behalf of that 
user. We create a document in the `tasks` collection, and we list the documents 
our user account has access to.

#### Building our JavaScript application

We'll be using `esbuild` to build our JavaScript application. It does not 
require any configuration and run fast.

```shell
$> npm install esbuild
```

We create a new build script inside our `package.json` file.

```json
"scripts": {
  "build": "esbuild --bundle --outfile=dist/demo.js src/demo.ts"
  }
```

We build our bundle:

```shell
$> npm run build
```

#### Start our frontend application

We will install a simple HTTP server to serve our application.

```shell
$> npm install http-server
```

And add the script to start the server:

```json
"scripts": {
  "start": "http-server",
  "build": "esbuild --bundle --outfile=dist/demo.js src/demo.ts"
},
```

Let's create a quick `index.html` file that references our bundle.

```html
<html>
<head>
</head>
<body>
  <script src="/dist/demo.js"></script>
</body>
</html>
```

We can finally start our application and look in the developer console for the 
app's output or errors.

It is how you'd get started with the self-hosted version of StaticBackend.