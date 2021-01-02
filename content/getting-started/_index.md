+++
title			= "Getting started with StaticBackend"

gsmenu = "example"
+++

### To-do list example

Let's build the hello world equivalent for web applications—a simple to-do list 
application. You may find the 
[GitHub repository here](https://github.com/staticbackendhq/todo-list-example).

**Pre-requisites**:

* npm installed
* Install our [CLI](/getting-started/cli) to have a development server.

We start the development server:

```shell
$> backend server
```

You don't need to create an account or anything. it just works.

We're going to use plain TypeScript for this example. StaticBackend does not have 
any requirement/opnion regarding which framework or language you use. To keep 
things simple, let's use plain TypeScript for this example.

### Creating the project

We start by initiating a new JavaScript application.

```shell
$> mkdir sb-todo && cd sb-todo
$> npm init -y
```

We created an empty directory for our to-do app and changed the directory to 
initiate the npm application.

We now need to install StaticBackend's JavaScript library.

```shell
$> npm install @staticbackend/js
```

We will now install a web server and set up our start script that will serve 
our application.

```shell
$> npm install --save-dev http-server
```

Inside the `package.json` file:

```javascript
...
"scripts": {
  "start": "http-server"
},
...
```

We can now start our application with:

```shell
$> npm start
```

We will need `typescript` and `parcel` to build our application.

```shell
$> npm install --save-dev typescript parcel
```

This is the `tsconfig.json` file:

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
  "include": [
    "./**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

And our `build` script inside the `package.json`:

```json
"scripts": {
  "start": "http-server",
  "build": "parcel build -d dist app.ts",
},
```

We can build our application via:

```shell
$> npm run build
```

### Register and login user

We will define two `div` elements on our page. One for registering and login and 
the other to display the to-do list items.

Inside `index.html`

```html
<html>
<head>
  <title>StaticBackend to-do list example</title>
</head>
<body>
  <div id="no-auth"></div>
  <div id="auth"></div>
  <script>
    var s = document.createElement("script");
    s.src = "/dist/app.js?x=" + (new Date().getTime());
    document.body.appendChild(s);
  </script>
</body>
</html>
```

Let's create a simple register/login form:

```html
<form id="auth">
  <input name="email" type="email" required placeholder="email">
  <input name="password" type="password" required placeholder="password">
  <button id="register">register</button>
  <button id="login">login</button>
</form>
```

We will now handle click events for the register and login buttons.

Inside our `app.ts` file:

```typescript
// 1. StaticBackend's JavaScript helper
import { Backend } from "@staticbackend/js";
const bkn = new Backend("pub-key", "dev");

// 2. current user's session token
let token = null;

// main div
let noAuth = document.getElementById("no-auth");
let todos = document.getElementById("todos");

// register/login buttons
let btnReg = document.getElementById("register");
let btnLogin = document.getElementById("login");
let authForm = document.forms["auth"];

// prevent page refresh
authForm.addEventListener("submit", (e) => e.preventDefault());

// 3. register/login click event handlers
btnReg.addEventListener("click", async (e) => {
  const result = await bkn.register(authForm.email.value, authForm.password.value);
  if (!result.ok) {
    console.error(result.content);
    return;
  }
  token = result.content;

	toggleAuth(true);
});

btnLogin.addEventListener("click", async (e) => {
  const result = await bkn.login(authForm.email.value, authForm.password.value);
  if (!result.ok) {
    console.error(result.content);
    return;
  }
  token = result.content;
  toggleAuth(true);
});

const toggleAuth = (state) => {
  if (state) {
    noAuth.style.display = "none";
    todos.style.display = "block";
  } else {
    noAuth.style.display = "block";
    todos.style.display = "none";
  }
}

// we show the register/login div by default
toggleAuth(false);
```

*Refer to the numbers in the comments on the code above to describe that part 
of the code.*

1. We initialize the helper library. Since we're using the local development 
server, we can use any value as the public key and the region of "dev," which 
tells the library to use the default development endpoint.
2. We will store the user's session token inside this variable. In a real 
application, you would save this token in their session or local storage or 
inside a persisted user object you already have.
3. Our event handlers are almost identical. You can see how we're handling a 
request that would fail. In a real application, you could have a way to notify 
the user in a clean way that something wrong happened.

### Create a to-do

Before we start the creation of documents in our database, we need to determine 
the access level we will need for this particular repository we want to create.

By default, StaticBackend ensures that only the document owner can edit and 
delete a document. All users inside the same account can read documents owned 
by that account. The default permissions fit exactly with our current use case. 
We will name our repository "todos."

Here's the form we need to create a new to-do item:

```html
<div id="todos">
  <form id="todo">
    <input type="text" name="name" required placeholder="New to-do">
    <button type="submit" value="Add"></button>
  </form>
  <ul id="items" style="padding-top: 20px;"></ul>
</div>
```

We have our form and a container to display to-do items. Let's add the form 
submit event handler:

```typescript
// add to-do form
const addForm = document.forms["todo"];

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const doc = {
    name: addForm.name.value,
    done: false
  }
  const result = await bkn.create(token, "todos", doc);
  if (!result.ok) {
    console.error(result.content);
    return;
  }
  appendItem(result.content);
  addForm.name.value = "";
  addForm.focus();
});

// the to-do container
let items = document.getElementById("items");

const appendItem = (todo) => {
  const li = document.createElement("li");
  li.innerText = todo.name;
  items.appendChild(li);
}
```

Our handler will trigger when the form is submitted, and we prevent the default 
action. We then call the `create` function of our backend helper library.

We have a function that takes a to-do item and appends it to the items container.

### Tag a to-do as done

To toggle a to-do, we're adding the click handler directly on the list item 
element. It's only for demonstration purposes since we're creating the HTML 
manually. On a real application, we would use a proper accessible element like 
a checkbox, for example.

This is our updated `appendItem` function:

```typescript
const appendItem = (todo) => {
  const li = document.createElement("li");
  li.innerText = todo.name;
  // 1. we use the data-done attribute
  li.dataset["done"] = todo.done;
  // 2. the click event handler
  li.addEventListener("click", async (e) => {
    // 3. update only what we need
    const update = { done: li.dataset["done"] == "false" };
    const result = await bkn.update(token, "todos", todo.id, update);
    if (!result.ok) {
      console.error(result.content);
      return;
    }

    // 4. update UI state
    li.style.textDecoration = update.done ? "line-through" : "none";
    li.dataset["done"] = update.done ? "true" : "false";
  });
  items.appendChild(li);
}
```

1. We are using the `dataset` attribute of our list item element to hold the state 
of if a to-do item is completed or not.
2. The click event handler is attached to our dynamic list item element. That 
way, we're able to use the to-do object inside our function closure.
3. We only supply the fields we want to update. We can use the to-do object's 
id we received in the function call.
4. We update the UI to reflect the new change to this to-do item.


### Load the to-do after login

Loading and displaying to-dos for the current user is simple now that we have a 
way to append an item to the container.

```typescript
const loadTodos = async () => {
  const result = await bkn.list(token, "todos");
  if (!result.ok) {
    console.error(result.content);
    return;
  }
  result.content.results.forEach(appendItem);
}
```

We can now call this function inside our login click handler. 

```typescript
btnLogin.addEventListener("click", async (e) => {
  const result = await bkn.login(authForm.email.value, authForm.password.value);
  if (!result.ok) {
    console.error(result.content);
    return;
  }
  token = result.content;
  await loadTodos();
  toggleAuth(true);
});
```

