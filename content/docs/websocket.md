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

You may receive the following types: `ok`, `error`, `token`, `joined`, `chan_out`, 
`db_created`, `db_updated`, `db_deleted`.

### Establishing a connection

The following steps are required for standard WebSocket communication or for 
real-time database events.

1. Creating the connection.
2. Authenticating the user.
3. Joining channel(s) to send and receive messages.
4. Subscribing to database events.

### Creating the connection



