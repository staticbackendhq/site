+++
title = "User management"

comptitle = "User management"
compsub = "Everything you need to manage your users"
submenu = "user"
+++

The core of the majority of web and mobile applications is user management. 
Your StaticBackend account includes everything you need to manage your users' 
accounts.

You can:

* Create new accounts and users.
* Authenticate users via email and password.
* Authenticate users via external OAuth providers.
* Authenticate users via magic link.
* Let them reset their password.

The `/register` and `/login` endpoints return a session token that you must use for 
every subsequent request. You may keep that token in your user's session or local 
storage.

### Account and user distinction

We let you group users into an account. It's useful to build an application 
that enables an organization to have multiple users inside a shared account.

Each user will have their account if you're not planning on having multiple 
users per account.

Each document created is owned by the user creating the document and have the 
`accountId` field. It's handy when handling read and write permissions.

Next component is our [scalable database](/components/database).