const fs = require("node:fs");
const path = require("node:path");
const DatabaseConnection = require("better-sqlite3");

const schemaPath = path.join(__dirname, "schema.sql");

class Database {
  constructor(filename = path.join(process.cwd(), "data", "appointments.db")) {
    if (filename !== ":memory:") {
      fs.mkdirSync(path.dirname(filename), { recursive: true });
    }

    this.connection = new DatabaseConnection(filename);
    this.connection.pragma("foreign_keys = ON");
    this.connection.exec(fs.readFileSync(schemaPath, "utf8"));
  }

  close() {
    this.connection.close();
  }
}

module.exports = { Database };
