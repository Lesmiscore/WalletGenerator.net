const { onload } = require("./misc.js");
const { render } = require("react-dom");

onload(() => {
  require("./ninja.onload.js");
  render(<Root />, document.getElementsByTagName("body"));
});
