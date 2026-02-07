+++
title = "Deploying to Production"
gsmenu = "deploy"
+++

Ready to deploy your app? Here's how to go from local development to production.

## The one thing you must change

When moving from development to production, **change your region** from `"dev"` to `"na1"`:

```javascript
// ❌ Development
const backend = new Backend('any-key', 'dev');

// ✅ Production (managed hosting)
const backend = new Backend('your-real-public-key', 'na1');

// ✅ Production (self-hosted)
const backend = new Backend('your-real-public-key', 'https://your-domain.com');
```

That's it! The StaticBackend client library handles everything else.

## Deployment checklist

Before deploying, make sure you:

### 1. Use production API keys

- ✅ Replace `"dev"` with `"na1"` (or your self-hosted URL)
- ✅ Use your **real public key** from your StaticBackend account
- ✅ Never commit your **root token** to version control

### 2. Secure your keys

**Environment variables** (recommended):

```javascript
// Use environment variables in your build
const backend = new Backend(
  process.env.STATICBACKEND_PUBLIC_KEY,
  'na1'
);
```

Add to your `.env` file (never commit this!):

```bash
STATICBACKEND_PUBLIC_KEY=your-real-public-key-here
```

### 3. Update your build configuration

Different platforms handle environment variables differently:

**Vercel:**
```bash
# Add to Vercel project settings
STATICBACKEND_PUBLIC_KEY=your-key
```

**Netlify:**
```bash
# Add to Netlify site settings
STATICBACKEND_PUBLIC_KEY=your-key
```

**GitHub Actions:**
```yaml
env:
  STATICBACKEND_PUBLIC_KEY: ${{ secrets.STATICBACKEND_PUBLIC_KEY }}
```

## Deployment platforms

Your frontend can be deployed anywhere. Here are popular options:

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard under Settings → Environment Variables.

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Add environment variables in Netlify dashboard under Site Settings → Environment Variables.

### GitHub Pages

Perfect for static sites:

```bash
npm run build
# Push the build folder to gh-pages branch
```

Note: Environment variables must be set at build time for static sites.

### Your own server

Upload your built files via FTP, SFTP, or use a deploy script:

```bash
npm run build
scp -r dist/ user@yourserver.com:/var/www/html/
```

### Docker

Create a `Dockerfile` for your frontend:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG STATICBACKEND_PUBLIC_KEY
ENV STATICBACKEND_PUBLIC_KEY=$STATICBACKEND_PUBLIC_KEY
RUN npm run build
CMD ["npm", "start"]
```

Build and deploy:

```bash
docker build --build-arg STATICBACKEND_PUBLIC_KEY=your-key -t myapp .
docker run -p 3000:3000 myapp
```

## Testing before deployment

### Test against production from local

The CLI provides a proxy to test your local app against production:

```bash
backend proxy
```

This routes `localhost:8099` requests to StaticBackend's production API.

**Use this to:**
- Test your app against production before deploying
- Verify your production account works correctly
- Debug issues in a production-like environment

**Important:** Stop your local dev server first (`backend server`) before starting the proxy.

### Staging environment

For larger projects, consider a staging deployment:

1. Create a separate StaticBackend account for staging
2. Deploy your app to a staging URL
3. Test thoroughly
4. Deploy to production when ready

## Common deployment issues

### "Invalid public key" error

**Problem:** Using development settings in production

**Solution:** Make sure you changed `"dev"` to `"na1"` and are using your real public key.

### Environment variables not working

**Problem:** Variables not loaded at build time

**Solution:** Check your platform's documentation. Most static site generators need variables at **build time**, not runtime.

### CORS errors

**Problem:** Frontend domain not configured

**Solution:** StaticBackend allows requests from any origin by default. Check your browser console for the actual error.

### Authentication failing in production

**Problem:** Using wrong region or keys

**Solution:** Verify you're using production keys and the correct region (`"na1"`).

## Production best practices

### Use environment variables

Never hardcode keys in your source code:

```javascript
// ❌ Don't do this
const backend = new Backend('pk_1234567890abcdef', 'na1');

// ✅ Do this
const backend = new Backend(process.env.STATICBACKEND_PUBLIC_KEY, 'na1');
```

### Keep root token secret

Your **root token** is for server-side operations only:
- ✅ Use in server-side code (API routes, serverless functions)
- ✅ Store in environment variables
- ❌ Never expose in client-side code
- ❌ Never commit to git

### Monitor your app

Use your StaticBackend dashboard to:
- Monitor API usage and errors
- Check database size and query performance
- View active user sessions
- Track file storage usage

### Set up error tracking

Add error tracking to catch production issues:

```javascript
const result = await backend.create(token, 'todos', data);

if (!result.ok) {
  // Log to your error tracking service
  console.error('Failed to create todo:', result.content);
  // Show user-friendly error
  alert('Something went wrong. Please try again.');
}
```

## Deploying updates

When updating your deployed app:

1. **Test locally first** with `backend server`
2. **Test against production** with `backend proxy`
3. **Deploy to staging** if you have one
4. **Deploy to production**
5. **Monitor for errors** in the first few minutes

## Self-hosted backend deployment

If you're self-hosting StaticBackend, see our [self-hosting guide](/getting-started/self-hosting) for deployment details.

Key differences:
- Use your domain instead of `"na1"`
- Set up SSL/TLS certificates
- Configure environment variables on your server
- Set up monitoring and backups

## Next steps

- **[View CLI reference](/getting-started/cli)** - Advanced CLI features
- **[Read the docs](/docs)** - Complete API reference
- **[Join discussions](https://github.com/staticbackendhq/core/discussions)** - Get help from the community

---

**Questions about deployment?** Ask in our [GitHub Discussions](https://github.com/staticbackendhq/core/discussions)