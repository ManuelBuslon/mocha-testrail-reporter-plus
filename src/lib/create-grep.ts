export function createGrep(args = {}) {
  let tagExp = "";
  let notTagExp = "";
  let usingTags = false;
  let onlyNegative = false;
  if (args["tags"]) {
    const tagged = args["tags"].replaceAll(",", "|");
    tagExp = `.*?(${tagged})`;
    usingTags = true;
  }
  if (args["excludeTags"]) {
    const excludeTags = args["excludeTags"].replaceAll(",", "|");
    notTagExp = `(?!(.*(${excludeTags})))`;
    if (!usingTags) {
      onlyNegative = true;
    }
    usingTags = true;
  }
  const expression = usingTags
    ? `${onlyNegative ? "^(?!.*@)|" : ""}@${notTagExp}${tagExp}`
    : ".*";
  return expression;
}
