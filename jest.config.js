const path = require("path");

module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{js,jsx}",
        "!**/node_modules/**",
        "!**/coverage/**",
        "!**/vendor/**",
        "!babel.config.js",
        "!jest.config.js",
        "!webpack.config.js",
        "!src/index.js",
        "!src/js/constants.js",
        "!**src/js/utils/**",
        "!**/demo-server/**",
        "!**/src/js/container/History/EditAmount.jsx"

    ],
    setupFiles: [path.join(__dirname, 'setupTests.js')] 
}