import fs = require("fs");
import {
  getTestNames,
  filterByEffectiveTags,
} from "find-test-names-tags-mocha";
import * as globby from "globby";

/**
 * Returns the TestRail case id number (if any) from the given full test title
 * @param {string} testTitle
 */
export function getTestCases(testTitle): number[] {
  const re = /\bC(?<caseId>\d+)\b/g;
  const matches = [...testTitle.matchAll(re)];
  const ids = matches.map((m) => Number(m.groups.caseId));
  return uniqueSorted(ids);
}

export function findReporterOptions(options) {
  if (!options) {
    return {};
  }
  if (options.reporterOptions) {
    return options.reporterOptions;
  }
  // this is require to handle .mocharc.cjs files
  return Object.keys(options)
    .filter(function (key) {
      return key.indexOf("reporterOptions.") === 0;
    })
    .reduce(function (reporterOptions, key) {
      reporterOptions[key.substring("reporterOptions.".length)] = options[key];
      return reporterOptions;
    }, {});
}
/**
 * Gives an array, removes duplicates and sorts it
 */
function uniqueSorted(list: number[]): number[] {
  return Array.from(new Set(list)).sort();
}

export function findSpecs(pattern) {
  // @ts-ignore
  return globby.sync(pattern, {
    absolute: true,
  });
}

/**
 * Finds the test case IDs in the test titles.
 * @example "C101: Test case title" => "101"
 */
export function findCasesInSpec(
  spec,
  readSpec = fs.readFileSync,
  tagged,
  negativeTagged
): number[] {
  const source = readSpec(spec, "utf8");

  let testNames;
  if (Array.isArray(tagged) && tagged.length > 0) {
    const filteredTests = filterByEffectiveTags(source, tagged, negativeTagged);
    testNames = filteredTests.map((t) => t.name);
  } else {
    if (Array.isArray(negativeTagged) && negativeTagged.length > 0) {
      const filteredTests = filterByEffectiveTags(source, [], negativeTagged);
      testNames = filteredTests.map((t) => t.name);
    } else {
      const found = getTestNames(source);
      testNames = found.testNames;
    }
  }

  const ids = testNames
    .map(getTestCases)
    .reduce((a, b) => a.concat(b), [])
    .filter((id) => !isNaN(id));

  // make sure the test ids are unique
  return uniqueSorted(ids);
}

export function findCases(specs, tagged, negativeTagged): number[] {
  const readSpec = fs.readFileSync;
  let tags = tagged;
  let excludeTags = negativeTagged;
  if (tagged.length === 1 && tagged[0] === "") {
    tags = [];
  }
  if (tagged.length === 1 && tagged[0] === "") {
    excludeTags = [];
  }

  // find case Ids in each spec and flatten into a single array
  const allCaseIds: number[] = specs
    .map((spec) => findCasesInSpec(spec, readSpec, tags, excludeTags))
    .reduce((a, b) => a.concat(b), [])
    .filter((id) => !isNaN(id));
  const uniqueCaseIds = Array.from(new Set(allCaseIds)).sort();
  return uniqueCaseIds;
}

export default { findCases, getTestCases, findCasesInSpec };
