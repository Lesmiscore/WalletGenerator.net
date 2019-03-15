function onload(func) {
  if (window.attachEvent) {
    window.attachEvent("onload", func);
  } else if (window.onload) {
    let curronload = window.onload;
    let newonload = function(evt) {
      curronload(evt);
      func(evt);
    };
    window.onload = newonload;
  } else {
    window.onload = func;
  }
}

// should I export ninja here?

onload(() => {
  require("./handlers.js");
  require("./ninja.seeder.js");
  require("./ninja.onload.js");
});
