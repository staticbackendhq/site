+++
title = "Submit forms"

docsub = "Capture form submission"
submenu = "form"
+++

You can submit HTML forms without authenticating the request. It's useful for 
marketing website forms and other public HTML forms.

### Submit HTML forms

All form submissions can be viewed with the CLI or via StaticBackend's web 
console.

**HTTP request**:

`POST /postform/{form-name}`

**Format**: application/x-www-form-urlencoded

**Example**:

{{< langtabs >}}
```bash
curl -H "Content-Type: application/x-www-form-urlencoded" \
     -H "SB-PUBLIC-KEY: your-pub-key" \
     -X POST \
     -d 'val1=123&val2=abc' \
     https://na1.staticbackend.com/postform/a-form-name-here
```
```javascript
var form = document.getElementById("signup");
form.onsubmit = function(e) {
  e.preventDefault();
  e.stopPropagation();

  var email = document.getElementById("email").value;
  var using = document.getElementById("using").value;

  var data = "email=" + encodeURIComponent(email);
  data += "&using=" + encodeURIComponent(using);

  fetch("https://na1.staticbackend.com/postform/waiting-list",
  {
    body: data,
    headers: {
      "SB-PUBLIC-KEY": "your-public-key",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    method: "POST"
  }).then((res) => {
    window.location = "/signup/thankyou";
  }).catch((err) => {
    console.error(err);
  });
}
```
```go
// no current function in the Go CLI to submit forms
```

**Response**:

`HTTP 200` for success or `HTTP 500` for an error.