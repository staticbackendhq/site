+++
title = "Extra functions"

docsub = "We go one step further and provide common web/mobile apps functionalities."
submenu = "extra"
+++

StaticBackend's goal is to provide all the building blocks you need to build 
your applications. We're not just stopping at the database.

The `extra` endpoints implement useful functionalities that web and mobile 
applications need.

### Resize images

**HTTP request**:

`POST /extra/resizeimg`

**Format**: multipart/form-data

**Body**:

name | type | description
----:|:-----|:------------
file | `file` | Image to resize (.png or .jpg)
width | `number` | Maximum width for the resized image


**Example**:

{{< langtabs >}}
```javascript
// the form must have an <input type="file" name="file">
let form = document.getElementById("your-form");
// 640 is the maximum width for the resized image
const res = await bkn.resizeImage(token, 640, form);
if (!res.ok) {
  console.error(res.content);
  return
}

console.log(`file id ${res.content.id} resized img url: ${res.content.url}`);
```
```go
file, _, err := r.FormFile("uploaded-file")
result, err := backend.ResizeImage(token, 640, file)
fmt.Println("ID", result.ID, "URL", result.URL)
```
```bash
n/a
```

**Response**:

```json
{
  "accountId":"5e184d95b1374eaf8b994bf3",
  "done":false,
  "id":"5e185aceb1374eaf8b994bf6",
  "url":"https://url-for-the-resized-image.jpg"
}
```

### Convert URL (web page) to PDF or PNG

**HTTP request**:

`POST /extra/htmltox`

**Format**: JSON

**Body**:

name | type | description
----:|:-----|:------------
toPDF | `bool` | Output is a PDF, otherwise PNG if `false`
url | `string` | A publicaly available URL
fullpage | `string` | For PNG, indicates if the screenshot takes the entire page.


**Example**:

{{< langtabs >}}
```javascript
let data = {
  toPDF: true,
  url: "https://staticbackend.com
};
const res = await bkn.convertURLToX(token, data);
if (!res.ok) {
  //handle error res.content
  return;
}
// file id: res.content.id
// file url: res.content.url
```
```go
data := backend.ConvertParam{
  ToPDF: true,
  URL: "https://staticbackend.com",
}
result, err := backend.ConvertURLToX(token, data)
if err != nil {
  //handle error
}
fmt.Println("file id: ", res.ID)
fmt.Println("file URL: ", res.URL)
```
```bash
curl -H "Content-Type: application/json" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -H "Authorization: Bearer user-token" \
     -X POST \
     -d '{"toPDF": true, "url": "https://staticbackend.com"}' \
     https://na1.staticbackend.com/extra/htmltox
```

**Response**:

```json
{
  "accountId":"5e184d95b1374eaf8b994bf3",
  "done":false,
  "id":"5e185aceb1374eaf8b994bf6",
  "url":"https://url-of-the-converted-output.pdf"
}
```