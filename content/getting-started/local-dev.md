+++
title			= "Local development"

gsmenu = "local"
+++

### Starting the server

We've built a development server that has an exact mapping of the production 
API.

You may develop your application locally and deploy to your self-hosted 
StaticBackend API server or use our managed services.

Make sure your current working directory is the root of your project and run 
the following command:

```bash
backend server
```

By default the server listen on port `8099`. You can change that by passing 
a port to the `server` command:

```bash
backend server -p 8088
```

### Ddata persistence

By default, the development server will use a non-persistant in-memory database.
All data will be removed when the server shutdowns.

To persist your development data across restarts, use the following flag:

```bash
$ backend server --persist-data
```

### Limitations

The in-memory database provider have some slight limitations regarding querying 
of data using `in` and `!in` operators.

For a full experience uses the `--persist-data` which uses SQLite as database 
engine and all query operators are supported.