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

```javascript
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

```javascript
{
  ok: true,
  content: {
    status: 200,
    body: "response body"
  }
}
```

This is compatible with the JavaScript/Node API client, you'll write 
your code similar to this:

```javascript
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

*Returns*: `{status: 200, body: "response body"}`

**cacheSet(key, value)**

Set this value for this key in the cache.

*Arguments*:

name | type | description
----:|:-----|:------------
key  | `string` | The key to use in the cache
value| `string` | The value for that key

*Returns*: `true`

**cacheGet(key)**

Get the value for this key in the cache.

*Arguments*:

name | type | description
----:|:-----|:------------
key  | `string` | The key to get the value of

*Returns*: `string value of the item if exists`

**inc(key, n)** or **dec(key, n)**

Increment (inc) or decrement (dec) a value (this is an atomic incrementation).

*Arguments*:

name | type | description
----:|:-----|:------------
key  | `string` | The key in the cache
n    | `number` | The number to increment or decrement (starting number if key does not exists)

*Returns:* `number` = the new value after the operation.


**publish(channel, type, data)**

Publish message that triggers another server-side functions.

*Arguments*:

name | type | description
----:|:-----|:------------
channel | `string` | The channel to send the message to
type    | `string` | The type of message (useful to control if function run or not)
data    | `object` | The data that will be posted

*Returns*: `true`

#### Database related functions

**create(col, doc)**

Creates the document inside the specified collection.

*Arguments*:

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
doc | `object` | The document to be created

*Returns*: The created document

**createBulk(col, docs)**

Creates multiple documents inside the specified collection.

*Arguments*:

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
docs | `array` | Documents to create

*Returns*: `true`

**list(col, [params])**

List all documents in a collection.

*Arguments*:

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
params | `object` | Optional: List parameters object

*List parameter object*:

```json
{
  "page": 1,
  "size": 25,
  "sortBy": "name",
  "sortDescending": true
}
```

*Returns*: 

```json
{
  "results": [{your doc}, ...],
  "page": 1,
  "size": 25,
  "total": 1
}
```

**getById(col, id)**

Get a document by id.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
id | `string` | The id of the document

*Returns*: The matching document

**getByIds(col, ids)**

Get multiple documents by id.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
ids | `array` | Array of document ids

*Returns*: Array of matching documents

**query(col, filter, [params])**

Query a database collection for documents.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
filter | `array` | Array of filter clause
params | `object` | Optional: List parameters object

*Returns*:

```json
{
  "results": [{your doc}, ...],
  "page": 1,
  "size": 25,
  "total": 1
}
```

**count(col, [filter])**

Count documents in a collection.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
filter | `array` | Optional: Array of filter clauses

*Returns*: Number of matching documents

**update(col, id, doc)**

Update a document.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
id | `string` | Document id
doc | `object` | Document to update (can be partial)

*Returns*: Updated document

**updateMany(col, filter, doc)** or **updateBulk(col, filter, doc)**

Update multiple documents matching filters.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
filter | `array` | Array of filter clauses
doc | `object` | Fields to update

*Returns*: Count of updated document(s)

**incrementValue(col, id, field, n)**

Increment or decrement a numeric field on a document.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
id | `string` | Document id
field | `string` | Numeric field name
n | `number` | Signed amount to add to the field value

*Returns*: `true`

**del(col, id)**

Delete a document.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
id | `string` | Document id to delete

*Returns*: Count of deleted document(s)

**deleteMany(col, filter)** or **deleteBulk(col, filter)**

Delete multiple documents matching filters.

name | type | description
----:|:-----|:------------
col | `string` | Database collection name
filter | `array` | Array of filter clauses

*Returns*: Count of deleted document(s)

**newId()** or **newID()**

Generate a new database id.

*Returns*: The new id as a string

#### Event/messages/cache functions

**publish(channel, type, data)**

Publish a message to a specific channel.

name | type | description
----:|:-----|:------------
channel | `string` | Where to send this message
type | `string` | The message type / topic
data | `object` | The data that's being sent with the message

*Returns*: A `boolean`

### Managing functions

[Requires a root token](/docs/root-token): Create, update, list and delete
server-side functions.

**Function object**:

name | type | description
----:|:-----|:------------
name | `string` | Function name
trigger | `string` | Trigger topic, for example `web`, `db_created`, or a custom channel
code | `string` | JavaScript source code

**Create function**:

`POST /fn/add`

```json
{
  "name": "sync-search",
  "trigger": "db_created",
  "code": "function handle(channel, type, data) { log(data); }"
}
```

**Update function**:

`POST /fn/update`

```json
{
  "id": "function-id",
  "trigger": "db_created",
  "code": "function handle(channel, type, data) { log(data); }"
}
```

**List functions**:

`GET /fn`

**Function info**:

`GET /fn/info/{function-name}`

**Delete function**:

`GET /fn/del/{function-name}`

`GET /fn/delete/{function-name}` is also supported.

**Execute web function**:

`POST /fn/exec/{function-name}`

This endpoint uses the authenticated user's token and passes the HTTP body,
query string, and headers to `handle(body, qs, headers)`.

**Execute web function with a root token**:

`POST /fn/sudoexec/{function-name}`

Both execution endpoints return HTTP `200` when the function completes
successfully.

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

**deleteIndexDocument(col, id)**

Delete an indexed document from full-text search.

name | type | description
----:|:-----|:------------
col | `string` | The collection the document can be found by `id`
id | `string` | The id of the indexed document

**Returns**: `boolean`

**search(col, keywords)**

Search the indexed text for this collection.

name | type | description
----:|:-----|:------------
col | `string` | The collection to search in.
keywords | `string` | The keywords to search

**Returns**: `[{your doc}]`
