codeEditor.value = `
var bkn = new sb.Backend("dev_memory_pk", "dev");
(async () => {
  const res = await bkn.login("admin@dev.com", "devpw1234");
  if (!res.ok) {
    console.log(res.content);
    return;
  }
  console.log("session token");
  console.log(res.content);
  sessionStorage.setItem("token", res.content);
})();
`;
