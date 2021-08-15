+++
title = "Server-side functions & event messages"

comptitle = "Functions & messages"
compsub = "Create server-side functions. Publish and react to event messages."
submenu = "fn"
+++

*This feature is in beta and not publicly available.*

While most actions occur on your frontend code, sometimes it's helpful to have 
functions running server-side.

One clear example would be scheduling a daily task. For example, let's say 
you'd like to run a function every day to handle the trial expiration process.

We have three components helping to expand your application logic out of the 
frontend.

### Task scheduler

The task scheduler allows you to execute a function or publish a message at a 
specific interval. For example, you may create complex intervals like the first 
Monday of each month at 9 am.

### Event messages

The event messages system allows you and the system to publish messages and have 
functions handling the logic.

Let's say you'd like to build a live chat application. All conversations between 
the agent and the user should be saved so they can be referenced later.

The real-time component already publishes messages, you would create a function 
that triggers on the "chan_in" message and you'd be able to save the chat 
message into your database.

### Server-side functions

The server-side functions are written in JavaScript. You may see them more like 
plugins that use a scripting language. It's not running in a Node environment.

They run inside a custom runtime that we've created to make things simple. You 
may use custom functions we've added on top of the standard JavaScript 5.1 
specifications.

You can think of the function as if it were running on the frontend with 
StaticBackend's JavaScript library but without the `window` and `document` 
objects, you get when running inside a browser.

Server-side functions aim to allow the developer to react to system messages 
and custom triggers with a simple programming model in a sandboxed runtime.

We will add functions as we get more feedback from users. Please make sure to 
let us know if you need critical functionality.
