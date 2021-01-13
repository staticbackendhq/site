+++
title = "Realtime websocket backend"

docsub = "Powering real-time experience for your web and mobile applications."
submenu = "ws"
+++

WebSocket communication is a key feature for applications needing real-time 
experience like collaborative documents, chat, games, etc. We're offering a 
completely managed channel-based communication infrastructure handling standard 
WebSocket and real-time database update notifications.

### Connection limits

A maximum of concurrent WebSocket connections is restricted based on your plan. 
You cannot have more active connections than your plan's limit. You receive an 
error if you try to establish a connection that would exceed that number.

### Data format

There's a preset JSON object you need to comply with when sending and receiving 
data. Here are the fields and definitions.

```javascript
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

The following steps are required for standard WebSocket communication or for 
real-time database events.

1. Creating the connection.
2. Authenticating the user.
3. Joining channel(s) to send and receive messages.
4. Subscribing to database events.

### Creating the connection

StaticBackend returns a unique connection ID on a successful connection. You 
should keep this ID alongside the user's session token.

```javascript
var ws = new WebSocket("wss://na1.staticbackend.com/ws");

ws.onerror = function(e) { 
  console.error("websocket error: ", e);
}

ws.onclose = function() {
  console.log("connection closed");
}

ws.onmessage = function(e) {
  console.log("received message", e);
}
```

The first message looks like this:

```json
{
  "sid":"",
  "type":"init",
  "data":"7eea6625-54c1-11eb-8296-d6c19976ae8a",
  "channel":"",
  "token":""
}
```

You can use the `echo` command to test your connection.

```javascript
var msg = {
  sid: "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  type: "echo",
  data: "hello StaticBackend"
}
ws.send(JSON.stringify(msg));
```

You'll receive a message having `"echo: hello StaticBackend"` as its `data` 
value.

### Authenticating the user

At this time, only authenticated users can join a channel and receive database 
events. Here's how you authenticate your WebSocket conenctions.

```javascript
var msg = {
  sid: "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  type: "auth",
  data: "user-session-token"
}
ws.send(JSON.stringify(msg));
```

You must provide the authenticated user's session token. You receive that token 
after a call to [register or login](/docs/users).

You receive this on successful authentication.

```json
{
  "sid": "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  "type": "token",
  "data": "unique socket token",
}
```

You'll need to provide this WebSocket token on all your message in the `token` 
field.

If the authentication failed you'll receive this message:

```json
{
  "sid": "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  "type": "error",
  "data": "invalid token",
}
```

### Joining channel(s) to send and receive messages

You have a fully functional WebSocket connection. Your users can join channels 
to send and receive messages to all members of that channel.

It's up to you to have channel names that are hard to guess. There's no way to 
prevent anyone from joining a channel. If you are building a project management 
application, you might have one channel per project for team to discuss. A 
unique name with letters and digits would be a great choice here, say 
`25ti97wIt56swf5210aPo854Uoma`.

```javascript
var msg {
  sid: "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  type: "join",
  data: "25ti97wIt56swf5210aPo854Uoma",
  token: "unique socket token"
}
```

The `data` field holds the name of the channel you want them to join. You must 
specify a valid WebSocket `token` to join a channel.

This is the confirmation message:

```json
{
  "sid": "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  "type": "joined",
  "data": "channel-name",
}
```

To send message:

```javascript
var msg = {
  sid: "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  type: "chan_in",
  data: "the message here",  
  token: "unique socket token",
  channel: "25ti97wIt56swf5210aPo854Uoma"
}
ws.send(JSON.stringify(msg));
```

You should specify the `token` and `channel` fields to send a message to a channel.

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
ws.send(JSON.stringify(msg));
```

Feel free to use JSON objects inside your message. For instance, if you would 
want to have the name of the sender, the `data` field can be this:

```javascript
var payload = {
  name: "dominic",
  message: "hello from Québec",
  sentAt: new Date()
}
var msg = {
  sid: "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  type: "chan_in",
  data: JSON.stringify(payload),
  token: "unique socket token",
  channel: "25ti97wIt56swf5210aPo854Uoma"  
}
ws.send(JSON.stringify(msg));
```

*You'd need to `JSON.parse` the data field value when you receive it.*

### Subscribing to database events

The real-time database events are similar to channel communication. In fact, 
we're using channels under the hood.

You must join specially named channels to receive database events. For instance, 
if you have a `tasks_760_` repository and want some users to receive database 
events, you join the channel `db-tasks_760_`.

```javascript
var msg {
  sid: "7eea6625-54c1-11eb-8296-d6c19976ae8a",
  type: "join",
  data: "db-tasks_760_",
  token: "unique socket token"
}
ws.send(JSON.stringify(msg));
```

All documents created, updated, and deleted this user has **access to read** will 
be sent as a database update message in that channel. The permissions are 
identical to the database repository permissions. Your users will get database 
events only on the documents they can read.

Let say we have the following users connected:

```
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
  "data": "{id: "123", name: "new doc"}",
  "channel": "db-tasks_760_"
}
```

For creations and updates, the full document is sent. For deletions, only the 
`id` of the deleted document is sent.