+++
title = "Hosted WebSockets with channels"

comptitle = "WebSocket with channels"
compsub = "Connect your users and build collaborative live applications."
submenu = "ws"
+++

We've implemented an excellent communication mechanism for your application. 
You have full WebSocket capabilities augmented with channels where you may opt-in 
your user to receive live data updates.

### Let's take a real-world example.

Suppose you want to build a chat application to let your users inside an 
organization talk about a certain project.

1. One user can create a channel and set the permissions as you do for your 
database repository.
2. Those users can invite other users in the same organization to join the 
channel.
3. Each user of that organization (same account as the owner) can join the 
channel, send, and receive messages.

While talking to other teammates, imagine we would also want to update each 
project page when a team member changes a field in the `projects` repository.

Each of your database repositories has a read-only channel matching the 
permissions of the repository created automatically.

Users can opt-in to receive live data update and adjust the UI accordingly.

1. All members of the chat opt-in to receive live data updates. They join a 
unique channel.
2. Let's imagine someone assigns a client to the project they're currently 
looking at.
3. All users that opt-in will receive the update, and the application can 
update their UI to reflect the changes.

All the orchestration is done for you. You implement the client-side with the 
standard WebSocket's API.

Your WebSocket data is not required to be persisted to your database. It opens 
scenarios like real-time editing or real-time drawing. You don't want to save 
each user interaction into a database so others can receive messages. StaticBackend 
offers both and you decide how you want to create your real-time data flow.

Next component is the [form processing](/components/forms).