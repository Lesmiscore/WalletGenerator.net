global.window = global;
window.attachEvent = () => {};
global.document = {
  createElement: () => {
    return {};
  },
  attachEvent: () => {}
};
