+++
title = "User management"

docsub = "The center of all application"
submenu = "user"
+++

Quick links:

* [Register new user](#register-new-user)
* [Login user](#login-user)
* [Reset password](#reset-password)
* [Send magic link](#send-magic-link)
* [Get current user](#get-current-user)
* [Add user to account](#add-user-to-account)
* [Remove user from account](#remove-user-from-account)
* [List account users](#list-account-users)

Since all requests need to be authenticated, you'll need to get a user token 
for each of your users.

### Authentication token

The user's authentication token will be returned for both `register` and 
`login` endpoints.

It has an expiration of 12 hours.

### Register new user

Allow you to create new users.

**HTTP request**:

`POST /register`

**Format**: JSON

**Body**:

name | type | description
----:|------|-------------
email | `string` | User's email address
password | `string` | User's password

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -X POST \
     -d '{"email": "new@user.com", "password": "userpw"}' \
     https://na1.staticbackend.com/register
```
```javascript
const result = await bkn.register(email, pass);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log("session token", result.content);
```

```go
token, err := backend.Register("email", "password")
fmt.Println("use token for all requests", token)
```

**Response**:

```json
"user's JWT"
```

### Login user

Validate user by email and password to receive their id and session token.

**HTTP request**:

`POST /login`

**Format**: JSON

**Body**:

name | type | description
----:|------|-------------
email | `string` | User's email address
password | `string` | User's password

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -X POST \
     -d '{"email": "new@user.com", "password": "userpw"}' \
     https://na1.staticbackend.com/login
```
```javascript
const result = await bkn.login(email, pass);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log("session token", result.content);
```

```go
token, err := backend.Login("email", "password")
fmt.Println("use token for all requests", token)
```

**Response**:

```json
"user's JWT"
```

In both examples, the user's authentication token we would use for subsequent 
requests would be as follow:

**HTTP header**:

`Authorization: Bearer user's JWT`

This token will be valid for 12 hours.

### Reset password

[With root token](/docs/root-token): Generate and send a reset code by email.

**HTTP request**:

`POST /password/send`

**Format**: JSON

**Body**:

name | type | description
----:|------|-------------
email | `string` | User's email address

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer root-token" \
     -X POST \
     -d '{"email": "new@user.com"}' \
     https://na1.staticbackend.com/password/send
```
```javascript
import { Backend } from "@staticbackend/js";
const bkn = new Backend("public-token", "dev");

const res = await bkn.getPasswordResetCode("user@email.com");
if (!res.ok) {
  alert(res.content);
  return;
}

// res.content contains the reset code you may send by email
```
```go
import (
  "github.com/staticbackendhq/backend-go"
)

func init() {
  backend.PublicKey = os.Getenv("SB_PUB_KEY")
	backend.Region = os.Getenv("SB_REGION")
}

func main() {
  code, err := backend.GetPasswordResetCode(rootToken, email)
  if err != nil {
    log.Fatal(err)
  }
  // code can be sent by email
}
```

**Response**:

```json
"reset code you sent by email"
```

Once the user returns with their unique code, you may request a password reset.

**HTTP request**:

`POST /password/reset`

**Format**: JSON

**Body**:

name | type | description
----:|------|-------------
email | `string` | User's email address
code | `string` | Unique reset password code
password | `string` | User's new password

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -X POST \
     -d '{"email": "new@user.com", "code": "1234", "password": "newpw852"}' \
     https://na1.staticbackend.com/password/reset
```
```javascript
const res = await bkn.resetPassword(email, code, newPass);
```
```go
if err := backend.ResetPassword(email, code, password); err != nil {
  //...
}
```

**Response**:

```json
true
```
From here they can login with their new password.

### Send magic link

Let your users receive a magic link to sign-in without password.

**HTTP request**:

`POST /login/magic`

**Format**: JSON

**Body**:

name | type | description
----:|------|-------------
fromEmail | `string` | Mail will be sent from this email
fromName | `string` | Mail will use this name as display name
email | `string` | User's email
subject | `string` | Mail subject
body | `string` | HTML body of the email. **Requries** a [link] placeholder
link | `string` | Your app link which get calls from their email (with the code appended as query string)

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -X POST \
     -d '{"fromEmail": "my@app.com", "email": "user@email.com", "body": "<p>Click [link]</p>"}' \
     https://na1.staticbackend.com/login/magic
```

```javascript
const data = {
  fromEmail: "my@app.com",
  fromName: "My app name",
  email: "user@email.com",
  subject: "Your sign-in link for Our Awesome App",
  body: "<p>Hello there,</p><p>Click here to sign-in<br />[link]</p>",
  link: "https://ourapp.com/magic-custom-url"
}
const res = await bkn.magicLinkInit(data);
```
```go
data := backend.MagicLinkData{
  FromEmail: "my@app.com",
  FromName: "My app name",
  Email: "user@email.com",
  Subject: "Your sign-in link for Our Awesome App",
  Body: "<p>Hello there,</p><p>Click here to sign-in<br />[link]</p>",
  Link: "https://ourapp.com/magic-custom-url"
}
if err := backend.MagicLinkInit(data); err != nil {
  //...
}
```

**Response**:

The initialization takes the `link` provided and append the following query string 
to it:

https://ourapp.com/magic-custom-url **?code=456789&email=user@email.com**

Once they click the link, you'll be able to get their session token in exchange 
of their email and code.

```json
true
```

### Magic link to session token

Your application custom URL gets called when the user clicks on the link from 
their email. You'll receive two important query string parameters:

1. **code**: Their unique code
2. **email**: Their email

You can now _exchange_ those to get a session token.

**HTTP request**:

GET /login/magic?code=received-code&email=user@email.com`

**Format**: JSON

**Querystring parameters**:

name | type | description
----:|:-----|:------------
code | `string` | The code your app received via the magic link query string 
email | `string` | The email of the user

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     https://na1.staticbackend.com/login/magic?code=123456&email=user@email.com
```

```javascript
const res = await bkn.magicLinkExchange(code, email);
if (!res.ok) {
  console.error(res.content);
  return;
}
sessionToken = res.content;
// they're good to go with their session token
}
```
```go
token, err := backend.MagicLinkExchange(code, email)
if err != nil {
  return err
}
fmt.Println(token)
// they're good to go with their session token
```

**Response**:


```json
"their-session-token-is-return-on-successful-exchange"
```

### Get current user

Sometimes it's useful to get the current user, most often use case is to 
validate their `role` and determine if they are authorized to perform an action.

**HTTP request**:

GET /me

**Format**: JSON

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer session-token-here" \
     https://na1.staticbackend.com/me
```

```javascript
const res = await bkn.me(token);
if (!res.ok) {
  console.log(res.content);
  return;
}
console.log(res.content);
```

```go
cu, err := backend.Me(token)
if err != nil {
  return err
}
fmt.Println(cu)
```

**Response**:

```json
{
  "accountId": "user-acct-id",
  "userId": "user-id",
  "email": "user@email.com",
  "role": 50
}
```

### Add user to account

Add user to an account.

**HTTP request**:

`POST /account/users`

**Format**: JSON

**Body**:

name | type | description
----:|------|-------------
email | `string` | User's email address
password | `string` | User's password

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X POST \
     -d '{"email": "new@user.com", "password": "userpw"}' \
     https://na1.staticbackend.com/account/users
```
```javascript
const result = await bkn.addUser(token, email, pass);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log("user added");
```

```go
if err := backend.AddUser(token, "email", "password"); err != nil {
  // err
}
fmt.Println("new user added")
```

**Response**:

```json
true
```

### Remove user from account

Permanently removes a user from the account.

**HTTP request**:

`DELETE /account/users/{user-id}`

**Format**: JSON


**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X DELETE \
     https://na1.staticbackend.com/account/users/user-id-to-delete
```
```javascript
const result = await bkn.removeUser(token, userId);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log("user removed");
```

```go
if err := backend.RemoveUser(token, "user-id-to-delete"); err != nil {
  // err
}
fmt.Println("user removed")
```

**Response**:

```json
true
```

### List account users

Get a list of all users on the account.

**HTTP request**:

`GET /account/users`

**Format**: JSON


**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X DELETE \
     https://na1.staticbackend.com/account/users
```
```javascript
const result = await bkn.users(token);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content); 
// [{id: "", accountId: "", email: "", role: 50}, ...]
```

```go
users, err := backend.Users(token)
if err != nil {
  // err
}
// users is a slice of users: []backend.CurrentUser
```

**Response**:

```json
true
```