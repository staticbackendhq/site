+++
title = "Send email"

docsub = "All applications need to send an email at one point."
submenu = "email"
+++

You can send an email via StaticBackend's server-side libraries by 
calling one function.

### Send email

[Requires a root token]("/docs/root-token"): Sending email from server-side

**HTTP request**:

`POST /sudo/sendmail`

**Format**: JSON

**Body**:

name | type | description
----:|:-----|:------------
fromName | `string` | From name
from | `string` | From email
to | `string` | To email
subject | `string` | Subject of the email
body | `string` | Body of the email (HTML version)
replyTo | `string` | Reply to email

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer root-token" \
		 -X POST \
		 -d '{"from": "a@b.com", "to": "b@a.com", "subject": "hello", \
		 "body": "<h1>hello</h1>", "replyTo": "me@domain.com"}' \
     https://na1.staticbackend.com/sudo/sendmail
```
```javascript
const data = {
	fromName: "Homer Simpson",
	from: "hsimpson@domain.com",
	to: "mrburns@domain.com",
	subject: "I quit",
	body: "<p>I leave my job at the plant</p>",
	replyTo: "flanders@domain.com"
}
const res = await bkn.sendMail(rootToken, data);
```
```go
if err := backend.SendMail(
	rootToken, 
	"from@domain.com", 
	"From Name",
	"to@domain.com",
	"Subject here",
	"<p>body</p>",
	"reply@to.com"); err != nil {
		//...
	}
```
