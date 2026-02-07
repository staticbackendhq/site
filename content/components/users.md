+++
title = "User management"

comptitle = "User management"
compsub = "Everything you need to manage your users"
submenu = "user"
+++

Add user authentication to your app in minutes. Sign-up, login, and password reset work immediately—no auth code to write, no security concerns to manage.

Your AI coding assistant can focus on building features while StaticBackend handles all the authentication complexity.

### Authentication in 3 lines of code

```javascript
// Register a new user and get an auth token
const res = await backend.register('user@example.com', 'password');
// res.content is the auth token

// Login returns a session token
const res = await backend.login('user@example.com', 'password');
// res.content is the auth token

// Password reset - email sent automatically
await backend.sendPasswordReset('user@example.com');
```

Everything just works. No email services to configure. No password hashing libraries. No session management complexity.

### What you can build

- **SaaS applications** - Multi-user accounts with teams and roles
- **Membership sites** - Gated content for registered users
- **Social apps** - User profiles, followers, and interactions
- **Marketplaces** - Buyers and sellers with separate permissions
- **Internal tools** - Team collaboration with role-based access

### Multiple authentication methods

**Email & Password** - The standard approach. Secure password hashing handled automatically.

**Magic Links** - Passwordless login via email link. Perfect for improving conversion.

**OAuth Providers** - Google, GitHub, and other social logins. Easy integration without managing OAuth flows.

### Team & organization support

Built-in support for multi-user accounts. Perfect for B2B SaaS applications:

- **Organizations** - Group users into accounts (e.g., "Acme Corp")
- **Multiple users per account** - Teams can collaborate and share data
- **Role-based permissions** - Control who can read, edit, or delete data

For single-user apps (like a todo app), each user automatically gets their own account. It works for both use cases.

### How it works

When users log in, they receive a **session token**. Include this token in your API calls and StaticBackend automatically:

- Identifies who's making the request
- Enforces permissions and data ownership
- Tracks which account the user belongs to

Your frontend stores the token (in localStorage or session storage), and every request is automatically authenticated.

### Security built-in

- Passwords hashed with bcrypt
- Session tokens are secure and expiring
- Password reset flows handled safely
- Email verification available
- Protection against common attacks

→ [View user management documentation](/docs/users) for detailed API reference and advanced features.

Next component is our [database](/components/database).