function onload(func) {
  if (window.attachEvent) {
    window.attachEvent("onload", func);
  } else if (window.onload) {
    var curronload = window.onload;
    var newonload = function(evt) {
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
  require("./ninja.seeder.js");
  require("./ninja.onload.js");
});
