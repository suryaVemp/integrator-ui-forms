#!/usr/bin/env node

var cp = require("child_process");
var os = require("os");

var npmCmd = os.platform().startsWith("win") ? "npm.cmd" : "npm";

const runCommand = function(command, args, options = {}) {
  console.log(
    "EXECUTING COMMAND:",
    npmCmd,
    args.join(" "),
    "( path:",
    options.path || process.cwd(),
    ")"
  );

  const { error, statusCode } = cp.spawnSync(npmCmd, args, {
    env: process.env,
    cwd: options.path,
    stdio: [
      process.stdin,
      process.stdout,
      options.ignoreErrors ? "ignore" : process.stderr
    ]
  });

  if (statusCode !== 0 && options.ignoreErrors) {
    console.warn("Command had errors, but ignoring.");
    console.error(error);
  }
};

const alreadyExecuted = process.env["LERNA_EXECUTED"];
console.log("Already executed flag ", alreadyExecuted);

if (!alreadyExecuted) {
  process.env["LERNA_EXECUTED"] = true;
  console.log("Running lerna bootstrap");
  runCommand(npmCmd, ["run", "bootstrap"], {});
  console.log("Building the application");
  runCommand(npmCmd, ["run", "build"], {});
}
/*
//Not very sure if this is necessary will this
console.log(
  "Clear the lerna env variable for good when it finally exits this script"
);
process.env["LERNA_EXECUTED"] = null;
*/
