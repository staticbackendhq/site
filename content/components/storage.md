+++
title = "File storage with content delivery"

comptitle = "File storage"
compsub = "Serve users' files via a content delivery network."
submenu = "storage"
+++

Upload and serve images, documents, and files effortlessly. Profile pictures, attachments, PDFs, and media hosting all handled for you.

Files are served from a CDN (content delivery network), so they load fast for users anywhere in the world.

### Upload files in seconds

```javascript
// Upload a file from an input element
const fileInput = document.querySelector('#avatar');
const file = fileInput.files[0];

const result = await backend.uploadFile(authToken, file);
// Returns: { url: 'https://cdn.example.com/files/abc123.jpg' }

// Save the URL to your database
await backend.create(authToken, 'users', {
  name: 'John',
  avatar: result.url
});
```

The file is immediately available at the returned URL. No storage buckets to configure. No CDN setup required.

### What you can build

- **Profile pictures** - User avatars and photos
- **Document uploads** - PDFs, spreadsheets, presentations
- **Media galleries** - Photo and video collections
- **File attachments** - Support tickets, messages, notes
- **Content management** - Blog images, product photos

### How it works

Upload files directly from your frontend. The file is:

1. Stored securely in cloud storage
2. Made available via CDN for fast global delivery
3. Returns a public URL you can use immediately

Store the URL in your database alongside your data. Display it in your app like any other image or file.

### File management

**Delete files** - Remove files using their URL when no longer needed:

```javascript
await backend.deleteFile(authToken, fileUrl);
```

**Track usage** - Your plan includes storage limits. Monitor usage through your dashboard.

**Cleanup** - Use our CLI to bulk-delete old files or orphaned uploads.

### Supported file types

Upload any file type:
- Images (JPG, PNG, GIF, WebP, SVG)
- Documents (PDF, DOCX, XLSX, TXT)
- Media (MP4, MP3, MOV)
- Archives (ZIP, TAR)

File size limits depend on your plan. Check your dashboard for current limits.

→ [View storage documentation](/docs/storage) for detailed API reference and advanced features.

Next component is [WebSockets](/components/websocket).