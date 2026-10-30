const test = require("node:test");
const assert = require("node:assert/strict");
const { Database } = require("../../src/infrastructure/database/database");
const SQLiteAppointmentRepository = require("../../src/infrastructure/repositories/SQLiteAppointmentRepository");
const { AppointmentConflictError } = require("../../src/domain/errors");

const appointment = {
  id: "appointment-1",
  clientName: "Ana Silva",
  service: "Consulta",
  appointmentDate: "2026-10-30",
  appointmentTime: "11:00",
  notes: "",
  createdAt: "2026-10-01T12:00:00.000Z",
  updatedAt: "2026-10-01T12:00:00.000Z",
};

test("persists, finds, orders, updates, and deletes appointments in SQLite", async (t) => {
  const database = new Database(":memory:");
  t.after(() => database.close());
  const repository = new SQLiteAppointmentRepository(database);

  await repository.create(appointment);
  await repository.create({
    ...appointment,
    id: "appointment-2",
    appointmentTime: "09:00",
  });

  assert.equal(
    (await repository.findById(appointment.id)).clientName,
    "Ana Silva",
  );
  assert.deepEqual(
    (await repository.findAll()).map((item) => item.appointmentTime),
    ["09:00", "11:00"],
  );
  assert.equal(
    (
      await repository.findByDateAndTime(
        appointment.appointmentDate,
        appointment.appointmentTime,
      )
    ).id,
    appointment.id,
  );

  await repository.update({ ...appointment, clientName: "Beatriz" });
  assert.equal(
    (await repository.findById(appointment.id)).clientName,
    "Beatriz",
  );
  assert.equal(await repository.delete(appointment.id), true);
  assert.equal(await repository.findById(appointment.id), null);
});

test("enforces unique appointment slots in the database", async (t) => {
  const database = new Database(":memory:");
  t.after(() => database.close());
  const repository = new SQLiteAppointmentRepository(database);
  await repository.create(appointment);

  await assert.rejects(
    repository.create({ ...appointment, id: "appointment-2" }),
    AppointmentConflictError,
  );
});

test("uses a parameterized repository contract for appointment lookup", async (t) => {
  const database = new Database(":memory:");
  t.after(() => database.close());
  const repository = new SQLiteAppointmentRepository(database);
  await repository.create(appointment);

  assert.equal(
    await repository.findByDateAndTime(
      appointment.appointmentDate,
      appointment.appointmentTime,
      appointment.id,
    ),
    null,
  );
});
