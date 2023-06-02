let token = "";
const bkn = new sb.Backend("dev_memory_pk", "dev");

const codeEditor = document.getElementById("code");
const result = document.getElementById("results");
const execCode = document.getElementById("exec-code");

(function () {
  const oldcl = console.log;
  console.log = function (args) {
    oldcl(args);

    let s = JSON.stringify(args, null, 2);
    result.textContent += s + "\n";
  };

  function str(args) {
    var s = "";
    if (typeof args === "object") {
      if (Array.isArray(args)) {
        s += "[\n";
        for (var i = 0; i <= args.length; i++) {
          s += str(args[i]);
        }
        s += "]\n";
      } else {
        s = objToStr(args);
      }
      return s;
    }

    return args.toString();
  }

  function objToStr(v) {
    var s = "{\n";
    for (var key in args) {
      s += ` ${key}: ${str(args[key])}\n`;
    }
    s += " }";
    return s;
  }
})();

execCode.addEventListener("click", function () {
  const code = codeEditor.value;
  result.textContent = "";
  tryCode(code);
});

function tryCode(code) {
  try {
    eval(code);
  } catch (ex) {
    console.log("error running the code:");
    console.log(ex);
  }
}

if (!sessionStorage.getItem("token")) {
  (async () => {
    const res = await bkn.login("admin@dev.com", "devpw1234");
    if (!res.ok) {
      alert(
        "You'll need a local API instance running to execute the tutorials."
      );
      return;
    }

    sessionStorage.setItem("token", res.content);
  })();
}

token = sessionStorage.getItem("token");
