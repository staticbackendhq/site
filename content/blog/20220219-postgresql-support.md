+++
title				= "Introducing support for PostgreSQL"
publishDate	= "2022-02-19"
slug				= "postgresql-support"


metadesc = "The v1.2.0 is introducing support for other database engine, we're releasing support for PostgreSQL."
cardimg = "https://staticbackend.com/img/blog/self-hosted-gs-snip.png"
+++

The [release of v1.2.0](https://github.com/staticbackendhq/core/releases/tag/v1.2.0) 
introduces a new data persistence interface that allows the support of 
different database engines as the data store for StaticBackend.

Since 2019, StaticBackend's main database engine has been MongoDB. PostgreSQL 
is now fully supported as an alternative.

### How to try it

StaticBackend now defaults to PostgreSQL. The demo `docker-compose-demo.yml` 
file is currently configured with PostgreSQL service by default.

Here's how you can get started and test for a brand new application.

**1. Clone the repository**:

```shell
$> git clone git@github.com:staticbackendhq/core.git
```

**2. Create a .env file**:

```shell
$> cd core
$> cp .demo-env .env
```

**3. Create the Docker image for StaticBackend**:

```shell
$> docker build . -t staticbackend:latest
```

**4. Start all needed services**:

```shell
$> docker-compose -f docker-compose-demo.yml up
```

**5. Create your app**:

Open a browser to that URL [http://localhost:8099](http://localhost:8099) and 
create an app by entering an email address. Don't worry no email are sent in 
dev mode.

**6. Check your database in PostgreSQL**:

```shell
$> docker exec -it core_db_1 psql -U postgres
postgres=# SELECT schema_name FROM information_schema.schemata;
```

You'll see all your database schemas, similar to this:

```
--------------------
 pg_toast
 pg_catalog
 public
 information_schema
 sb
 syqlsxsnhmx9
(6 rows)

```

The `sb` schema is a reserved schema StaticBackend uses to hold all applications 
meta data.

The `syqlsxsnhmx9` in my case is my newly created app database.

Yours will be named differently, it's a random name.

Let's look at the default tables that SB created:

```
postgres=# \dt syqlsxsnhmx9.*
                 List of relations
    Schema    |       Name       | Type  |  Owner   
--------------+------------------+-------+----------
 syqlsxsnhmx9 | sb_accounts      | table | postgres
 syqlsxsnhmx9 | sb_files         | table | postgres
 syqlsxsnhmx9 | sb_forms         | table | postgres
 syqlsxsnhmx9 | sb_function_logs | table | postgres
 syqlsxsnhmx9 | sb_functions     | table | postgres
 syqlsxsnhmx9 | sb_tasks         | table | postgres
 syqlsxsnhmx9 | sb_tokens        | table | postgres
(7 rows)
```

**7. Create a database record**:

The quickest way for this demo to create a database record without creating a 
client-side or server-side app is by manually using `curl`.

Please refer to other guides for how to use client libraries.

When you created your app at **step 5** the terminal where you ran the 
`docker-compose` command has output important information about your app/account.

You'll need your `SB-PUBLIC-KEY`, your `email` and `password`.

```shell
$> curl -H "SB-PUBLIC-KEY: 589273a7-11f5-4ddc-b064-233a6361f150" -XPOST -d '{"email": "ok@test.com", "password": "tsitLo"}'  http://localhost:8099/login
```

Change the `SB-PUBLIC-KEY`, `email`, and `password` values to match your own.

This command will return your session token. We need that token to perform 
any database operations.

```shell
$> curl -H "SB-PUBLIC-KEY: your-pk-here" \
 -H "Authorization: Bearer eyJ...super-long-token-here" \
 -XPOST -d '{"name": "task name", "done": false}' \
 http://localhost:8099/db/tasks
```

Replace the values of the `SB-PUBLIC-KEY` and the `Authorization` token you got 
from the login above.

This will return the created database record:

```
{"accountId":"150da7c4-75b5-400e-9218-9b51c4a22898",
"done":false,
"id":"f819da77-7d06-446e-b8c2-34563246a195",
"name":"task name"}
```

Notice that StaticBackend added an `accountId` and an `id` automatically.

**8. Verify that the record is in PostgreSQL**:

```
postgres=# SELECT * FROM syqlsxsnhmx9.tasks;
id                  | 
account_id          |
owner_id            |
data                |
created           
+-------------------
-------------------+----------------------------
 f819da77-7d06-446e-b8c2-34563246a195 | 
 150da7c4-75b5-400e-9218-9b51c4a22898 | 
 75893c04-f841-4743-8071-7d605aef93dc | 
 {"done": false, "name": "task name"} | 
 2022-02-19 13:07:04.123959
(1 row)
```

Replace the `syqlsxsnhmx9` schema name with your name.

We can see that StaticBackend creates a table with `id`, `account_id`,  
`owner_id`, and `created` fields automatically.

The JSON sent is saved in a column named `data` as type `JSONB`.

That's how you'd use StaticBackend with a PostgreSQL database.

Your feedback is very appreciated. Do not hesitate to reach out to me on 
[Twitter](https://twitter.com/dominicstpierre) or 
[GitHub](https://github.com/staticbackendhq/core).

Happy coding.