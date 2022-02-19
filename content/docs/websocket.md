+++
title = "Realtime websocket backend"

docsub = "Powering real-time experience for your web and mobile applications."
submenu = "ws"
+++

Server-Sent Events communication are a key feature for applications needing real-time 
experience like collaborative documents, chat, games, etc. We're offering a 
completely managed channel-based communication infrastructure handling broadcasting  
messages to channels and real-time database update notifications.

### Connection limits

A maximum of concurrent connections is restricted based on your plan. 
You cannot have more active connections than your plan's limit. You receive an 
error if you try to establish a connection that would exceed that number.

### Data format

There's a preset JSON object you need to comply with when sending and receiving 
data. Here are the fields and definitions.

```json
{
  "sid": "unique socket id",
  "type": "one of supported types",
  "data": "a string representing the payload",
  "channel": "if the message target a channel",
  "token": "a special token obtained via auth"
}
```

The supported message types are `echo`, `auth`, `join`, `chan_in`.

You may receive the following types: `ok`, `error`, `init`, `token`, `joined`, `chan_out`, 
`db_created`, `db_updated`, `db_deleted`.

### Establishing a connection

The following steps are required for channel-based communication or for 
real-time database events.

1. Initiating the connection.
2. Authenticating the user.
3. Joining channel(s) to send and receive messages.
4. Subscribing to database events.

### Creating the connection

Use the `connect` function of our JavaScript helper library.

{{< langtabs >}}
```javascript
import { Backend } from "@staticbackend/js"
const bkn = new Backend("your-pub-key", "na1");

const onAuth = (tok) => {
  console.log("ready to use the connection");
}

const onMessage = (payload) => {
  console.log("receiving", payload);
}

bkn.connect("user-session-token", OnAuth, onMessage);
```
```go
// not implemented in server libraries
```
```bash
n/a
```

You can use the `echo` command to test your connection.

{{< langtabs >}}
```javascript
bkn.send(bkn.types.echo, "hello");
```
```go
// not implemented on server-side library
```
```bash
n/a
```

The `onMessage` callback fires and prints this:

```json
{
  "sid":"7eea6625-54c1-11eb-8296-d6c19976ae8a",
  "type":"echo",
  "data":"echo: hello",
  "channel":"",
  "token":""
}
```

### Authenticating the user

At this time, only authenticated users can join a channel and receive database 
events.

You must provide the authenticated user's session token. You receive that token 
after a call to [register or login](/docs/users).

Your `onAuth` callback fires on successful authentication.

{{< langtabs >}}
```javascript
const onAuth = (tok) => {
  // it's safe to use the bkn.send command.
}
```
```go
// not implemented on server-side libraries
```
```bash
n/a
```

If the authentication failed you'll receive this message:

```json
{
  "sid": "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  "type": "error",
  "data": "invalid token",
}
```

### Joining channel(s) to send and receive messages

You have a fully functional bi-directional connection. Your users can join channels 
to send and receive messages to all members of that channel.

It's up to you to have channel names that are hard to guess. There's no way to 
prevent anyone from joining a channel. If you are building a project management 
application, you might have one channel per project for team to discuss. A 
unique name with letters and digits would be a great choice here, say 
`25ti97wIt56swf5210aPo854Uoma`.

{{< langtabs >}}
```javascript
bkn.send(bkn.types.join, "25ti97wIt56swf5210aPo854Uoma");
```
```go
// not implemented on server-side libraries
```
```bash
n/a
```

This is the confirmation message:

```json
{
  "sid": "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  "type": "joined",
  "data": "25ti97wIt56swf5210aPo854Uoma",
}
```

To send message:

{{< langtabs >}}
```javascript
bkn.send(bkn.types.chanIn, "hello all", "25ti97wIt56swf5210aPo854Uoma");
```
```go
// not implemented on server-side libraries
```
```bash
n/a
```

You should specify the type `chanIn` and `channel` parameters to send a message 
to a channel.

A reply with the `type` field's value of `ok` is returned on successful message 
sent.

New messages from channels your user are members of looks like this:


```json
{
  "sid": "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  "type": "chan_out",
  "data": "the message here",  
  "channel": "25ti97wIt56swf5210aPo854Uoma"
}
```

Feel free to use JSON objects inside your message. For instance, if you would 
want to have the name of the sender, the `data` field can be this:

{{< langtabs >}}
```javascript
var payload = {
  name: "dominic",
  message: "hello from Québec",
  sentAt: new Date()
}
bkn.send(bkn.types.chanIn, JSON.stringify(payload), "25ti97wIt56swf5210aPo854Uoma");
```
```go
// not implemented on server-side libraries
```
```bash
n/a
```

*You'd need to `JSON.parse` the data field value when you receive it.*

### Subscribing to database events

The real-time database events are similar to channel communication. In fact, 
we're using channels under the hood.

You must join specially named channels to receive database events. For instance, 
if you have a `tasks_760_` repository and want some users to receive database 
events, you join the channel `db-tasks_760_`.

{{< langtabs >}}
```javascript
bkn.send(bkn.types.join, "db-tasks_760_")
```
```go
// not implemented on server-side libraries
```
```bash
n/a
```

All documents created, updated, and deleted this user has **access to read** will 
be sent as a database update message in that channel. The permissions are 
identical to the database repository permissions. Your users will get database 
events only on the documents they can read.

Let say we have the following users connected:

```json
|- Account A
|---- User A
|---- User B
|-- Account B
|---- User C
```

The two users in account `A` will receive messages about documents created, 
updated, and deleted for that account as the permissions are `_760_`. Owner can 
read, write, and execute. Account users can read and write. Everyone else has no 
access.

The user `C` receive only messages related to their account. Since they are 
alone, they receive only action they are performing and not the events for 
account `A`.

It's not allowed to send messages inside database channels. You'll receive an 
error if you try to do this.

Here are examples of database event messages:

```json
{
  "sid": "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  "type": "db_created",
  "data": "{id: \"123\", name: \"new doc\"}",
  "channel": "db-tasks_760_"
}
```

For creations and updates, the full document is sent. For deletions, only the 
`id` of the deleted document is sent.