+++
title = "User management"

docsub = "The center of all application"
submenu = "user"
+++

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

Generate and send a reset code by email.

**HTTP request**:

`POST /password/send`

**Format**: JSON

**Body**:

name | type | description
----:|------|-------------
email | `string` | User's email address

**Example**:

```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -X POST \
     -d '{"email": "new@user.com"}' \
     https://na1.staticbackend.com/password/send
```

**Response**:

```json
true
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

```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -X POST \
     -d '{"email": "new@user.com", "code": "1234", "password": "newpw852"}' \
     https://na1.staticbackend.com/password/reset
```

**Response**:

```json
true
```
From here they can login with their new password.