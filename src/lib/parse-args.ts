const arg = require("arg");
export function parseArgs(argv: string[]) {
  let args = arg(
    {
      "--tags": String,
      "--excludeTags": String,
      "--testrail": Boolean,
    },
    { argv, permissive: true }
  );
  ["--tags", "--excludeTags"].forEach((option) => {
    if (!args[option]) {
      args[option] = "";
    }
  });
  if (!args["--testrail"]) {
    args["--testrail"] = false;
  }
  return args;
}
