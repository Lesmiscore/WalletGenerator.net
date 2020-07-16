if (!global.document || !global.window) {
  global.__fakeDocument = true;
  global.window = global;
  window.attachEvent = () => {};
  global.document = {
    createElement: () => {
      return {};
    },
    attachEvent: () => {},
  };
}
