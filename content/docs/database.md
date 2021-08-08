+++
title = "Database as a service"

docsub = "Database without the management, backup and scaling."
submenu = "db"
+++

At its core, StaticBackend's primary offering is a database as a service 
allowing you to perform CRUD operations. Here's how to manage your user's data.

### Indexed per account by default

Each repository you'll create will always have an `accountId` field, which is an 
index for performance reasons and security.

This `accountId` is automatically set for you from the authenticated user's 
information.

### Public repository

Sometimes you need repositories that can be read by all your users. Editing and 
deleting a record is only allowed for the record owner.

Prefixing the name of the repository with `pub_` will turn a repository as 
public. Note that users are not required to be authenticated to read public 
repositories.

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


### Create a document

Adds a document to a repository.

**HTTP request**:

`POST /db/{repository-name}`

**Format**: JSON

**Body**:

Your JSON will be stored as-is with the addition of an `id` and `accountId` 
fields.

**Example**:

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
  descending: true
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

```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X POST
     -d '[["done", "==", true]]'
     https://na1.staticbackend.com/query/tasks
```
```javascript
const filters = [
  ["done", "==", true]
];
const result = await bkn.query(session_token, "tasks", filters);
if (!result.ok) {
  console.error(result.content);
  return;
}
console.log(result.content);
```
```go
var filters []backend.QueryItem
filters = append(filters, backend.QueryItem{Field: "done", Op: backend.QueryEqual, Value: true})
var tasks []Task
result, err := backend.Find(token, "tasks", filters, &tasks)
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

```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X PUT
     -d '{"done": false, "assignedTo": "dominic"}'
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

var task Task
err := backend.Update(token, "tasks", id, partialUpdate, &task)
fmt.Println(task)
```

*Note that you may add new field when updating a document.*

**Response**:

```json
true
```

### Delete documents

Delete a repository document.

**HTTP request**

`DELETE /db/{repository-name}/{doc-id}`

**Example**:

```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X DELETE
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