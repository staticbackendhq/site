+++
title			= "Install our CLI"

gsmenu = "cli"
+++

### StaticBackend CLI {{< param cliversion >}}

We've created a CLI (command-line interface) which offers the following 
functionalities.

* A local development server.
* Managing your backend resources.
* Managing your account.


### Installation

#### Via NPM

You may install the CLI globally via `npm`:

```shell
$> npm install -g @staticbackend/cli
```

#### Manual installation

You may download the latest version from the 
[GitHub release page](https://github.com/staticbackendhq/cli/releases).

There's a binary version for Linux, MacOS and Windows for 64 bit 
architecture. If you're looking for a 32-bit build, please build from source.

You can also download it via a `curl` call:

```bash
$ curl -L -o backend.gz \
https://github.com/staticbackendhq/cli/releases/download/{{< param cliversion >}}/linux-amd64-backend.gz
```

Replace `linux` with `darwin` or `windows` in the URL above. For Windows add 
`.exe` before `.gz` example: `windows-amd64-backend.exe.gz`.

The downloaded file is compressed to make it faster to download.

This next command decompresses it, replacing `backend.gz` with `backend`.

```bash
gunzip backend.gz

or

gzip -d backend.gz
```

Every file has "permissions" about whether it can be read, written, or executed.

So before we use this file, we need to mark this file as executable:

```bash
chmod +x backend
```

The `backend` file is now executable. That means running `./backend --help`
should work.

But we want to be able to say `backend --help` without specifying the full file
path every time. We can do this by moving the `backend` binary to one of the
directories listed in your `PATH` environment variable:

```bash
sudo mv backend /usr/local/bin
```

### Usage

You may run `backend` to see the usage. 

You can start building your application locally using the `server` command.

```shell
$> backend server
```

### Create your account

Create your account once you're ready to test the production environment.

```shell
$> backend account create "your-email@here.com"
```

You'll get a link to enter a credit card to start your trial and get an 
email with the keys needed in the configuration file.

### Configuration file

You need a `.backend.yml` configuration file at the root of your project:

```yml
region: na1
pubKey: your-public-key
rootToken: your-root-token
```

At this time we only support `na1` as region. The public key and your root token 
will be sent by email when you create your account.

### Managing your resources

Once your configuration file is setup you can execute command like:

```shell
$> backend db list "repository-name"
```


Make sure to check the available commands via:

```shell
$> backend --help
$> backend db --help
```

We are actively working on this tool to make sure you have the best experience 
possible building and managing your applications.

Any feedback is highly appreciated.