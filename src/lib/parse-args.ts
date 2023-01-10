const arg = require("arg");
export function parseArgs(argv: string[]) {
  let args = arg(
    {
      "--tags": String,
      "--excludeTags": String,
      "--testrail": Boolean,
      "--addToName": String,
    },
    { argv, permissive: true }
  );
  ["--tags", "--excludeTags", "--addToName"].forEach((option) => {
    if (!args[option]) {
      args[option] = "";
    }
  });
  if (!args["--testrail"]) {
    args["--testrail"] = false;
  }
  return args;
}
