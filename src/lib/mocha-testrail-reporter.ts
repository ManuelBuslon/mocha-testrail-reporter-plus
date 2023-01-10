import { reporters } from "mocha";
import { TestRail } from "./testrail";
import {
  findCases,
  findReporterOptions,
  findSpecs,
  getTestCases,
} from "./shared";
import { Status, TestRailOptions, TestRailResult } from "./testrail.interface";

export class MochaTestRailReporter extends reporters.Spec {
  private results: TestRailResult[] = [];
  private caseIdsRun: number[] = [];

  constructor(runner: any, options: any) {
    super(runner);

    const reporterOptions: TestRailOptions = findReporterOptions(options);

    runner.on("start", () => {
      console.log("Starting reporter");
      const specs = findSpecs(reporterOptions.spec);
      this.caseIdsRun = findCases(
        specs,
        (reporterOptions["--tags"] || "").split(","),
        (reporterOptions["--excludeTags"] || "").split(",")
      );
    });

    runner.on("test end", (test) => {
      let caseIds = getTestCases(test.title);
      if (caseIds.length > 0) {
        if (test.speed === "fast") {
          let results = caseIds.map((caseId) => {
            return {
              case_id: caseId,
              status_id: Status[test.state],
              comment: test.title,
            };
          });
          this.results.push(...results);
        } else {
          let results = caseIds.map((caseId) => {
            return {
              case_id: caseId,
              status_id: Status[test.state],
              comment: `${test.title} (${test.duration}ms)`,
            };
          });
          this.results.push(...results);
        }
      }
    });

    runner.on("end", () => {
      if (this.results.length == 0) {
        console.warn(
          "No testcases were matched. Ensure that your tests are declared correctly and matches TCxxx"
        );
      }
      new TestRail(reporterOptions).publish(this.caseIdsRun, this.results);
    });
  }

  private static validate(options: TestRailOptions, name: string) {
    if (options == null) {
      throw new Error("Missing --reporter-options in mocha.opts");
    }
    if (options[name] == null) {
      throw new Error(
        `Missing ${name} value. Please update --reporter-options in mocha.opts`
      );
    }
  }
}
