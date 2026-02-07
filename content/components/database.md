+++
title = "Database as a service"

comptitle = "Database"
compsub = "A scalable database managed for you."
submenu = "db"
+++

Start storing your app's data immediately—no database setup, no migrations, no configuration. Just save and query your data from your first line of code.

Perfect for AI coding assistants like Claude Code and Cursor. Your assistant can build features while StaticBackend handles the database infrastructure.

### Start saving data in seconds

```javascript
// Save a todo item
const res = await backend.create(authToken, 'todos', {
  title: 'Launch my app',
  completed: false
});
// res.content is the created entity with {id: string, accountId: string} fields.

// Query your data
const res = await backend.query(authToken, 'todos',[
  ["completed", "==", false]
]);
// res.content is {page: 1, size: 25, total: 3, results: Array<T>}
// So res.content.results is an array of your entities.
```

That's it. No database server to install. No schema to define. No connection strings to manage.

### What you can build

- **SaaS applications** - Store user data, settings, and app state
- **Todo apps** - Save tasks, projects, and notes
- **CRM systems** - Manage customers, contacts, and deals
- **Content platforms** - Store articles, posts, and comments
- **Dashboards** - Save analytics, reports, and metrics

### How it works

Data is organized in **collections** (we call them repositories). Think of a collection like a folder for similar items:

- `todos` - All your todo items
- `users` - User profiles and settings
- `projects` - Project data
- `posts` - Blog posts or content

Each item you save is a **document** (like a JSON object). You can create, read, update, and delete documents using simple API calls.

### Built-in features

**Flexible queries** - Find documents using conditions like equals, greater than, contains, and more. No SQL required.

**Smart permissions** - By default, users can read data in their account but only edit their own documents. You can customize this per collection.

**Automatic indexing** - We handle database indexes for you. Your queries stay fast as your data grows.

**Data ownership** - Never locked in. Export your data anytime in standard formats.

### Ready to use from any framework

Works with React, Vue, Svelte, vanilla JavaScript, or any frontend framework. Our REST API also works with Python, Go, or any language.

→ [View database documentation](/docs/database) for detailed API reference and advanced features.

Next component is [file storage](/components/storage).