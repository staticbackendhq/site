+++
title				= "Realtime collaborative editing example"
publishDate	= "2021-01-23"
slug				= "realtime-collaboration-example"
+++

Let's discover how the real-time capabilities of StaticBackend can help you 
build collaborative applications.

For this sample, we'll build a simple application for two person to collaborate 
on a piece of code. Here are the functionalities we'll make:

1. A collaborator will be able to join a room by entering the room's mane and a 
unique PIN.
2. The instigator and the collaborator will collaborate on a text area where 
one of them writes code and the other is in view mode.
3. The instigator decides which party has the keyboard control.

*As all StaticBackend's examples, we're not focusing at all on UI/CSS/making it 
looks great. It is using straight HTML, no CSS. Everything is kept as barebone 
as possible to get the important bits to stand out.*

**The example uses the v1.0.0 of our CLI and v1.0.1 of our JavaScript 
helper library.**

## Requirements

* npm installed
* our [CLI](https://staticbackend.com/getting-started/cli/) installed

We'll use vanilla JavaScript for this example. StaticBackend is framework 
agnostic. You may use whatever JavaScript framework or library you prefer. Our 
JavaScript helper is tiny. You may look at the 
[code here](https://github.com/staticbackendhq/backend-js).

## Run the sample

Start the local dev server:

```shell
$> backend server
```

You may clone this example and run the following to see it in action.

```shell
$> git clone git@github.com:staticbackendhq/realtime-example.git
$> cd realtime-example
$> npm install
$> npm run build
$> npm start
```

Visit `http://localhost:8080` with two browsers.

## User login and register

Our users will need to be authenticated to use our application. We're only 
supporting authenticated real-time usage at this moment.

Let's create a quick login/register form and the needed JavaScript to get 
our [user session token](https://staticbackend.com/docs/).

```html
<form id="authForm">
  <div>
    <label>Your email</label>
    <input type="email" name="email" placeholder="Your email" />
  </div>
  <div>
    <label>Your password</label>
    <input type="password" name="password" placeholder="Your password" />
  </div>
  <div>
  <button id="login">Login</button>
    <button id="register">Register</button>
  </div>
</form>
```

Since StaticBackend both the login and register endpoints accept an email and a 
password, we can use the same form with two different buttons.

Let's handle this in JavaScript:

```javascript
import { Backend } from "@staticbackend/js";
const bkn = new Backend("any-token-in-dev", "dev");
```

We first need to import the StaticBackend JavaScript helper library. Note that 
you may use our REST API directly. It's just a little easier to use our small 
library.

Since we use the local development server via the CLI, we can pass any value as 
the public key parameter. We are specifying "dev" as the region to indicate to 
the helper library to call localhost:8099 instead of the production endpoint. 
In short, all requests will be handled with your local development server.

```javascript
// handle login click
const login = document.getElementById("login");
login.addEventListener("click", async (e) => {
  const email = form.email.value;
  const pass = form.password.value;

  const result = await bkn.login(email, pass);
  if (!result.ok) {
    console.error(result.content);
    return;
  }

  sessionStorage.setItem("token", result.content);
  location.href = "/codaborate.html";
});
```

We're attaching a click event to the login button, and we're calling the login 
function of our local backend. Notice how we're saving the session token to the 
browser's local storage so we can retrieve it later.

We redirect the user to the page where the fun begins. The register handler is 
the same except it's calling the register function.

## Define the state of our application.

We need a way to keep some state during the life-cycle of our application. For 
instance, is the current execution is the instigator or the collaborator, who's 
having the keyboard control, etc.

In `app.js`:

```javascript
import 'regenerator-runtime/runtime';
import { Backend } from "@staticbackend/js"
const bkn = new Backend("any-key-in-dev", "dev");

const token = sessionStorage.getItem("token");
// if no token, return to index
if (!token) {
  location.href = "/";
}

// is this the owner of the room
let owner = false;
let currentRoom = "";
let hasControl = false;

// we use this flag to throttle textarea updates
let waitingForPush = false;

// easy reference to div container
const init = document.getElementById("init");
const codaborate = document.getElementById("codaborate");
const title = document.getElementById("title");
const controls = document.getElementById("controls");
const control = document.getElementById("control");
const editing = document.getElementById("editing");
const editor = document.getElementById("editor");
const viewer = document.getElementById("viewer");
```

We import the StatickBackend helper library as we did in the login snippet.

Also, we're getting the token from local storage. I hear you say:

> Anyone could add a token in the local storage, and they would be able to 
access this page.

Yes, of course, it's just a demo. But additionally, the first request they would 
try the backend would return a 401 not authorized response.

Here's a definition of some of those state fields:

* **owner**: Indicates if the current execution can give and take keyboard 
control.
* **currentRoom**: The name of the room.
* **hasControl**: Indicates if the current execution has keyboard control.
* **waitForPush**: To throttle the edit update frequency.
* **HTML elements**: The HTML elements that need to be modified are associated 
with an easier constant name.

## Creating a room

The person that creates a room becomes the owner of that room. They decide who's 
controlling the keyboard.

```javascript
const create = document.getElementById("create");
create.addEventListener("click", async (e) => {
  const doc = {
    name: form.room.value,
    pin: form.pin.value,
    owner: form.name.value,
    collaborator: "waiting for collaborator to join..."
  }

  const result = await bkn.create(token, "rooms_766_", doc);
  if (!result) {
    console.error(result.content);
    return;
  }
  //to be continued
});
```

There are a form and two buttons on the user interface. We see the handler for 
the button that creates a new room.

We create a document with the needed value and call the create function of 
StaticBackend's JavaScript helper.

We're using a room name and a PIN as session identifier for someone to join our 
room. The following sets the state for this execution, which is the owner of 
the room.

```javascript
  //continuation
  owner = true;
  currentRoom = doc.name;

  // we display the control keyboard div for the owner
  controls.classList.remove("hidden");

  showEditor(doc);

  keyboardControl(true);

  initWebSocket();
});
```

Since this execution is the owner, they will have access to the button that 
allows them to give or take keyboard control.

We're initializing the real-time connection with the backend.

## Joining a room

To join a room, one needs the room name and the PIN. We'll start by trying to 
find if this room currently exists.

```javascript
const join = document.getElementById("join");
join.addEventListener("click", async (e) => {
  const room = form.room.value;
  const pin = form.pin.value;
  const name = form.name.value;

  const filters = [
    ["name", "==", room],
    ["pin", "==", pin]
  ];

  const qryres = await bkn.query(token, "rooms_766_", filters);
  if (!qryres.ok) {
    console.error(qryres.content);
    return;
  }

  if (qryres.content.total != 1) {
    alert("Invalid room name/pin");
    return;
  }
  // to be continued...
});
```

We do that by calling the query function. The backend query engine is case 
sensitive, so the user will have to type the same room name and PIN to connect.

If we can find the room, we'll update it with our current user's name so the 
owner will know that we're joining.


```javascript
  //...continuation
  const doc = qryres.content.results[0];
  doc.collaborator = name;

  const result = await bkn.update(token, "rooms_766_", doc.id, doc);
  if (!result.ok) {
    console.error(result.content);
    return;
  }

  currentRoom = doc.name;

  showEditor(doc);

  keyboardControl(false);

  initWebSocket();
});
```

Once we verify that the update is successful, we're initiating the state for 
this execution and will connect for real-time communication.

## Establishing the connection

It's simple to connect your user.

```javascript
const initWebSocket = () => {
  bkn.connect(token, onWSAuth, onWSMessage);
}
```

You need to pass three parameters to the connect function. The session token 
for the current user. A callback function for when authentication is successful. 
And a callback function to handle incoming messages.

Your callback for incoming messages will receive database events as well as 
channel-based messages. In our example, we're using both. The database event 
displays the name of the joining person. The channel-based message to send text 
changes and keyboard control event.

### On successful authentication

Once our successful authentication callback fires, we can join the necessary 
channel to establish the communication between the owner and the collaborator.

The owner joins the database events channel to receive an update when the other 
party enters.

```javascript
const onWSAuth = (tok) => {
  bkn.send(bkn.types.join, currentRoom);

  // for owner to refresh the title when collaborator joins
  if (owner) {
    bkn.send(bkn.types.join, "db-rooms_766_");
  }
}
```

Joining a channel is straightforward. Notice the naming convention for the 
database events channel. It's using the "DB-" prefix followed by the repository 
name.

## Processing incoming messages

The callback handling the incoming message is the central part of our 
application. It's what makes the application feels connected and real-time.

```javascript
const onWSMessage = (payload) => {
  if (payload.type == bkn.types.joined) {
  } else if (payload.type == bkn.types.chanOut) {
    try {
      let subdata = JSON.parse(payload.data);
      process(subdata);
    } catch (ex) {
      console.error(ex);
    }
  } else if (payload.type == bkn.types.dbUpdated) {
    try {
      let doc = JSON.parse(payload.data);
      showEditor(doc);
    } catch (ex) {
      console.error(ex);
    }
  }
}
```

We're basing the control flow on the type of message we're receiving. The 
`bkn.types.chanOut` message type is for user-to-user communication. While the 
`bkn.types.dbUpdated` indicates an update event occurred in the rooms repository.

### Processing sub-messages

We've defined a simple standard for our channel-based communication. The 
message is either about the keyboard control or about the text.

```javascript
const process = (msg) => {
  if (msg.type == "update") {
    viewer.innerText = msg.content;
  } else if (msg.type == "control") {
    keyboardControl(!hasControl);
  }
}
```

### Sending data to other members

The only remaining pieces that we need to see are how the text and keyboard 
events are triggered.

```javascript
// Give them keyboard control or take keyboard control.
control.addEventListener("click", () => {
  var msg = {
    type: "control"
  };
  bkn.send(bkn.types.chanIn, JSON.stringify(msg), currentRoom);
});
```

We're building an object and using our defined type to indicate a keyboard 
control change event.

This message will be delivered to all subscribers to this channel—our incoming 
message handler fires on each received message.

Following is how the text reflect on the other party's viewer div.

```javascript
editor.addEventListener("keyup", (e) => {
  if (waitingForPush) {
    return;
  }

  waitingForPush = true;
  setTimeout(() => {
    waitingForPush = false;
    var msg = {
      type: "update",
      content: editor.value
    };
    bkn.send(bkn.types.chanIn, JSON.stringify(msg), currentRoom)
  }, 400);
});
```

We're using Doherty's thresholds of 400ms to throttle the update in batch. We 
don't want to send each frame on KeyUp.

