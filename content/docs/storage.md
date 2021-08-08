+++
title = "File storage"

docsub = "Already setup with a global CDN"
submenu = "storage"
+++

You can upload files and receive a link that uses our CDN to make sure content 
is close to your users.

### Upload files

Upload a file. Maximum file size depends on your plan.

**HTTP request**:

`POST /storage/upload`

**Format**: multipart/form-data

**Example**:

```javascript
document.querySelector('#file').addEventListener('change', event => {
  handleFileUpload(event);
});

const handleFileUpload = (event) => {
  const files = event.target.files;
  const formData = new FormData();
  formData.append('file', files[0]);

  fetch("https://ca1.staticbackend.com/storage/upload", {
		headers: {
      "SB-PUBLIC-KEY": "your-public-key",
      "Authorization": "Bearer user's JWT"
    },
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(fileURL => {
    console.log(fileURL);
  })
  .catch(error => {
    console.error(error);
  });
}
```
```go
file, _, err := r.FormFile("uploaded-file")
result, err := backend.StoreFile(token, file)
fmt.Println("ID", result.ID, "URL", result.URL)
```

**Response**:

```json
{
  "id": "unique id to store for later deletion",
  "url": "https://cdn.staticbackend.com/{id}/{repo}/{fileid}.ext"
```
