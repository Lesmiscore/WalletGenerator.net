// onload is isolated to prevent from loading big libraries
module.exports = function onload(func) {
  if (window.attachEvent) {
    window.attachEvent("onload", func);
  } else if (window.onload) {
    let curronload = window.onload;
    let newonload = function (evt) {
      curronload(evt);
      func(evt);
    };
    window.onload = newonload;
  } else {
    window.onload = func;
  }
};
