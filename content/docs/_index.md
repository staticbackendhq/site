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

_For self-hosted version you can specify the URL of your instance in the 
`region` parameter._

All requests need authentication except the login and register endpoints.

The `region` can be:

* **na1**: The North America production managed service
* **dev**: Use the default localhost:8099 (used if you're using the Docker instance)
* **https:/your.domain.com**: For self-hosted, you can specify your own URL.

{{< langtabs >}}
```javascript
import { Backend } from "@staticbackend/js";
// use your public key and region ("dev" or "na1" for now)
const bkn = new Backend("public-token", "region");
```
```go
import (
  "github.com/staticbackendhq/backend-go"
)

func init() {
  backend.PublicKey = os.Getenv("SB_PUB_KEY")
	backend.Region = os.Getenv("SB_REGION")
}
```
```bash
nothing to display
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

{{< langtabs >}}
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
```go
package main
import (
  "github.com/staticbackendhq/backend-go"
)

func init() {
  backend.PublicKey = os.Getenv("SB_PUB_KEY")
  backend.Region = "dev"
}

type Task struct {
  ID string `json:"id"`
  AccountID string `json:"accountId"`
  Name string `json:"name"`
  Done bool `json:"done"`
}

func main() {
  // create a new user account
  token, err := backend.Login("a@b.com", "my_pass")
  if err != nil {
    log.Fatal(err)
  }

  // our token can be used on all requests.
  task := Task{Name: "first task", Done: false}
  if err := backend.Create(token, "tasks", task, &task); err != nil {
    log.Fatal(err)
  }

  // task now has ID and AccountID filled with proper value

  var byIdTask Task
  if err := backend.GetByID(token, "tasks", task.ID, &byIdTask); err != nil {
    ...
  }

  // task and byIdTask are identical
}
```