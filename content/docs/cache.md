+++
title = "Cache for your application"

docsub = "Easily cache strings or objects with user isolation."
submenu = "cache"
+++

Caching is helpful in almost all application types.

Use this feature to store volatile values, for instance, if you're using 
Stripe's customer portal. You might want to save some state before sending your 
users to Stripe, and you're able to get the value once they're back.

### Cache set

[Requires a root token]("/docs/root-token"): Store an item on the cache

**HTTP request**:

`POST /sudo/cache`

**Format**: JSON

**Body**:

name | type | description
----:|:-----|:------------
key | `string` | The key for this item
value | `object` | To object to store

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer root-token" \
		 -X POST \
		 -d '{"key": "test", "value": "working"}' \
     https://na1.staticbackend.com/sudo/cache
```
```javascript
const val = {a: "b", c: true};
const res = await bkn.cacheSet(rootToken, "key", val);
```
```go
val := []string{"a", "b"}
if err := backend.CacheSet(rootToken, "key", val); err != nil {
	//...
}
```

**Response**:

```json
true
```

### Cache get

[Requires a root token]("/docs/root-token"): Get an object from cache

**HTTP request**:

`GET /sudo/cache?key=your_key`

**Querystring parameters**:

name | type | description
----:|:-----|:------------
key | `string` | The key for the item

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer root-token" \
     https://na1.staticbackend.com/sudo/cache?key=test
```
```javascript
const res = await bkn.cacheGet(rootToken, "key");
// res.content contains the object if found
```
```go
var val []string
if err := backend.CacheGet(rootToken, "key", &val); err != nil {
	//...
}
```

**Response**:

```json
{
	"a": "b",
	"c": true
}
```
