module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    combine: {
      src: {
        input: "./src/index.html",
        output: "./index.html",
        tokens: [
          { token: "//exported.js", file: "./src/exported.js" },
          { token: "/\\*main.css\\*/", file: "./src/main.css" }
        ]
      }
    }
  });

  grunt.file.defaultEncoding = "utf-8";
  grunt.loadNpmTasks("grunt-combine");
  grunt.registerTask("default", ["combine:src"]);
};
