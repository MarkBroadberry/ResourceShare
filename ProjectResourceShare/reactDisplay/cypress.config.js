const { defineConfig } = require("cypress");

module.exports = defineConfig({
component: {},

env: {

baseUrl: "http://localhost:8000",
},

e2e: {
supportFolder: false,
supportFile: false,
specPattern: "src/tests/e2e/**/*.spec.js",

setupNodeEvents(on, config) {

},

baseUrl: "http://localhost:8000",
},
})