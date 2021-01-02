+++
title = "Database as a service"

comptitle = "Database"
compsub = "A scalable database managed for you."
submenu = "db"
+++

A web or mobile application that would not save any data to a database would be 
boring. Managing, backing up, and scaling database servers are stealing precious 
time from building your application.

We're offering a 100% done-for-you database as a service where we handle your 
backend infrastructure, including a scalable and secure database.

We currently support the following features:

* Create, retrieve, update, and delete documents.
* Query documents based on a set of operators.
* Configure granular permissions for reading and writing operations.
* Use our CLI to manage your database.

### Repositories are indexed per account by default

Another aspect you can free your mind off is database indexes. By default, all 
your repositories have an index on the `accountId` field.

We have processes in place to have indexes on the fields you're querying the 
most. At this moment, you cannot handle indexes. It's fully managed for you.

### Granular permissions

All documents created have an owner and is linked with the AccountID of that user. By default, all users inside the same account can read documents. Only the owner can edit and delete their documents.

You may decide to have specifics permissions per repository. For instance, you may want only the document owner to read and write. Or you may want to let all users inside an account read and write. You have full control over permissions per level. Refer to our documentation for more details.


Next component is [file storage](/components/storage).