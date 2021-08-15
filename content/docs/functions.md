+++
title = "Server-side functions"

docsub = "Create functions that react to system events and schedule."
submenu = "fn"
+++

<a href="https://github.com/staticbackendhq/core" class="inline-flex items-center text-gray-900 rounded-full p-1 pr-2 sm:text-base lg:text-sm xl:text-base hover:text-gray-200">
  <span class="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-sb rounded-full">
    Not yet in production</span>
  <span class="ml-4 text-sm leading-5">Available on the self-hosted version.</span>
  <svg class="ml-2 w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
</a>

Functions run into a custom JavaScript runtime we've created. It means that you 
do not have a full Node environment. You have a sandboxed runtime similar to 
what browsers offer but without the `window` and `document` objects.

### How to trigger functions

When you create a function, you must specify a trigger. At this time, we 
support two trigger types: `web` and `topic` or message type. 

StaticBackend already publishes messages when database documents are created, 
updated, or deleted. So those are all valid topics you can have functions be 
triggered and execute some logic on the server.

A function that triggers via `web` can be invoked directly via its URL.

### Function's entry point

The function entry point is named `handle`. You're required to have a function 
with that name to have a valid executable function.

```
function handle(body, qs, headers) {
  // implement your logic here
}
```

### Built-in message type (topic)

**join**: When a user joins a real-ime channel.

**chan_out**: When a message was send in a real-time channel.

**db_created**: When a document is created.

**db_updated**: When a document is updated.

**db_deleted**: When a document is deleted.

*We will add multiple system topics in the following weeks for all StaticBackend 
resources. For instance, a new user creates an account when files are uploaded, 
forms are submitted, etc. This will allow your application to react to those 
events in a server-side function and perform other important tasks.*

### Built-in runtime functions

Those are the functions we provide to help you interact with your StaticBackend 
resources from your functions.

#### Helper functions

**log("item 1", item2, true, ...)**

The log function allows you to keep records of what's happening during the 
execution of your function. When viewing the execution history, you will see 
all output produced by the log function.

You may specify multiple objects and they'll all get printed.

#### Database releated functions

**create(col, doc)**

Creates the document inside the specified collection.

*Arguments*:

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
doc | 'object' | The document to be created

*Returns*: The created document

**list(col, [params])**

List all documents in a collection.

*Arguments*:

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
params | 'object' | Optional: List parameters object

*List parameter object*:

```json
{
  "page": 1,
  "size": 25
}
```

*Returns*: 

```json
{
  "result": [{your doc}, ...],
  "page": 1,
  "size": 25,
}
```

**getById(col, id)**

Get a document by id.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
id | 'string` | The id of the document

*Returns*: The matching document

**query(col, filter, [params])**

Query a database collection for documents.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
filter | 'array' | Array of filter clause
params | 'object' | Optional: List parameters object

*Returns*:

```json
{
  "result": [{your doc}, ...],
  "page": 1,
  "size": 25,
}
```

**update(col, id, doc)**

Update a document.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
id | 'string' | Document id
doc | 'object' | Document to update (can be partial)

*Returns*: Updated document

**del(col, id)**

Delete a document.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
id | 'string' | Document id to delete

*Returns*: Count of deleted document(s)

#### Event/messages/cache functions

**send(type, data, channel)**

Publish a message to a specific channel.

name | type | description
----:|:-----|:------------
type | `string` | The message type / topic
data | 'object' | The data that's being sent with the message
channel | 'string' | Where to send this message

*Returns*: A `boolean`