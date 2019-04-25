import { onload } from "./misc.js";
import { render } from "react-dom";
import Root from "./root.jsx";

onload(() => {
  try {
    require("./ninja.onload.js");
  } catch (e) {}
  render(<Root />, document.getElementsByTagName("body"));
});
