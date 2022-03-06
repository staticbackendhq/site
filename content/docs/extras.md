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