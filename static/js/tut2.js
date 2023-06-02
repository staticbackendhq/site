codeEditor.value = `
(async () => {
  const res = await bkn.addUser(token, "user2@doamin.com", "passwd123");
  if (!res.ok) {
    console.log(res.content);
    return;
  }

  const res2 = await bkn.users(token);
  if (!res2.ok) {
    console.log(res2.content);
    return;
  }
  res2.each((u) => {
    console.log({e: u.email, role: u.role});
  });

})();
`;
