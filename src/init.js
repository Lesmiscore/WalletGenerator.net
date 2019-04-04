const { onload } = require("./misc.js");

onload(() => {
  require("./handlers.js");
  require("./ninja.onload.js");
  require("./ninja.seeder.js");
});
