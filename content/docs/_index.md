+++
title			= "Documentation"

submenu = "auth"
+++

### Introduction

The StaticBackend API is accessible via HTTPS requests. Some should use a 
`multipart/form-data` format, and others should use `application/json`.

The URL to access the API is based on the region you selected for your project. 
At this moment we support only a North America region.

All requests need authentication except the login and register endpoints.

### Authentication

To authenticate a request you need to pass two HTTP headers.

**SB-PUBLIC-KEY**: Your StaticBackend public key. Find it in your project's settings page.

**Authorization**: The current user's autentication token obtained via a login or 
register call. Use the `Bearer` type, like this:

`Authorization: Bearer your-token-here`

### Example request

Here's an example of an authenticated request that adds a document to a Tasks 
repository.

```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X POST \
     -d '{"name": "task name", "done": false}' \
     https://na1.staticbackend.com/db/tasks
```

