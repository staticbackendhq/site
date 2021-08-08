+++
title = "Documentation"
submenu = "auth"
+++

### Introduction

You may use the language dropdown on the left to see code examples in 
languages we're currently supporting.

The StaticBackend API is accessible via HTTPS requests. Some should use a 
`multipart/form-data` format, and others should use `application/json`.

The URL to access the API is based on the region you selected for your project. 
At this moment we support only a North America region.

All requests need authentication except the login and register endpoints.

```javascript
import { Backend } from "@staticbackend/js";
// use your public key and region ("dev" or "na1" for now)
const bkn = new Backend("public-token", "region");
```

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
```javascript
import { Backend } from "@staticbackend/js";
const bkn = new Backend("any-key-for-dev", "dev");

const authExample = async () => {
  const logres = await bkn.login("a@b.com", "test123");
  if (!logres.ok) {
    console.error(logres.content);
    return;
  }
  // you'd keep this token somewhere easily accenssible
  // for this user (session/local storage for instance).
  const session_token = logres.content;
  const task = {
    name: "task name",
    done: false
  }
  const result = await bkn.create(session_token, "tasks", task);
  if (!result.ok) {
    console.error(result.content);
    return;
  }
  console.log(result.content);
}
```

