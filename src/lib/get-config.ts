require("dotenv").config();

function hasConfig(env = process.env) {
  return (
    "TESTRAIL_HOST" in env ||
    "TESTRAIL_USERNAME" in env ||
    "TESTRAIL_PASSWORD" in env ||
    "TESTRAIL_PROJECTID" in env
  );
}

function safelyParseJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
}

export function getTestRailConfig(env = process.env) {
  if (!env.TESTRAIL_HOST) {
    throw new Error("TESTRAIL_HOST is required");
  }
  if (!env.TESTRAIL_USERNAME) {
    throw new Error("TESTRAIL_USERNAME is required");
  }
  if (!env.TESTRAIL_PASSWORD) {
    throw new Error("TESTRAIL_PASSWORD is required. Could be an API key.");
  }
  if (!env.TESTRAIL_PROJECTID) {
    throw new Error("TESTRAIL_PROJECTID is required.");
  }

  if (!env.TESTRAIL_HOST.startsWith("https://")) {
    throw new Error(`TESTRAIL_HOST should start with "https://`);
  }

  const testRailInfo = {
    host: process.env.TESTRAIL_HOST,
    username: process.env.TESTRAIL_USERNAME,
    password: process.env.TESTRAIL_PASSWORD,
    projectId: process.env.TESTRAIL_PROJECTID,
    suiteId: process.env.TESTRAIL_SUITEID,
    runName: process.env.TESTRAIL_RUNNAME,
    statusOverride: safelyParseJson(process.env.TESTRAIL_STATUS_OVERRIDE),
  };

  return testRailInfo;
}

export function getAuthorization(testRailInfo) {
  const authorization = `Basic ${Buffer.from(
    `${testRailInfo.username}:${testRailInfo.password}`
  ).toString("base64")}`;
  return authorization;
}

export default {
  hasConfig,
  getTestRailConfig,
  getAuthorization,
};
