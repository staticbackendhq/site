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

**Format**: multipart/form-data

**Example**:

```javascript
var form = document.getElementById("signup");
form.onsubmit = function(e) {
  e.preventDefault();
  e.stopPropagation();

  var data = new FormData();
  data.append("email", document.getElementById("email").value);
  data.append("using", document.getElementById("using").value);

  fetch("https://na1.staticbackend.com/postform/waiting-list",
  {
    body: data,
    headers: {
      "SB-PUBLIC-KEY": "your-public-key",
    },
    method: "POST"
  }).then((res) => {
    window.location = "/signup/thankyou";
  }).catch((err) => {
    console.error(err);
  });
}
```

**Response**:

`HTTP 200` for success or `HTTP 500` for an error.