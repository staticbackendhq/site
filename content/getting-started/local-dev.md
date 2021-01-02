+++
title			= "Local development"

gsmenu = "local"
+++

### Starting the server

We've built a development server that has an exact mapping of the production 
API.

You can build your application against StaticBackend without paying a 
subscription while you're in the build phase.

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

### No data persistence

The development database has no data persistence. When the server has stopped, 
the data you've added and modified is destroyed.

Let us know if you'd like to have an option to persist your data from server 
restarts. We're still in beta and are curious to know what makes your 
experience better.

### Limitations

The `/query/table-name` endpoint only supports equal and not equal clauses.

You can still use `>`, `<=`, etc, but they will not have an effect on the 
filtering of results.