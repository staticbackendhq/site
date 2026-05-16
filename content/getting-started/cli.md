+++
title = "Install our CLI"
gsmenu = "cli"
+++

## StaticBackend CLI {{< param cliversion >}}

The StaticBackend CLI is the main tool for local development and terminal-based backend management.

It can:

- Run the local development server
- Create a local `.backend.yml` file for development
- Manage database documents, users, forms, and server-side functions
- Manage account and billing commands for hosted environments
- Proxy local requests to a hosted backend when you want to test against production

## Installation

### Via NPM

Install the CLI globally with `npm`:

```shell
npm install -g @staticbackend/cli
```

Check that it installed correctly:

```shell
backend --version
backend --help
```

The npm package downloads the matching binary from the [GitHub release page](https://github.com/staticbackendhq/cli/releases) during installation.

### Manual installation

You may also download the CLI binary directly from the [GitHub release page](https://github.com/staticbackendhq/cli/releases).

Release assets follow this naming pattern:

```text
linux-amd64-backend
linux-arm64-backend
linux-386-backend
linux-arm-backend
darwin-amd64-backend
darwin-arm64-backend
windows-amd64-backend.exe
windows-386-backend.exe
freebsd-amd64-backend
```

For example, on Linux amd64:

```bash
curl -L -o backend \
https://github.com/staticbackendhq/cli/releases/download/{{< param cliversion >}}/linux-amd64-backend
chmod +x backend
./backend --help
```

To make `backend` available from any directory, move it to a directory in your `PATH`:

```bash
sudo mv backend /usr/local/bin/backend
```

For macOS, replace `linux` with `darwin`. For Windows, download the `windows-*-backend.exe` asset.

## Local development

Start the local StaticBackend server:

```shell
backend server
```

The development server runs at `http://localhost:8099` by default.

In another terminal, create a local development config file:

```shell
backend login --dev
```

This writes `.backend.yml` in the current directory with the local development credentials:

```yml
pubKey: dev_memory_pk
region: dev
rootToken: safe-to-use-in-dev-root-token
email: admin@dev.com
password: devpw1234
authToken: generated-auth-token
```

Keep `.backend.yml` out of version control. It can contain root tokens for local, hosted, or self-hosted backends.

## Common commands

Run `backend --help` to see the top-level command list.

```shell
backend --help
```

Useful command groups:

```shell
backend server --help
backend login --help
backend db --help
backend users --help
backend function --help
backend form --help
backend proxy --help
backend account --help
```

Create and list local database documents after `backend server` and `backend login --dev` are running:

```shell
backend db create tasks '{"name":"task 1","done":false}'
backend db list tasks
```

Create an application user:

```shell
backend users add user@example.com a-password
```

## Configuration file

The CLI reads `.backend.yml` from the current directory by default. You can pass a different file with `--config`:

```shell
backend --config ./path/to/.backend.yml db list tasks
```

For hosted or self-hosted backends, run:

```shell
backend login
```

The command prompts for:

- Public key
- Host URL or region
- Root token
- Email
- Password

The resulting `.backend.yml` has the same shape as the local development file.

## Hosted account commands

Create a hosted account when you are ready to use managed hosting:

```shell
backend account create your-email@example.com
```

The command returns a billing setup link. Your account unlocks after you add a payment method.

## Production proxy

If your app is configured for the local development URL but you want requests to reach a hosted backend, use the proxy command:

```shell
backend proxy
```

The proxy listens on `http://localhost:8099` by default and forwards requests to the region configured in `.backend.yml`.

## More local development

See [Local Development Server](/getting-started/local-dev) for the full local memory BaaS workflow.
