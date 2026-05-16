+++
title = "Database as a service"

docsub = "Database without the management, backup and scaling."
submenu = "db"
+++

Quick links:

* [Permissions](#permissions)
* [Operations on behalf of your users](#operations-on-behalf-of-your-users)
* [Create a document](#create-a-document)
* [Create documents in bulk](#create-documents-in-bulk)
* [List documents](#list-documents)
* [Get a document](#get-a-document)
* [Get documents by ids](#get-documents-by-ids)
* [Query for documents](#query-for-documents)
* [Update a document](#update-a-document)
* [Update documents in bulk](#update-documents-in-bulk)
* [Increment a numeric field](#increment-a-numeric-field)
* [Delete document](#delete-document)
* [Delete documents in bulk](#delete-documents-in-bulk)
* [Count documents](#count-documents)
* [Generate a document id](#generate-a-document-id)
* [Search documents](#search-documents)
* [Create database index](#create-database-index)

At its core, StaticBackend's primary offering is a database as a service 
allowing you to perform CRUD operations. Here's how to manage your user's data.

### Indexed per account by default

Each repository (collection, "table") you'll create will always have an 
`accountId` field, which is an index for performance reasons and security.

This `accountId` is automatically set for you from the authenticated user's 
information.

### Public repository

Sometimes you need repositories that can be read by all your users. Editing and 
deleting a record is only allowed for the record owner.

Prefixing the name of the repository with `pub_` will turn a repository as 
public. _Note that users are not required to be authenticated to read public 
repositories_.


Use public repositories only in scenario where you need to display data to 
users that are not signed up yet.

### Permissions

We've borrowed the same permission concept as Unix, where you have three levels 
of permissions:

The `owner`, the `account`, and `everyone` else.

Each permission level has three access possible.

`Read`, `write`, and `execute`.

We use an octal value to define the permissions. For instance, giving full 
permission to the owner, reading permission to the account, and no permission 
for everyone else defines as `740`.

For full access to owner, read and write access to account and read access for 
everyone: `764`.

Read access is `4`. Write access is `2` and execute access is `1`. You add all 
needed access together to form the right octal value.

You can tag your repositories with specifics permissions by using the suffix 
`_perm_`. For instance, `posts_764_`.

The default permissions are `740` so you don't need to specify that one. Note 
that everyone else means authenticated users. To allow non-authenticated users 
the read access, you must use the `pub_` prefix.

*Make sure you plan ahead and choose your permissions carefully as they cannot 
be changed at this moment*. Once a repository is created you cannot change its 
permissions.

### Operations on behalf of your users

Pieces of your application will need to impersonate users to perform database 
operations. Think, for instance, of a daily job that processes your trial 
expiration. You might want to remove data on behalf of the expire user.

Due to this, we have introduced `Sudo` actions that can only be called from a 
server-side environment. For example, the following database operations can be 
executed from a specific route using the `ROOT_TOKEN` authentication. Refer to 
the [root token page](/docs/root-token) for more detail.


### Create a document

Adds a document to a repository.

**HTTP request**:

`POST /db/{repository-name}`

**Format**: JSON

**Body**:

Your JSON will be stored as-is with the addition of an `id` and `accountId` 
fields.

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X POST \
     -d '{"name": "task name", "done": false}' \
     https://na1.staticbackend.com/db/tasks
```
```javascript
const doc = {
  name: "task name",
  done: false
}
const result = await bkn.create(session_token, "tasks", doc);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
task := Task{
  Name: "task name",
  Done: false,
}

err := backend.Create(token, "tasks", task, &task)
```

**Response**:

```json
{
  "accountId":"5e184d95b1374eaf8b994bf3",
  "done":false,
  "id":"5e185aceb1374eaf8b994bf6",
  "name":"task name"
}
```

### Create documents in bulk

Adds multiple documents to a repository.

_This is recommended vs. looping and calling the single create document endpoint._

**HTTP request**:

`POST /db/{repository-name}?bulk=1`

**Format**: JSON

**Body**:

An array of documents.

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X POST \
     -d '[{"name": "task 1", "done": false}, {"name": "task 2", "done": true}]' \
     https://na1.staticbackend.com/db/tasks?bulk=1
```
```javascript
const docs = [{
  name: "task 1",
  done: false
}, {
  name: "task 2",
  done: true
}];
const result = await bkn.createBulk(session_token, "tasks", docs);
if (!result.ok) {
  console.error(result.content);
  return;
}
// true or false
console.log(result.content);
```
```go
tasks := []Task{Task{
  Name: "task 1",
  Done: false,
},
Task{
  Name: "task 2",
  Done: true,
}}

ok, err := backend.CreateBulk(token, "tasks", tasks)
```

**Response**:

```json
true
```

### List documents

List documents for a repository.

**HTTP request**:

`GET /db/{repository-name}`

**Querystring parameters**:

name | type | description
----:|:-----|:------------
page | `number` | Result page (starting at 1, default to 1)
size | `number` | How many document per page (maximum 100, default to 25)
desc | `bool` | Get result by descending order of creation (default to ascending)

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     https://na1.staticbackend.com/db/tasks?size=2&desc=true
```
```javascript
const optionalParams = {
  page: 1,
  size: 2,
  desc: true
}
const result = await bkn.list(session_token, "tasks", optionalParams);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
params := &backend.ListParams{
  Page: 1,
  Size: 20,
  Descending: true,
}

var tasks []Task
result, err := backend.List(token, "tasks", &tasks, params)
fmt.Println("tasks hold the result", tasks)
```

**Response**:

```json
{
  "page":1,
  "size":2,
  "total":223,
  "results":[{
    "accountId":"5e184d95b1374eaf8b994bf3",
    "done":true,
    "id":"5e185bdcb1374eaf8b994bf7",
    "name":"2nd task here"
  },{
    "accountId":"5e184d95b1374eaf8b994bf3",
    "done":false,
    "id":"5e185aceb1374eaf8b994bf6",
    "name":"task name here"
  }]
}
```

### Get a document

Fetch for a specific document.

**HTTP request**:

`GET /db/{repository-name}/{doc-id}`

**Example**:


{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     https://na1.staticbackend.com/db/tasks/5e185aceb1374eaf8b994bf6
```
```javascript
const id = "5e185aceb1374eaf8b994bf6";
const result = await bkn.getById(session_token, "tasks", id);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
id := "5e185aceb1374eaf8b994bf6";
var task Task
err := backend.GetByID(token, "tasks", id, &task)
fmt.Println(task)
```

**Response**:

```json
{
  "accountId":"5e184d95b1374eaf8b994bf3",
  "done":false,
  "id":"5e185aceb1374eaf8b994bf6",
  "name":"task name here"
}
```

### Get documents by ids

Fetch multiple documents from a repository by id.

**HTTP request**:

`POST /db/{repository-name}?ids=true`

**Format**: JSON

**Body**:

An array of document ids.

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X POST \
     -d '["5e185aceb1374eaf8b994bf6", "5e185bdcb1374eaf8b994bf7"]' \
     https://na1.staticbackend.com/db/tasks?ids=true
```
```javascript
const ids = [
  "5e185aceb1374eaf8b994bf6",
  "5e185bdcb1374eaf8b994bf7"
];
const result = await bkn.getByIds(session_token, "tasks", ids);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
ids := []string{
  "5e185aceb1374eaf8b994bf6",
  "5e185bdcb1374eaf8b994bf7",
}
var tasks []Task
err := backend.GetByIDs(token, "tasks", ids, &tasks)
fmt.Println(tasks)
```

**Response**:

```json
[{
  "accountId":"5e184d95b1374eaf8b994bf3",
  "done":false,
  "id":"5e185aceb1374eaf8b994bf6",
  "name":"task name here"
},{
  "accountId":"5e184d95b1374eaf8b994bf3",
  "done":true,
  "id":"5e185bdcb1374eaf8b994bf7",
  "name":"2nd task here"
}]
```

### Query for documents

Get specific documents by supplying criterias.

**HTTP request**:

`POST /query/{repository-name}`

**Format**: JSON

**Querystring parameters**:

name | type | description
----:|:-----|:------------
page | `number` | Result page (starting at 1, default to 1)
size | `number` | How many document per page (maximum 100, default to 25)
sort | `string` | Field name to sort by
desc | `bool` | Get result by descending order of creation (default to ascending)

**Body**:

name | type | description
----:|:-----|:------------
field | `string` | The field name.
op | `string` | Operator, one of (==, !=, >, <, >=, <=, in, !in)
value | any | Filter field on that value based on operator.

*This should be formatted like this*:

```json
[
  ["done", "==", true],
  ["field", "!=", "value"]
]
```

Supported operations: `==`, `!=`, `<`, `>`, `<=`, `>=`, `in`, `!in`.

*Only AND are supported for now*.

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X POST \
     -d '[["done", "==", true]]' \
     https://na1.staticbackend.com/query/tasks?desc=true
```
```javascript
const filters = [
  ["done", "==", true]
];
const params = {
  page: 1,
  size: 25,
  desc: true
};
const result = await bkn.query(session_token, "tasks", filters, params);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
var filters []backend.QueryItem
filters = append(filters, backend.QueryItem{Field: "done", Op: backend.QueryEqual, Value: true})
params := &backend.ListParams{
  Page: 1,
  Size: 25,
  Descending: true,
}
var tasks []Task
result, err := backend.Find(token, "tasks", filters, &tasks, params)
fmt.Println(tasks)
```

**Response**:

```json
{
  "page":1,
  "size":25,
  "total":1,
  "results":[{
    "accountId":"5e184d95b1374eaf8b994bf3",
    "done":true,
    "id":"5e185bdcb1374eaf8b994bf7",
    "name":"2nd task here"
  }]
}
```

### Update a document

Update a repository document.

**HTTP request**:

`PUT /db/{repository-name}/{doc-id}`

**Format**: JSON

**Body**:

The JSON of fields you want updated only. No need to pass back the entire 
document.

*Note that the development server will replace a document and not just update 
the fields.*

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X PUT \
     -d '{"done": false, "assignedTo": "dominic"}' \
     https://na1.staticbackend.com/db/tasks/5e185bdcb1374eaf8b994bf7
```
```javascript
const doc = {
  done: false,
  assignedTo: "dominic"
};
const id = "5e185bdcb1374eaf8b994bf7";
const result = await bkn.update(session_token, "tasks", id, doc);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
partialUpdate := new(struct{
  Done bool `json:"done"`
  AssignedTo string `json:"assignedTo"`
})
partialUpdate.Done = false
partialUpdate.AssignedTo = "dominic"

var task Task
err := backend.Update(token, "tasks", id, partialUpdate, &task)
fmt.Println(task)
```

*Note that you may add new field when updating a document.*

**Response**:

```json
{
  "accountId":"5e184d95b1374eaf8b994bf3",
  "assignedTo":"dominic",
  "done":false,
  "id":"5e185bdcb1374eaf8b994bf7",
  "name":"2nd task here"
}
```

### Update documents in bulk

Update multiple documents at the same time matching filters.

**HTTP request**:

`PUT /db/{repository-name}?bulk=1`

**Format**: JSON

**Body**:

name | type | description
----:|:-----|:------------
update | `object` | The update fields to apply
clauses | `array` | The filters to target documents

The `clauses` is exactly the same as the **Query** endpoint:

name | type | description
----:|:-----|:------------
field | `string` | The field name.
op | `string` | Operator, one of (==, !=, >, <, >=, <=, in, !in)
value | any | Filter field on that value based on operator.

*This should be formatted like this*:

```json
[
  ["done", "==", true],
  ["field", "!=", "value"]
]
```

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X PUT \
     -d '{"update": {"done": true}, "clauses": [["assignTo", "==", "dominic"]]}' \
     https://na1.staticbackend.com/db/tasks?bulk=1
```
```javascript
const data = {
  update: {
    done: true
  },
  clauses: [
    ["assignTo", "==", "dominic"]
  ]
};
const result = await bkn.updateBulk(session_token, "tasks", data);
if (!result.ok) {
  console.error(result.content);
  return;
}
// prints number of document updated
console.log(result.content);
```
```go
filters := []backend.QueryItem{
  {Field: "assignTo", Op: backend.QueryEqual, Value: "dominic"},
}
update := struct {
  Done bool `json:"done"`
}{
  Done: true,
}
updated, err := backend.UpdateBulk(token, "tasks", filters, update)
fmt.Printf("%d document updated", updated)
```

**Response**:

```json
15
```

### Increment a numeric field

Increment or decrement a numeric field on a document.

**HTTP request**:

`PUT /inc/{repository-name}/{doc-id}`

**Format**: JSON

**Body**:

name | type | description
----:|:-----|:------------
field | `string` | The numeric field to update
range | `number` | The signed amount to add to the current value

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X PUT \
     -d '{"field": "viewCount", "range": 1}' \
     https://na1.staticbackend.com/inc/tasks/5e185bdcb1374eaf8b994bf7
```
```javascript
const result = await bkn.increase(
  session_token,
  "tasks",
  "5e185bdcb1374eaf8b994bf7",
  "viewCount",
  1
);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
err := backend.Increase(
  token,
  "tasks",
  "5e185bdcb1374eaf8b994bf7",
  "viewCount",
  1,
)
```

**Response**:

```json
true
```

### Delete document

Delete a document from a repository.

**HTTP request**

`DELETE /db/{repository-name}/{doc-id}`

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X DELETE \
     https://na1.staticbackend.com/db/tasks/5e185bdcb1374eaf8b994bf7
```
```javascript
const id = "5e185bdcb1374eaf8b994bf7";
const result = await bkn.delete(session_token, "tasks", id);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
id := "5e185bdcb1374eaf8b994bf7";
err := backend.Delete(token, "tasks", id)
```

**Response**:

```json
1
```

*Returns the number of document deleted.*

### Delete documents in bulk

Delete multiple documents matching filters.

**HTTP request**:

`DELETE /db/{repository-name}?bulk=1&x=filters-as-base64`

**Format**: JSON

**Querystring parameters**:

name | type | description
----:|:-----|:------------
bulk | `number` | 1 to indicate it's a bulk delete
x | `string` | A base64 encoded JSON of the filters array (see [Query for documents](#query-for-documents))

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X DELETE \
     "https://na1.staticbackend.com/db/tasks?bulk=1&x=base64-here"
```
```javascript
const filters = [["done", "==", true]];
const result = await bkn.deleteBulk(session_token, "tasks", filters);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
filters := []backend.QueryItem{
  {Field: "done", Op: backend.QueryEqual, Value: true},
}
err := backend.DeleteBulk(token, "tasks", filters)
```

**Response**:

```json
5
```

*Returns the number of document deleted.*

### Count documents

Count number of documents in a repository with optional filters.

**HTTP request**:

`POST /db/count/{repository-name}`

**Format**: JSON

**Body**:

Array of filters.

Exactly the same as the **Query** endpoint:

name | type | description
----:|:-----|:------------
field | `string` | The field name.
op | `string` | Operator, one of (==, !=, >, <, >=, <=, in, !in)
value | any | Filter field on that value based on operator.

*This should be formatted like this*:

```json
[
  ["done", "==", true],
  ["field", "!=", "value"]
]
```

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X POST \
     -d '[["done", "==", true]]' \
     https://na1.staticbackend.com/db/count/tasks
```
```javascript
const filters = [
  ["assignTo", "==", "dominic"],
  ["done", "==", false]
];
const result = await bkn.count(session_token, "tasks", filters);
if (!result.ok) {
  console.error(result.content);
  return;
}
// prints numbers of documents
console.log(result.content.count);
```
```go
filters := []backend.QueryItem{
  backend.QueryItem{"assignTo", backend.QueryEqual, "dominic"},
  backend.QueryItem{"done", backend.QueryEqual, false},
}
n, err := backend.Count(token, "tasks", filters)
fmt.Printf("%d document(s) matches", n)
```

**Response**:

```json
{
  "count": 123
}
```

### Generate a document id

Generate a document id before creating a document.

**HTTP request**:

`GET /newid`

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     https://na1.staticbackend.com/newid
```
```javascript
const result = await bkn.newId(session_token);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
// New id generation is available through the HTTP endpoint.
```

**Response**:

```json
"5e185aceb1374eaf8b994bf6"
```

### Search documents

Search documents that have been indexed for full-text search.

**HTTP request**:

`POST /search`

**Format**: JSON

**Body**:

name | type | description
----:|:-----|:------------
col | `string` | Collection / repository to search
keywords | `string` | Search keywords

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X POST \
     -d '{"col": "tasks", "keywords": "release checklist"}' \
     https://na1.staticbackend.com/search
```
```javascript
const result = await bkn.search(
  session_token,
  "tasks",
  "release checklist"
);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
var tasks []Task
err := backend.Search(token, "tasks", "release checklist", &tasks)
fmt.Println(tasks)
```

**Response**:

```json
[{
  "accountId":"5e184d95b1374eaf8b994bf3",
  "done":false,
  "id":"5e185aceb1374eaf8b994bf6",
  "name":"release checklist"
}]
```

### Create database index

[Requires a root token](/docs/root-token): Create database indexes

**HTTP request**:

`POST /sudo/index`

**Format**: JSON

**Query string**:

name | type | description
----:|:-----|:------------
col | `string` | The collection / repository ex: `tasks`
field | `string` | Top-level field to index
type | `string` | Optional typed index: `text`, `number`, `boolean`, or `date`

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer root-token" \
		 -X POST \
     https://na1.staticbackend.com/sudo/index?col=tasks&field=done&type=boolean
```
```javascript
const res = await bkn.sudoAddIndex(rootToken, "tasks", "done", "boolean");
```
```go
err := backend.SudoAddIndex(rootToken, "tasks", "done")
```

**Response**:

```json
true
```
