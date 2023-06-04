+++
title = "Server-side functions"

docsub = "Create functions that react to system events and schedule."
submenu = "fn"
+++

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
// for trigger: web 
function handle(body, qs, headers) {
  // body is an object from the HTTP request body
  // qs is query string map
  // headers is the HTTP headers map
  
  // implement your logic here
}

// for trigger: topic
function handle(channel, type, data) {
  // channel is the channel used to this message
  // type is the type of message (i.e. db_created)
  // data is an object from the message

  // implement your logic here
}
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

**Please note**: all functions that return something will wrap the return object 
inside an object like this:

```
{
  result: true,
  content: {
    status: 200,
    body: "response body"
  }
}
```

This is compatible with the JavaScript/Node API client, you'll write 
your code similar to this:

```
function handle(body, qs, headers) {
  log("my function is running");
  var res = getById("tasks", body.id);
  if (!res.ok) {
    log("error: ", res.content);
    return;
  }

  log("all good, got the task", res.id);
}
```

#### Helper functions

**log("item 1", item2, true, ...)**

The log function allows you to keep records of what's happening during the 
execution of your function. When viewing the execution history, you will see 
all output produced by the log function.

You may specify multiple objects and they'll all get printed.

**fetch(url, params)**

This allow your function to perform HTTP requests.

*Arguments*:

name | type | description
----:|:-----|:------------
url | `string` | The target URL to call
params | `object`  | A browser's `fetch` compatible object

*Returns*: `{staus: 200, body: "response body"}`

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

### Search 

**indexDocument(col, id, text)**

Index the collection `id` with that searchable text. The collection name must 
be the same in which this id belongs to.

name | type | description
----:|:-----|:------------
col  | `string` | The collection the document can be found by `id`
id   | `string` | The id of the document
text | `string` | The searchable text

**Returns**: `boolean`

**search(col, keywords)**

Search the indexed text for this collection.

name | type | description
----:|:-----|:------------
col | `string` | The collection to search in.
keywords | `string` | The keywords to search

**Returns**: `[{your doc}]`