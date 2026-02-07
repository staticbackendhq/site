+++
title = "Server-side functions & event messages"

comptitle = "Functions & messages"
compsub = "Create server-side functions. Publish and react to event messages."
submenu = "fn"
+++

Automate tasks and handle backend logic without managing servers. Schedule daily jobs, react to events, and extend your app with server-side code.

Perfect for trial expirations, email reminders, data processing, and workflows that need to run on a schedule or in response to events.

### Run code on a schedule

```javascript
// This function runs every day at 9 AM
function handleTrialExpiration() {
  // Find users whose trial expires today
  const users = backend.query('users', {
    trialEndsAt: { $lte: new Date() },
    isPaid: false
  });

  // Send reminder emails
  users.forEach(user => {
    backend.sendEmail(user.email, 'Your trial is ending');
  });
}
```

Create the schedule in your dashboard: "Daily at 9 AM" or complex patterns like "First Monday of each month at 9 AM."

### What you can automate

- **Trial management** - Expire trials, send reminders, downgrade accounts
- **Email campaigns** - Onboarding sequences, newsletters, notifications
- **Data cleanup** - Delete old records, archive inactive users
- **Report generation** - Daily summaries, analytics, exports
- **Webhooks** - Call external APIs on schedule or events
- **Data sync** - Import/export data from other services

### Three ways to run code

**1. Scheduled tasks** - Run functions at specific times:

```javascript
// Runs every hour
function cleanupSessions() {
  // Delete expired sessions
}

// Runs every Monday at 8 AM
function sendWeeklyReport() {
  // Generate and email report
}
```

**2. Event triggers** - React to system events:

```javascript
// Runs when a user registers
function onUserRegistered(event) {
  // Send welcome email
  backend.sendEmail(event.user.email, 'Welcome!');
}

// Runs when data is created
function onDocumentCreated(event) {
  // Log activity, notify team, etc.
}
```

**3. Manual execution** - Call functions from your frontend:

```javascript
// From your app
await backend.executeFunction('processData', { id: 123 });
```

### How it works

Write functions in JavaScript and deploy them via the CLI or dashboard. Functions run in a secure, sandboxed environment.

You have access to:
- Database operations (create, query, update, delete)
- Email sending
- HTTP requests to external APIs
- Date/time utilities
- Custom helper functions

**Note:** Functions run in a custom JavaScript runtime (ES5 compatible), not Node.js. Most standard JavaScript works, but some Node-specific features aren't available.

### Event system

Subscribe to system events or publish your own:

**System events:**
- `user_registered` - New user signs up
- `user_login` - User logs in
- `doc_created` - Document created in database
- `doc_updated` - Document updated
- `chan_in` - Message sent in WebSocket channel

**Custom events:**
You can publish your own events and create functions to handle them:

```javascript
// Publish from your app
await backend.publishEvent('order_placed', { orderId: 123 });

// Handle in a server function
function onOrderPlaced(event) {
  // Process order, send confirmation, update inventory
}
```

### Real-world example: Chat history

Save chat messages to your database automatically:

```javascript
// This function triggers when a message is sent in any channel
function onChatMessage(event) {
  backend.create('chat_history', {
    channel: event.channel,
    user: event.user,
    message: event.message,
    timestamp: new Date()
  });
}
```

Now your real-time chat has permanent history without any frontend code changes.

### Deploy and manage

**Via CLI:**
```bash
# Create a new function
backend functions create trial-reminder.js

# Update existing function
backend functions update trial-reminder

# View logs
backend functions logs trial-reminder
```

**Via Dashboard:**
Create and edit functions directly in your web dashboard. Test them before deploying.

→ [View functions documentation](/docs/functions) for detailed API reference and available helper functions.

Next component is [helper functions](/components/helper-functions).