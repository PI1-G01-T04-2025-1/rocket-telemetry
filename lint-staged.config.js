/* eslint-env node */
const path = require("path");
const formatCommand =
  "prettier --check --config ./.prettierrc.json --ignore-path ./.prettierignore";

module.exports = {
  "./src/**/*": formatCommand,
};