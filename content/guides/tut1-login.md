+++
title = "Tutorial 1: Login"

docsub = "Showcase how to login and get a session token."
submenu = "tut1"

metadesc = "Learn how to login your users and get their session tokens."
+++

You can store the returned token since you'll need it for most of the endpoints 
of the API.

Note that the `register` function is exactly the same as the `login`.

Same function signature and returns a token, you may test it:

```js
// const res = await bkn.login("a@b.com", "pass1234");
const res = await bkn.register("new-user@domain.com", "passwd123");
```
Next: [Tutorial 2: Add another user to an account](/guides/tut1-add-another-user)