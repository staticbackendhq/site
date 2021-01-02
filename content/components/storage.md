+++
title = "File storage with content delivery"

comptitle = "File storage"
compsub = "Serve users' files via a content delivery network."
submenu = "storage"
+++

Your account includes file storage backed by a CDN, making sure your users load 
files from the closest server to them. It dramatically improves performance for 
your users.

Your plan dictates the size of the file you may upload and the total amount of 
gigabytes you can use.

You can use our CLI to clean up old files or files uploaded from deleted 
accounts.

### Uploading files

You receive the public URL for the file once the upload process is complete. 
You may store this file in a document for further displaying later in your 
application.

You may use this URL to delete files later. It's a good practice to delete all 
files a user uploaded when they delete their account. Don't worry about sending 
multiple delete requests. They are all queued and process independently.

Next component is the [WebSockets](/components/websocket).