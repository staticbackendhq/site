+++
title = "Build a Todo App"
docsub = "Complete tutorial: authentication, database, and real-time updates"
submenu = "todo"
+++

Build a complete todo list application from scratch. This tutorial covers authentication, database operations, and shows how easy it is to create a functional app with StaticBackend.

**What you'll learn:**
- User registration and login
- Creating and storing data
- Updating documents
- Loading and displaying data

**What you'll build:**
A working todo app where users can:
- Create an account
- Add todos
- Mark todos as complete
- See their todos persist across sessions

## Prerequisites

- Basic JavaScript/TypeScript knowledge
- Node.js and npm installed
- 30 minutes

**Choose your approach:**

1. **Quick start** - Use our local dev server (no account needed)
2. **Production ready** - Use managed hosting from the start

This tutorial uses the local dev server. To use managed hosting instead, see our [quickstart guide](/getting-started/quickstart).

## Step 1: Start the development server

Install the CLI and start the local server:

```bash
npm install -g @staticbackend/cli
backend server
```

Your local StaticBackend API is now running at `http://localhost:8099`

## Step 2: Create the project

Set up a new JavaScript/TypeScript project:

```bash
mkdir sb-todo && cd sb-todo
npm init -y
npm install @staticbackend/js
```

## Step 3: Set up the build tools

Install development dependencies:

```bash
npm install --save-dev typescript parcel http-server
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "target": "es5",
    "module": "commonjs",
    "noImplicitAny": false,
    "removeComments": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}
```

Update `package.json` scripts:

```json
"scripts": {
  "start": "http-server",
  "build": "parcel build -d dist app.ts"
}
```

## Step 4: Create the HTML

Create `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>StaticBackend Todo App</title>
  <style>
    body { font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
    input, button { padding: 10px; margin: 5px; }
    li { padding: 10px; cursor: pointer; user-select: none; }
    .done { text-decoration: line-through; color: #999; }
  </style>
</head>
<body>
  <div id="no-auth">
    <h1>Todo App</h1>
    <form id="auth">
      <input name="email" type="email" required placeholder="Email">
      <input name="password" type="password" required placeholder="Password">
      <button type="button" id="register">Register</button>
      <button type="button" id="login">Login</button>
    </form>
  </div>

  <div id="todos" style="display: none;">
    <h1>My Todos</h1>
    <form id="todo">
      <input type="text" name="name" required placeholder="New todo">
      <button type="submit">Add</button>
    </form>
    <ul id="items"></ul>
  </div>

  <script>
    var s = document.createElement("script");
    s.src = "/dist/app.js?x=" + (new Date().getTime());
    document.body.appendChild(s);
  </script>
</body>
</html>
```

## Step 5: Initialize StaticBackend

Create `app.ts`:

```typescript
import { Backend } from "@staticbackend/js";

// Initialize with dev server
const backend = new Backend("any-key", "dev");

// Store the session token
let token: string | null = null;

// Get DOM elements
const noAuth = document.getElementById("no-auth")!;
const todosDiv = document.getElementById("todos")!;
const authForm = document.forms["auth"] as HTMLFormElement;
const btnRegister = document.getElementById("register")!;
const btnLogin = document.getElementById("login")!;

// Prevent form submission
authForm.addEventListener("submit", (e) => e.preventDefault());

// Toggle between login and todo views
function toggleAuth(isAuthenticated: boolean) {
  if (isAuthenticated) {
    noAuth.style.display = "none";
    todosDiv.style.display = "block";
  } else {
    noAuth.style.display = "block";
    todosDiv.style.display = "none";
  }
}

// Start with login view
toggleAuth(false);
```

## Step 6: Add authentication

Add registration and login handlers to `app.ts`:

```typescript
// Register button
btnRegister.addEventListener("click", async () => {
  const email = authForm.email.value;
  const password = authForm.password.value;

  const result = await backend.register(email, password);

  if (result.ok) {
    token = result.content;
    await loadTodos();
    toggleAuth(true);
  } else {
    alert("Registration failed: " + result.content);
  }
});

// Login button
btnLogin.addEventListener("click", async () => {
  const email = authForm.email.value;
  const password = authForm.password.value;

  const result = await backend.login(email, password);

  if (result.ok) {
    token = result.content;
    await loadTodos();
    toggleAuth(true);
  } else {
    alert("Login failed: " + result.content);
  }
});
```

## Step 7: Create and display todos

Add todo functionality to `app.ts`:

```typescript
const todoForm = document.forms["todo"] as HTMLFormElement;
const items = document.getElementById("items")!;

// Prevent form submission
todoForm.addEventListener("submit", (e) => e.preventDefault());

// Add new todo
todoForm.addEventListener("submit", async () => {
  const name = todoForm.name.value;

  const result = await backend.create(token!, "todos", {
    name: name,
    done: false
  });

  if (result.ok) {
    appendItem(result.content);
    todoForm.name.value = "";
  } else {
    alert("Failed to create todo: " + result.content);
  }
});

// Display a todo item
function appendItem(todo: any) {
  const li = document.createElement("li");
  li.innerText = todo.name;
  li.className = todo.done ? "done" : "";
  li.dataset["done"] = todo.done;
  li.dataset["id"] = todo.id;

  // Click to toggle done status
  li.addEventListener("click", async () => {
    const newDone = li.dataset["done"] === "false";

    const result = await backend.update(
      token!,
      "todos",
      todo.id,
      { done: newDone }
    );

    if (result.ok) {
      li.dataset["done"] = newDone.toString();
      li.className = newDone ? "done" : "";
    } else {
      alert("Failed to update todo");
    }
  });

  items.appendChild(li);
}

// Load all todos
async function loadTodos() {
  const result = await backend.list(token!, "todos");

  if (result.ok) {
    items.innerHTML = "";  // Clear existing items
    result.content.results.forEach(appendItem);
  } else {
    alert("Failed to load todos: " + result.content);
  }
}
```

## Step 8: Build and run

Build your app:

```bash
npm run build
```

Start the web server:

```bash
npm start
```

Open your browser to `http://localhost:8080` and test your app!

## Try it out

1. **Register** - Create a new account
2. **Add todos** - Type and submit new todos
3. **Toggle completion** - Click todos to mark them done/undone
4. **Reload the page** - Your todos persist!

## What you learned

✅ **Authentication** - User registration and login in a few lines
✅ **Database operations** - Create, read, and update documents
✅ **Data persistence** - Data survives page reloads
✅ **Error handling** - Proper response checking

## Next steps

### Add more features

**Delete todos:**
```typescript
await backend.delete(token, "todos", todoId);
```

**Real-time updates:**
See multiple users' todos update live with [WebSockets](/components/websocket)

**User profiles:**
Store user preferences and settings

**File uploads:**
Add image attachments to todos

### Deploy to production

When ready to deploy:

1. [Create a managed account](/getting-started/quickstart)
2. Change `"dev"` to `"na1"` and use your real public key
3. [Deploy your frontend](/getting-started/deploy) to Vercel, Netlify, or anywhere
4. Your backend is already production-ready!

## Full code

View the [complete example on GitHub](https://github.com/staticbackendhq/todo-list-example)

## More tutorials

- **[Interactive tutorials](/guides/intro)** - Run code in your browser
- **[React guide](/guides/react)** - Use StaticBackend with React
- **[Framework guides](/guides)** - Vue, Svelte, and more

---

**Questions?** Join our [GitHub Discussions](https://github.com/staticbackendhq/core/discussions)
