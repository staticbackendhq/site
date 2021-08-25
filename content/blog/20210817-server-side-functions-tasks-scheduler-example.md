+++
title				= "Server-side functions & task scheduler example"
publishDate	= "2021-08-17"
slug				= "server-side-functions-task-scheduler-example"


metadesc = ""
cardimg = "https://staticbackend.com/img/blog/self-hosted-gs-snip.png"
+++

The source code for this tutorial can be found 
[here](https://github.com/staticbackendhq/serverside-functions-tasks-example).

Here's a quick video demonstrating the live chat in action.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr"><a href="https://twitter.com/StaticBackend?ref_src=twsrc%5Etfw">@StaticBackend</a> in all its glory.<br><br>216 lines of code for a ~dirty live chat page <a href="https://twitter.com/hashtag/jamstack?src=hash&amp;ref_src=twsrc%5Etfw">#jamstack</a>:<br><br>✅ Login / Register<br>🗨️ Websockets / channel based<br>🔒 Data persistence<br><br>Also note that the 202 LoC is mostly React ceremony here... I think I&#39;m building something of high value and no fluff <a href="https://t.co/3fX4nuYkBE">pic.twitter.com/3fX4nuYkBE</a></p>&mdash; Dominic St-Pierre (@dominicstpierre) <a href="https://twitter.com/dominicstpierre/status/1427713961366020098?ref_src=twsrc%5Etfw">August 17, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Today in this tutorial, we'll build a simple live chat page where users join a 
channel and send and receive messages.

It will be similar to our 
[real-time collaboration tutorial](/blog/realtime-collaboration-example/). But 
we're going to see a new component of SataticBackend, the server-side function.

All messages persist to the database via a server-side function called each 
time a message is received.

### Requirements

To follow along for this example you need the following:

1. Our [self-hosted version](/getting-started/self-hosting/) running locally
2. Node and NPM installed

### Initialize the project and install dependencies

Let's first create a directory named `server-side-sample` and initialize our 
frontend application by running `npm init -y`.

```shell
$> mkdir server-side-sample && cs server-side-sample
$> npm init -y
```

We will need the following JavaScript dependencies:

1. `@staticbackend/js` our main JavaScript client library.
2. `react` and `react-dom` we're going to use React for this example.
3. `TypeScript` will be our language
4. `esbuild` will be our build tool to create our application bundle
5. `http-server` to test our application.

```shell
$> npm install @staticbackend/js typescript
$> npm install --save-dev esbuild http-server
$> npm install react react-dom
$> npm install --save-dev @types/react @types/react-dom
```

We create the `src` directory where our client-side code will be saved.

```shell
$> mkdir src
```

Let's create the scripts we'll need to run and build our React application.

Inside the `package.json` file:

```json
"scripts": {
  "start": "http-server",
  "build": "esbuild --bundle --outfile=dist/chat.js src/bootstrap.tsx"
}
```

We're now ready to start writing our code.


### User authentication

Like all our tutorials, it seems we always start with user authentication. A 
web application cannot go very far without authentication these days.

Let's use our traditional form layout with two fields; email and password. We 
have two buttons to distinguish from the login or register action.

File: `src/auth.tsx`

```typescript
import React from "react";
import { Backend } from "@staticbackend/js";

interface IState {
	email: string;
	password: string;
}

interface IProps {
	onToken: (token: string, email: string) => void;
}

export class Auth extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			email: "",
			password: ""
		}
	}

	handleChanges = (field: string, e: TextEvent) => {
		let s = this.state;
		s[field] = e.target?.value;
		this.setState(s);
	}

	handleLogin = async () => {
		const { email, password } = this.state;
		const res = await bkn.login(email, password);
		if (!res.ok) {
			alert(res.content);
			return;
		}
		this.props.onToken(res.content, email);
	}

	handleRegister = async () => {
		const { email, password } = this.state;
		const res = await bkn.register(email, password);
		if (!res.ok) {
			alert(res.content);
			return;
		}
		this.props.onToken(res.content, email);
	}
	render() {
		return (
			<div>
				<h1>Login or register</h1>
				<p>
					<label>Your email</label>
					<br />
					<input
						type="email"
						onChange={this.handleChanges.bind(this, "email")}
						value={this.state.email}
					/>
				</p>
				<p>
					<label>Your password</label>
					<br />
					<input
						type="password"
						onChange={this.handleChanges.bind(this, "password")}
						value={this.state.password}
					/>
				</p>
				<p>
					<button onClick={this.handleLogin}>Login</button>
					&nbsp;&nbsp;&nbsp;
					<button onClick={this.handleRegister}>Register</button>
				</p>
			</div>
		)
	}
}

```

We're using a callback function `onToken` in our `pros` to send our 
authentication token back to the parent once we've login or register successfully.

```typescript
interface IProps {
	onToken: (token: string, email: string) => void;
}

...
this.props.onToken(res.content, email);
```

If we compare the `handleLogin` and `handleRegister` functions, we'll notice 
that they are almost identical except for the backend function name.

```typescript
const res = await bkn.login(email, password);
vs
const res = await bkn.register(email, password);
```

You might wonder where the `bkn` global variable is coming from. It is declared 
in our `bootstrap.tsx` file, the application's entrypoint. Initiating the 
StaticBackend client there ensures it's available everywhere in our client-side 
application.

File: `bootstrap.tsx`

```typescript
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";
import { Backend } from "@staticbackend/js";

bkn = new Backend("6113e61abe103dba0d35b754", "dev");

ReactDOM.render(
	<App  />,
	document.getElementById("app")
)
```

You'll need your `SB-PUBLIC-KEY` when creating a new instance of the `Backend` 
class. Once you have your self-hosted backend running, you can create your 
app by visiting [http://localhost:8099](http://localhost:8099) and creating an 
account.

You'll see your credentials information in the terminal running the self-hosted 
backend server.

### Our main live chat application

We'll go step-by-step for this one. Let's start by looking at the state of the 
component.

File: `src/app.tsx`

#### Component's state and data model

```typescript
import React, { ChangeEventHandler } from "react";
import { Auth } from "./auth";
import { Chat } from "./chat";
import { Backend, Payload } from "@staticbackend/js";

interface IState {
	token: string | null;
	username: string;
	messages: Array<IMessage>;
	msg: string;
}

interface IMessage {
	from: string;
	body: string;
}

```

We're importing the `Auth` component we just covered. This component will be 
displayed if we don't have a valid authentication token.

Our state has a `token` field that we will be using once the `Auth` component 
calls our `onToken` callback.

The array of `IMessage` will be used to display the chat messages. The `msg` 
field will be used to type a new message.

#### Constructor

Let's have a look at our component declaration and constructor.

```typescript
export class App extends React.Component<any, IState> {
	constructor(props: any) {
		super(props);

		this.state = {
			token: null,
			username: "",
			messages: [],
			msg: ""
		}
	}
  //...
}
```

We initialize the component's state with empty value for all fields.

#### Render and helper UI function

Let's jump straight to the rendering part of the component to focus last on the 
main part involving the WebSocket processes.

```typescript
renderMsg = (msg: IMessage, index: number) => {
  if (!msg) {
    return null;
  }
  
  return (
    <p key={index}>
      <strong>{msg.from}</strong>:
      &nbsp;&nbsp;
      {msg.body}
    </p>
  )
}

render() {
  if (!this.state.token) {
    return (
      <Auth onToken={this.onToken} />
    );
  }

  const msgs = this.state.messages?.map(this.renderMsg);

  return (
    <div>
      <h1>Sample chat: {this.state.username}</h1>
      <div id="messages">{msgs}</div>
      <p>
        <input
          type="text"
          placeholder="enter a new message"
          onChange={this.handleMsg}
          onKeyPress={this.handleSubmit}
          value={this.state.msg}
        />
      </p>
    </div>
  )
}
```

If we do not have a valid authentication token, we display our Auth component. 
Otherwise, we'll show the chat messages and an input field to  write a new 
message.

The `renderMsg` is a small helper to format a `IMessage` in HTML.

We're finally at the main step. What happened when our `Auth` component calls 
the `onToken` callback.

#### Real-time aspect of this tiny live chat sample

These are the events that are handle in the `onToken` callback:

1. Once authenticated, we can connect to the real-time component of StaticBackend.
2. Once connected, we can join a channel to send and receive messages.
3. Get the previous messages from database.
4. When someone joins the channel, we want to be notified.
5. When new messages are posted to that channel, we want to see them.

Here's the `onToken` callback:

```typescript
onToken = (token: string, email: string) => {
  this.setState({ token: token, username: email });

  bkn.connect(token,
    (tok: string) => {
      console.log("socket connected");

      bkn.send(bkn.types.join, "lobby");
    },
    (pl: Payload) => {
      switch (pl.type) {
        case bkn.types.ok:
          if (pl.data == "lobby") {
            (async () => {
              // get all messages from the channel
              console.log("loading previous message");
              const res = await bkn.list(token, "msgs_774_");
              if (!res.ok) {
                alert("error listing messages from db: \n" + res.content);
                return;
              }

              let { messages } = this.state;;
              res.content.results?.forEach((m) => messages.push(m));
              this.setState({ messages: messages });
            })();
          }
          break;
        case bkn.types.joined:
          let { messages } = this.state;;
          messages.push({
            from: "system",
            body: `${pl.data} joins the channel`
          });
          this.setState({ messages: messages });
          break;
        case bkn.types.chanOut:
          try {
            const msg = JSON.parse(pl.data);
            let { messages } = this.state;
            messages.push(msg);
            this.setState({ messages: messages });
          } catch (ex) {
            console.error(pl);
            alert(ex);
            return;
          }
      };
    }
  );
}
```

The first step in our `onToken` callback is to set the component state 
indicating we have an authentication token.

```typescript
this.setState({ token: token, username: email });
```

Next we want to connect to establish the WebSocket communication:

To do that we use the `connect` function of our client library.

```typescript
connect(token: string, (tok: string) => void, (pl: Payload) => void)
```

The `connect` function wants three arguments:

* **token**: is our authentication token
* **connected callback**: a callback used for successful connection.
* **message received callback**: a callback used for all incoming messages.

We can then call the `connect` function like this:

```typescript
bkn.connect(token,
	(tok: string) => {
		console.log("socket connected");

		bkn.send(bkn.types.join, "lobby");
	},
	(pl: Payload) => {}
);
```

The first argument is the token we got from our `Auth` component.

The second argument is a callback function we use to join a channel named `lobby`. 
This function gets called if our WebSocket connection is successful.

The last argument is a callback function that gets called everytime a new 
message is received.

It's usually standard to perform a `switch` operation on the `type` field when 
receiving messages. This is the data model representing messages:

```json

  "sid": "unique socket id",
  "type": "one of supported types",
  "data": "a string representing the payload",
  "channel": "if the message target a channel",
  "token": "a special token obtained via auth"
}
```

The `data` field is a `string` but usually contains JSON parsable format.

Let's inspect our `switch` condition more closely:

```typescript
switch (pl.type) {
  case bkn.types.ok:
    if (pl.data == "lobby") {
      (async () => {
        // get all messages from the channel
        console.log("loading previous message");
        const res = await bkn.list(token, "msgs_774_");
        if (!res.ok) {
          alert("error listing messages from db: \n" + res.content);
          return;
        }

        let { messages } = this.state;;
        res.content.results?.forEach((m) => messages.push(m));
        this.setState({ messages: messages });
      })();
    }
    break;
  // other cases
}
```

This first case handles a generic type: `bkn.types.ok`. Whenever we send 
messages, we're getting a reply in the `OK` or `ERR` state. We're using the  
`OK` state of our `join` command to fetch the previous message in our database.

Since all command we use will have an `OK` returned, we're using the `data` 
field to filter for the `join` resulting command.

Let's see how we're notifying when someone joins the channel:

```typescript
case bkn.types.joined:
  let { messages } = this.state;;
  messages.push({
    from: "system",
    body: `${pl.data} joins the channel`
  });
  this.setState({ messages: messages });
  break;
```

We're manually adding a message to the `messages` array each time a new person 
join.

Lastly let's have a look at out `chan_out` case, when a new message is 
posted to the channel:

```typescript
case bkn.types.chanOut:
  try {
    const msg = JSON.parse(pl.data);
    let { messages } = this.state;
    messages.push(msg);
    this.setState({ messages: messages });
  } catch (ex) {
    console.error(pl);
    alert(ex);
    return;
  }
```

We `JSON.parse` the `data` field of our `Payload` data model. Since it's a 
`string` we need to parse it to get a JavaScript object.

From there we can add it to our array of messages and update the component's 
state.

#### Posting new messages

The last piece remaining to see for the client-side application is the 
submission of the new message. We're using an `onKeyPress` handler that posts 
to the `lobby` channel when we hit the `Enter` key:

```typescript
handleSubmit = (e: any) => {
  if (e.charCode == 13) {
    e.preventDefault();

    const msg: IMessage = {
      from: this.state.username,
      body: this.state.msg
    }
    bkn.send(bkn.types.chanIn, JSON.stringify(msg), "lobby");

    this.setState({ msg: "" });
  }
}
```

To send a message to a channel, we use the `chan_in` type command with the `send` 
function.

## Using a server-side function to persists the messages

The last part of this tutorial will focus on creating a 
[server-side function](https://staticbackend.com/docs/functions/) that executes 
each time there's a new message posted to a channel.

StaticBackend's server-side functions are sandboxed JavaScript functions that 
run on the server with a custom runtime. You have access to most StaticBackend 
resources like the database, posting messages, sending emails, etc.

The functions trigger based on messages or topics. Remember we had a case 
where we were handling the `bkn.types.chanOut` message type earlier. So we can 
have a server-side function trigger based on that same event type.

To create the function, we'll use our 
[CLI](https://staticbackend.com/getting-started/cli/). Note that you can 
[get started with the CLI here](https://staticbackend.com/getting-started/cli/). 
You may also use the web UI of StaticBackend to create the function.

```shell
$> backend function add --name new_msg --trigger chan_out --source ./fn.js
```

We specify the name of the function, its trigger, and the JavaScript source 
file executed.

This is the function source:

file: fn.js

```javascript
function handle(body) {
    log("DEBUG: inside ssf", body);
    try {
        var msg = JSON.parse(body.data);
        msg.sentOn = new Date();
        var res = create("msgs_774_", msg);
        if (!res.ok) {
            log("unable to create msg", res.content);
            return;
        }
        log("success");
    } catch(ex) {
        log("error parsing data", ex);
    }
}

```

All functions must have a `handle` function name. This handler will receive important 
arguments by the runtime, like body. In our case, we're receiving the `Payload` 
of a new message being posted on a channel.

We parse the `data` field and add a `sentOn` field just for demonstration 
purposes.

We then create the message entry to a `msgs` collection. Please note that our 
collection "`msgs_774`" has specifics permissions. We're enabling everyone 
(authenticated) to read this collection. Please refer to our 
[documentation](https://staticbackend.com/docs/database/) to understand how you 
can opt-in to specifics permission for your collection.

## In conclusion

This tutorial demonstrates some building blocks of StaticBackend that help you 
launch your application faster. We have got the following functionalities for 
free in a small codebase:

1. User authentication, login, and register.
2. Database CRUD
3. WebSocket connection, channel-based communication
4. Server-side functions
5. Event-based architecture

If you haven't tested StaticBackend yet, we will encourage you to do so and see 
for yourself how it can help you. We're happy to hear your feedback and any 
questions you have. We're here to help.