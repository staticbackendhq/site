+++
title			= "Local to production"

gsmenu = "deploy"
+++

### Change the host

You have one thing to remember when you're ready to deploy your application to 
production.

The backend API hostname you were using while developing locally should be 
changed.

```
local: http://localhost:[port]

prod: https://na1.staticbackend.com
```

### Test your application against production

You may also test your application against the production infrastructure 
without deploying your local version.

It useful if you want to make sure your next update will work fine once 
deployed.

You may proxy the local requests to the production infrastructure by starting 
a proxy server:

```bash
backend proxy
```

Your `localhost:[port]` requests will be routed to StaticBackend's production 
environment.