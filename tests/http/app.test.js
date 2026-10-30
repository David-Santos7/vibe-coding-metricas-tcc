const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { Database } = require("../../src/infrastructure/database/database");
const { createCompositionRoot } = require("../../src/main/compositionRoot");
const { createApp } = require("../../src/main/app");

const clock = () => new Date("2026-10-30T13:00:00.000Z");
const validInput = {
  clientName: "Ana Silva",
  service: "Consulta",
  appointmentDate: "2026-10-30",
  appointmentTime: "11:00",
  notes: "Primeira consulta",
};

function setup(t, overrides = {}) {
  const database = new Database(":memory:");
  t.after(() => database.close());
  const composition = createCompositionRoot({ database, clock });
  Object.assign(composition, overrides);
  return createApp(composition);
}

test("renders the home, listing, and new appointment form", async (t) => {
  const app = setup(t);

  assert.equal((await request(app).get("/")).status, 200);
  assert.equal((await request(app).get("/appointments")).status, 200);
  const form = await request(app).get("/appointments/new");
  assert.equal(form.status, 200);
  assert.match(form.text, /<label/);
});

test("creates, views, edits, and deletes an appointment over HTTP", async (t) => {
  const app = setup(t);
  const created = await request(app).post("/appointments").type("form").send(validInput);

  assert.equal(created.status, 303);
  const id = created.headers.location.match(/\/appointments\/([^/]+)$/)[1];

  const details = await request(app).get(`/appointments/${id}`);
  assert.equal(details.status, 200);
  assert.match(details.text, /Ana Silva/);

  const edit = await request(app).get(`/appointments/${id}/edit`);
  assert.equal(edit.status, 200);

  const updated = await request(app)
    .post(`/appointments/${id}/update`)
    .type("form")
    .send({ ...validInput, clientName: "Beatriz", appointmentTime: "12:00" });
  assert.equal(updated.status, 303);
  assert.match(
    (await request(app).get(`/appointments/${id}`)).text,
    /Beatriz/,
  );

  const deleted = await request(app).post(`/appointments/${id}/delete`);
  assert.equal(deleted.status, 303);
  assert.equal((await request(app).get(`/appointments/${id}`)).status, 404);
});

test("maps validation, conflict, and missing records to HTTP status codes", async (t) => {
  const app = setup(t);
  const invalid = await request(app)
    .post("/appointments")
    .type("form")
    .send({ ...validInput, clientName: " " });
  assert.equal(invalid.status, 400);
  assert.match(invalid.text, /Nome do cliente/);

  await request(app).post("/appointments").type("form").send(validInput);
  const duplicate = await request(app)
    .post("/appointments")
    .type("form")
    .send(validInput);
  assert.equal(duplicate.status, 409);

  assert.equal((await request(app).get("/appointments/missing")).status, 404);
});

test("does not expose unexpected error details", async (t) => {
  const app = setup(t, {
    listAppointments: {
      execute: async () => {
        throw new Error("private database detail");
      },
    },
  });
  const response = await request(app).get("/appointments");

  assert.equal(response.status, 500);
  assert.doesNotMatch(response.text, /private database detail|at Error/);
});

test("adds security headers", async (t) => {
  const response = await request(setup(t)).get("/");

  assert.ok(response.headers["content-security-policy"]);
});
