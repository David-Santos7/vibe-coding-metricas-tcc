require("dotenv").config();

const path = require("node:path");
const { Database } = require("../infrastructure/database/database");
const { createApp } = require("./app");
const { createCompositionRoot } = require("./compositionRoot");

const database = new Database(
  process.env.DB_FILE || path.join(process.cwd(), "data", "appointments.db"),
);
const app = createApp(createCompositionRoot({ database }));
const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`Sistema de agendamentos disponível na porta ${port}.`);
});

function shutdown() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
