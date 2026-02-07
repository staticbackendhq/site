+++
title = "Local Development Server"
gsmenu = "local"
+++

Develop your app locally with the CLI development server. No account needed, no setup required—just start building.

## Quick start

Make sure you've [installed the CLI](/getting-started/cli), then run:

```bash
backend server
```

Your local StaticBackend API is now running at `http://localhost:8099`

## What you can do

With the local development server, you can:

- ✅ Build your entire app offline
- ✅ Test authentication, database, and file storage
- ✅ Develop without consuming your managed hosting quota
- ✅ Work on planes, trains, or anywhere without internet

The local server has the **exact same API** as production, so your code works the same everywhere.

## Using with your app

Initialize StaticBackend in your code with the "dev" region:

```javascript
import { Backend } from '@staticbackend/js';

// Use "dev" region for local development
const backend = new Backend('any-pub-key', 'dev');

// The library will automatically connect to localhost:8099
```

The public key can be any value when using the dev server—it's not validated locally.

## Data persistence

### Default: In-Memory (Temporary)

By default, data is stored in memory and **cleared when the server stops**. Perfect for quick tests and experimentation.

```bash
backend server
# Data will be lost on restart
```

### Persistent: SQLite (Recommended for development)

To keep your data across restarts, use the `--persist-data` flag:

```bash
backend server --persist-data
```

This uses SQLite to store data permanently on your local machine. Your development data persists until you manually delete it.

**When to use persistent mode:**
- Building a feature over multiple sessions
- Testing with realistic data
- Demonstrating your app to someone
- Want to avoid re-creating test data

## Custom port

The server runs on port `8099` by default. Change it if needed:

```bash
backend server -p 8088
```

Update your app to connect to the new port:

```javascript
const backend = new Backend('any-pub-key', 'dev', 'http://localhost:8088');
```

## Limitations

The in-memory database has minor limitations:

- `in` and `!in` query operators have reduced functionality
- No file upload persistence (files lost on restart)

**Solution:** Use `--persist-data` mode for full feature parity with production.

## Stop the server

Press `Ctrl+C` in the terminal where the server is running.

## Switching to production

When you're ready to deploy:

1. [Create a managed account](/getting-started/quickstart) or [self-host](/getting-started/self-hosting)
2. Get your production API keys
3. Change the region from `"dev"` to `"na1"` in your code:

```javascript
// Development
const backend = new Backend('any-pub-key', 'dev');

// Production (managed hosting)
const backend = new Backend('your-real-public-key', 'na1');
```

**That's it!** Your app now uses the production backend with zero code changes.

## Common workflows

### Test then deploy

```bash
# 1. Develop locally
backend server --persist-data

# 2. Test your app at http://localhost:3000 (or your dev server)

# 3. When ready, change region to 'na1' and deploy
```

### Multiple projects

Each project can run its own dev server on different ports:

```bash
# Project 1
cd ~/projects/app1
backend server -p 8099

# Project 2 (different terminal)
cd ~/projects/app2
backend server -p 8088
```

## Next steps

- **[View quickstart](/getting-started/quickstart)** - Set up production hosting
- **[Read tutorials](/guides)** - Build real features
- **[See CLI commands](/getting-started/cli)** - Learn more CLI features

---

**Need help?** Join our [GitHub Discussions](https://github.com/staticbackendhq/core/discussions)