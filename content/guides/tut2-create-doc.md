+++
title = "Tutorial 2: Create documents"

docsub = "You have collections of documents as data structure."
submenu = "tut2"

metadesc = "Learn how to create document via StaticBackend API."
+++

Each of your document are saved as-is inside a collection (sometimes called a 
repository).

The API will add system properties to your raw object. Fields like `id`, 
`accountId`, `ownerId` and `sb_created` are reserved property names and will 
always be filled server-side.

By default, users of same account can `read` their account documents. 
Make sure to check out the [permissions & security documentation](/docs/database/#permissions).