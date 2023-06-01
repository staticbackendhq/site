+++
title = "Interactive tutrials"

docsub = "Run code against your running instance."
submenu = "intro"

metadesc = "How to run StaticBackend tutorials against a locally running instance."
+++

The tutorials expect that a StaticBackend API is running on **localhost:8099**.

You may install the [CLI](/getting-started/cli/) and run your own instance like so:

```sh
$ npm i -g @staticbackend/cli
$ backend server
```

Feel free to play with the tutorial code and click the "Execute code" button.

The tutorials use the in-browser JavaScript library:

```html
<script src="backend.js"></script>
```

This library works without the need to bundle or `import` anything.

Next: [Tutorial 1: Login](/guides/tut1-login)