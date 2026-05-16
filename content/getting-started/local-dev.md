+++
title = "Local Development Server"
gsmenu = "local"
+++

Develop your app locally with the CLI development server. No hosted account is required.

The local server is a full StaticBackend BaaS runtime running on your machine. By default it uses the in-memory database and cache providers from the core project, so it is fast to start and easy to reset.

## Quick start

Make sure you have [installed the CLI](/getting-started/cli), then start the local server:

```bash
backend server
```

The local StaticBackend API is now running at `http://localhost:8099`.

In another terminal, create a CLI config file for local development:

```bash
backend login --dev
```

This writes a `.backend.yml` file in the current directory with local development credentials:

```yaml
pubKey: dev_memory_pk
region: dev
rootToken: safe-to-use-in-dev-root-token
email: admin@dev.com
password: devpw1234
authToken: generated-auth-token
```

Add `.backend.yml` to `.gitignore` if it is not already ignored.

## What you can do

With the local development server, you can:

- Build your app without a hosted account
- Test authentication, database CRUD, users, forms, functions, cache, and local file storage
- Use CLI commands against the local server
- Develop without consuming managed hosting quota
- Work offline after the CLI is installed

The local server maps to the same StaticBackend API surface as hosted and self-hosted environments, so your application code can keep the same backend calls when you switch regions.

## Use it from your app

Initialize StaticBackend in your code with the `dev` region:

```javascript
import { Backend } from '@staticbackend/js';

const backend = new Backend('dev_memory_pk', 'dev');
```

The `dev` region points client libraries to `http://localhost:8099`.

Use the built-in local admin user when you need an email and password:

```text
admin@dev.com
devpw1234
```

## Use it from the CLI

Keep the server running in one terminal:

```bash
backend server
```

Use another terminal in the same project directory:

```bash
backend login --dev
backend db create tasks '{"name":"Write docs","done":false}'
backend db list tasks
backend users add user@example.com a-password
```

The CLI reads `.backend.yml` from the current directory by default. Use `--config` if your config file lives somewhere else:

```bash
backend --config ./path/to/.backend.yml db list tasks
```

## Data persistence

### Default: in memory

By default, data is stored in memory and cleared when the server stops:

```bash
backend server
```

This is the fastest mode and is useful for quick tests, demos, and clean development runs.

### Persistent: SQLite

To keep data across restarts, use `--persist-data`:

```bash
backend server --persist-data
```

This switches the local database provider to SQLite and writes to `local.db` in the directory where you started the server. The cache still uses the in-memory development provider.

Use persistent mode when:

- You are building a feature over multiple sessions
- You need realistic seed data
- You are demonstrating an app
- You want to avoid recreating test data after each restart

Delete `local.db` when you want to reset persistent local data.

## Custom port

The server runs on port `8099` by default. Change it if needed:

```bash
backend server -p 8088
```

Update your app to connect to the new port:

```javascript
const backend = new Backend('dev_memory_pk', 'dev', 'http://localhost:8088');
```

For local file uploads, prefer the default `8099` port. The current CLI server still builds local file URLs with `http://localhost:8099`.

## Logging

Use `--no-log` to reduce request and response logging:

```bash
backend server --no-log
```

## Stop the server

Press `Ctrl+C` in the terminal where the server is running.

## Switching to production

When you are ready to deploy:

1. [Create a managed account](/getting-started/quickstart) or [self-host](/getting-started/self-hosting)
2. Get your production public key and root token
3. Run `backend login` to create a production `.backend.yml`
4. Change your app region from `dev` to your hosted region or self-hosted URL

```javascript
// Development
const backend = new Backend('dev_memory_pk', 'dev');

// Managed hosting
const backend = new Backend('your-real-public-key', 'na1');

// Self-hosted
const backend = new Backend('your-real-public-key', 'https://api.yourdomain.com');
```

## Common workflows

### Clean memory run

```bash
backend server
backend login --dev
```

Stop and restart the server to clear all data.

### Persistent local run

```bash
backend server --persist-data
backend login --dev
```

Delete `local.db` to reset data.

### Multiple projects

Each project can run its own dev server on a different port:

```bash
# Project 1
cd ~/projects/app1
backend server -p 8099

# Project 2
cd ~/projects/app2
backend server -p 8088
```

## Next steps

- [See CLI commands](/getting-started/cli)
- [View quickstart](/getting-started/quickstart)
- [Read tutorials](/guides)
- [Join GitHub Discussions](https://github.com/staticbackendhq/core/discussions)
