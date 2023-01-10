#Testrail Reporter for Mocha

Pushes test results into Testrail system.

## Installation

```shell
$ npm i mocha-testrail-reporter-plus --save-dev
```

## Usage
Ensure that your testrail installation API is enabled and generate your API keys. See http://docs.gurock.com/

Run mocha with `mocha-testrail-reporter-plus`:

Configure the mocharc.cjs to look like this:

```"use strict";

const { createGrep, parseArgs } = require("mocha-testrail-reporter-plus/modules");
const args = parseArgs(process.argv);
const spec = "src/**/*.spec.ts";

module.exports = {
  extension: ["ts"],
  loader: "ts-node/esm",
  spec: spec,
  timeout: 100000,
  grep: createGrep(args),
  ...(args["--testrail"] && {
    reporter: "mocha-testrail-reporter-plus",
    reporterOptions: { includeLastCommit: true, spec: spec, ...args },
  }),
};
```

* It is necessary to include --testrail in order to report

Mark your mocha test names with ID of Testrail test cases. Ensure that your case ids are well distinct from test descriptions.
 
```Javascript
it("C123 C124 Authenticate with invalid user", () => {})
it("Authenticate a valid user C321", () => {})
```

Only passed or failed tests will be published. Skipped or pending tests will not be published resulting in a "Pending" status in testrail test run.

## Tags

It is possible to use tags for positive or negative matching of tests with the --tags and --excludeTags parameters

### Examples

`it("C321 Authenticate a valid user -@ Smoke,Login", () => {})`

    --tags Smoke,Development

    --excludeTags Production,Bug

For more information about tags refer to [Tags system](https://github.com/ManuelBuslon/find-test-names/tree/mocha-version)


## Options in .env

**TESTRAIL_HOST**: *string* domain name of your Testrail instance (e.g. for a hosted instance instance.testrail.net)

**TESTRAIL_USERNAME**: *string* user under which the test run will be created (e.g. jenkins or ci)

**TESTRAIL_PASSWORD**: *string* password or API token for user

**TESTRAIL_PROJECTID**: *number* projet number with which the tests are associated

**TESTRAIL_SUITEID**: *number* suite number with which the tests are associated

**TESTRAIL_RUNNAME**: *string* run name 

## References
- http://mochajs.org/#mochaopts
- https://github.com/mochajs/mocha/wiki/Third-party-reporters
- http://docs.gurock.com/testrail-api2/start


## Acknowledgments

Pierre Awaragi, owner of the mocha-testrail-reporter.