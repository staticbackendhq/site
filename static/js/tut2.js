codeEditor.value = `
(async () => {
  const person = {
    firstName: "Dominic",
    lastName: "St-Pierre",
    project: "StaticBackend"
  }

  const res = await bkn.create(token, "people", person);
  if (!res.ok) {
    console.log("API returns an error, make sure you have the API running")
    console.log(res.content);
    return;
  }
  console.log(res.content);
})()`;
