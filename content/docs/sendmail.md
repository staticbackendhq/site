+++
title = "Send emails & text messages"

docsub = "All applications need to send an email at one point."
submenu = "email"
+++

You can send an email via StaticBackend's server-side libraries by 
calling one function.

Since v1.3 you may send SMS / text messages from server-side calls using a 
`ROOT_TOKEN`.

### Send email

[Requires a root token](/docs/root-token): Sending email from server-side

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

### Send SMS / text message

[Requires a root token](/docs/root-token): A [Twilio](https://www.twilio.com/) 
account and active phone number is required for this function.

**HTTP request**:

`POST /sudo/sendmail`

**Format**: JSON

**Body**:

name | type | description
----:|:-----|:------------
accountSID | `string` | Twilio AccountSID
authToken  | `string` | Twilio AuthToken
toNumber   | `string` | Destination phone number i.e. +12325554321
fromNumber | `string` | Twilio phone number
bodyy      | `string` | Body of the text message

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer root-token" \
		 -X POST \
		 -d '{"accountSID": "get-this-on-twilio", \ 
		 "authToken": "from-twilio", \
		 "toNumber": "+17975557654", \
		 "fromNumber": "+12325554321", \
		 "body": "Your auth code is: 123456"' \
     https://na1.staticbackend.com/extra/sms
```
```javascript
const data = {
	accountSID: "get-this-from-twilio",
	authToken: "from-twilio",
	toNumber: "+17975557654",
	fromNumber: "+12325554321",
	body: "Your auth code is: 123456",
}
const res = await bkn.sudoSendSMS(rootToken, data);
```
```go
data := backend.SMSData{
	AccountSID: "get-this-from-twilio",
	AuthToken: "from-twilio",
	ToNumber: "+17975557654",
	FromNumber: "+12325554321",
	Body: "Your auth code is: 123456",
}
if err := backend.(	rootToken, data); err != nil {
	// handle error here
}

```

**Response**:

HTTP status > 299 = error