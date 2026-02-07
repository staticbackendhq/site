+++
title = "Hosted WebSockets with channels"

comptitle = "WebSocket with channels"
compsub = "Connect your users and build collaborative live applications."
submenu = "ws"
+++

Add real-time features to your app instantly. Build live chat, collaborative editing, real-time notifications, or multiplayer games—no WebSocket servers to manage.

Your app automatically reacts to database changes in real-time. Users see updates immediately without refreshing.

### Real-time in a few lines

```javascript
// Connect to real-time updates
const ws = await backend.connect();

// Join a channel
ws.join('project-chat');

// Send a message to everyone in the channel
ws.send('project-chat', {
  text: 'Hello team!'
});

// Receive messages
ws.onMessage((data) => {
  console.log('New message:', data);
});
```

No server infrastructure. No WebSocket configuration. Just add real-time features and ship.

### What you can build

- **Live chat** - Team messaging, customer support, community discussions
- **Collaborative editing** - Documents, whiteboards, design tools
- **Real-time dashboards** - Live analytics, monitoring, metrics
- **Notifications** - Instant alerts, activity feeds, status updates
- **Multiplayer games** - Turn-based games, leaderboards, live scores
- **Live cursors** - See where teammates are working in real-time

### Two types of real-time

**1. Custom channels** - For chat, notifications, and custom data:

```javascript
// Create a channel
ws.join('support-chat-123');

// Send and receive messages
ws.send('support-chat-123', { user: 'John', message: 'Need help' });
```

**2. Database updates** - Automatic real-time updates when data changes:

```javascript
// Listen to database changes
ws.join('db_todos_created');  // New todos
ws.join('db_todos_updated');  // Todo updates

// UI updates automatically when anyone creates/updates a todo
ws.onMessage((data) => {
  updateUI(data);  // Refresh your todo list
});
```

Every database collection automatically has real-time channels. Your app can react to changes instantly.

### How it works

**Channels** are like chat rooms. Users join channels to send and receive messages:

- Join a channel: `ws.join('channel-name')`
- Send to everyone in the channel: `ws.send('channel-name', data)`
- Receive messages: `ws.onMessage(callback)`

Permissions work like your database—users can only join channels they have access to.

### Real-world example: Team chat

Here's how you'd build a project chat feature:

1. User opens a project page
2. App joins the project's chat channel: `ws.join('project-' + projectId)`
3. User sends a message: `ws.send('project-123', { text: 'Update ready' })`
4. All team members on that project receive it instantly
5. Optionally, save message to database for history

The real-time data doesn't have to be saved—perfect for live cursors, typing indicators, or presence ("John is online").

### No infrastructure to manage

- ✅ WebSocket servers hosted for you
- ✅ Automatic scaling as users connect
- ✅ Reconnection handling built-in
- ✅ Works with standard WebSocket API
- ✅ Compatible with Socket.io patterns

Your only concern is your plan's concurrent connection limit. Everything else is handled.

→ [View WebSocket documentation](/docs/websocket) for detailed API reference and advanced features.

Next component is [server-side functions](/components/functions).