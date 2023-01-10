const unirest = require("unirest");
import { TestRailOptions, TestRailResult } from "./testrail.interface";
import { getTestRailConfig, getAuthorization } from "./get-config";
const branch = require("git-branch");
const gitCommitInfo = require("git-commit-info");
/**
 * TestRail basic API wrapper
 */
export class TestRail {
  private base: String;
  private testRailInfo;
  private authorization;
  private includeLastCommit;

  constructor(private options: TestRailOptions) {
    this.testRailInfo = getTestRailConfig(process.env);
    this.authorization = getAuthorization(this.testRailInfo);
    this.base = `${this.testRailInfo.host}/index.php?/api/v2`;
    this.includeLastCommit = options["includeLastCommit"] || false;
  }

  private _post(api: String, body: any, callback: Function, error?: Function) {
    unirest
      .post(`${this.base}/${api}`)
      .headers({
        "content-type": "application/json",
        Authorization: this.authorization,
      })
      .type("json")
      .send(body)
      .end((res) => {
        if (res.error) {
          console.log("Error: %s", JSON.stringify(res.body));
          if (error) {
            error(res.error);
          } else {
            throw new Error(res.error);
          }
        }
        callback(res.body);
      });
  }

  /**
   * Publishes results of execution of an automated test run
   * @param {string} name
   * @param {string} description
   * @param {TestRailResult[]} results
   * @param {Function} callback
   */
  public publish(
    caseIds: number[],
    results: TestRailResult[],
    addToName: string,
    callback?: Function
  ) {
    console.log(`Publishing ${results.length} test result(s) to ${this.base}`);

    let executionDateTime = new Date().toISOString();
    let lastCommit = "";
    if (this.includeLastCommit) {
      lastCommit = `${branch.sync()}-${gitCommitInfo().shortHash}`;
    }
    const name = `${
      this.testRailInfo.runName || "Automation run"
    } ${addToName}-${lastCommit} ${executionDateTime}`;
    console.log(name);

    let requestBody: {
      suite_id: string;
      name: string;
      include_all: boolean;
      assignedto_id?: string;
      case_ids?: number[];
    } = {
      suite_id: this.testRailInfo.suiteId,
      name: name,
      include_all: true,
    };
    if (caseIds && caseIds.length > 0) {
      const uniqueCaseIds = [...new Set(caseIds)];
      requestBody.include_all = false;
      requestBody.case_ids = uniqueCaseIds;
    }

    this._post(
      `add_run/${this.testRailInfo.projectId}`,
      requestBody,
      (body) => {
        const runId = body.id;
        console.log(`Results published to ${this.base}?/runs/view/${runId}`);
        this._post(
          `add_results_for_cases/${runId}`,
          {
            results: results,
          },
          (body) => {
            // execute callback if specified
            if (callback) {
              callback(body);
            }
          }
        );
      }
    );
  }
}
