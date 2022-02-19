+++
title = "Root token from server-side libraries"

docsub = "Sometimes you need all the control."
submenu = "root"
+++

By default, all your requests impersonate your current user, the user that is 
doing the action.

Sometimes when building real-world systems, you'll need, as the system 
engineer, to perform CRUD operations on behalf of your users. For this, you 
use a root token.

Let's take this example that exists for almost all SaaS. You might want to 
purge data for all your account in a background job. With the root token 
version of the Delete database function, you'll be able to delete documents 
without having the owner token from your backend.

When creating a StaticBackend app, you've received a root token. This token 
lets you perform database operations on records you don't own.

Critical commands such as sending emails or generating password reset codes 
require a root token to complete successfully. The backend library you use 
allows you to supply a root token on special functions. Usually, those 
functions have the Sudo prefix.

If a function accepts a root token, it will have the exact same usage as the 
standard one. The only difference in its name and token should be your root 
token. Let's take the GetById database function as an example.

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     https://na1.staticbackend.com/db/tasks/5e185aceb1374eaf8b994bf6
```
```javascript
const id = "5e185aceb1374eaf8b994bf6";
const result = await bkn.getById(session_token, "tasks", id);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
id := "5e185aceb1374eaf8b994bf6";
var task Task
err := backend.GetByID(token, "tasks", id, &task)
fmt.Println(task)
```

While the root token version:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer root-token" \
     https://na1.staticbackend.com/sudodb/tasks/5e185aceb1374eaf8b994bf6
```
```javascript
const id = "5e185aceb1374eaf8b994bf6";
const result = await bkn.sudoGetById(rootToken, "tasks", id);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
id := "5e185aceb1374eaf8b994bf6";
var task Task
err := backend.SudoGetByID(rootToken, "tasks", id, &task)
fmt.Println(task)
```

Those functions are avaialble only from your server-side functions/backend 
using the server-side client library.