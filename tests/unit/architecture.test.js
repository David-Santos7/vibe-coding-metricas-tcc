const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const sourceRoot = path.join(__dirname, "..", "..", "src");

function filesUnder(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(filePath) : [filePath];
  });
}

test("domain and application do not depend on delivery or persistence frameworks", () => {
  const coreFiles = [
    ...filesUnder(path.join(sourceRoot, "domain")),
    ...filesUnder(path.join(sourceRoot, "application")),
  ];
  const forbidden = /require\(["'](?:express|ejs|better-sqlite3)["']\)/;

  for (const filePath of coreFiles) {
    assert.doesNotMatch(fs.readFileSync(filePath, "utf8"), forbidden, filePath);
  }
});
