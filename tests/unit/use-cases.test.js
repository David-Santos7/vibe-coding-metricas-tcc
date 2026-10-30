const test = require("node:test");
const assert = require("node:assert/strict");
const InMemoryAppointmentRepository = require("../doubles/InMemoryAppointmentRepository");
const {
  CreateAppointment,
} = require("../../src/application/CreateAppointment");
const { GetAppointment } = require("../../src/application/GetAppointment");
const { ListAppointments } = require("../../src/application/ListAppointments");
const {
  UpdateAppointment,
} = require("../../src/application/UpdateAppointment");
const {
  DeleteAppointment,
} = require("../../src/application/DeleteAppointment");
const {
  AppointmentConflictError,
  AppointmentNotFoundError,
  ValidationError,
} = require("../../src/domain/errors");

const fixedNow = new Date("2026-10-30T13:00:00.000Z");
const validInput = {
  clientName: "Ana Silva",
  service: "Consulta",
  appointmentDate: "2026-10-30",
  appointmentTime: "11:00",
  notes: "",
};

function createContext() {
  const repository = new InMemoryAppointmentRepository();
  const clock = () => new Date(fixedNow);
  return {
    repository,
    createAppointment: new CreateAppointment({ repository, clock }),
    getAppointment: new GetAppointment({ repository }),
    listAppointments: new ListAppointments({ repository }),
    updateAppointment: new UpdateAppointment({ repository, clock }),
    deleteAppointment: new DeleteAppointment({ repository }),
  };
}

test("creates appointments with a UUID and ISO timestamps", async () => {
  const { createAppointment } = createContext();
  const appointment = await createAppointment.execute(validInput);

  assert.match(
    appointment.id,
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  );
  assert.equal(appointment.createdAt, fixedNow.toISOString());
  assert.equal(appointment.updatedAt, fixedNow.toISOString());
});

test("rejects appointments in the past using the injected clock", async () => {
  const { createAppointment } = createContext();

  await assert.rejects(
    createAppointment.execute({
      ...validInput,
      appointmentTime: "09:59",
    }),
    ValidationError,
  );
});

test("rejects duplicate date and time", async () => {
  const { createAppointment } = createContext();
  await createAppointment.execute(validInput);

  await assert.rejects(
    createAppointment.execute(validInput),
    AppointmentConflictError,
  );
});

test("gets and lists persisted appointments", async () => {
  const { createAppointment, getAppointment, listAppointments } =
    createContext();
  const created = await createAppointment.execute(validInput);

  assert.equal((await getAppointment.execute(created.id)).id, created.id);
  assert.equal((await listAppointments.execute()).length, 1);
});

test("returns not found when getting an unknown appointment", async () => {
  const { getAppointment } = createContext();

  await assert.rejects(
    getAppointment.execute("missing"),
    AppointmentNotFoundError,
  );
});

test("updates an appointment without changing createdAt", async () => {
  const { createAppointment, updateAppointment, getAppointment } =
    createContext();
  const created = await createAppointment.execute(validInput);
  const updated = await updateAppointment.execute(created.id, {
    ...validInput,
    clientName: "Beatriz",
    appointmentTime: "12:00",
  });

  assert.equal(updated.clientName, "Beatriz");
  assert.equal(updated.createdAt, created.createdAt);
  assert.equal(updated.updatedAt, fixedNow.toISOString());
  assert.equal(
    (await getAppointment.execute(created.id)).clientName,
    "Beatriz",
  );
});

test("rejects updating an appointment into the past", async () => {
  const { createAppointment, updateAppointment } = createContext();
  const created = await createAppointment.execute(validInput);

  await assert.rejects(
    updateAppointment.execute(created.id, {
      ...validInput,
      appointmentTime: "09:59",
    }),
    ValidationError,
  );
});

test("returns not found when updating an unknown appointment", async () => {
  const { updateAppointment } = createContext();

  await assert.rejects(
    updateAppointment.execute("missing", validInput),
    AppointmentNotFoundError,
  );
});

test("allows keeping the current appointment time during update", async () => {
  const { createAppointment, updateAppointment } = createContext();
  const created = await createAppointment.execute(validInput);

  const updated = await updateAppointment.execute(created.id, validInput);

  assert.equal(updated.id, created.id);
});

test("rejects moving an appointment into another appointment's time", async () => {
  const { createAppointment, updateAppointment } = createContext();
  const first = await createAppointment.execute(validInput);
  await createAppointment.execute({ ...validInput, appointmentTime: "12:00" });

  await assert.rejects(
    updateAppointment.execute(first.id, {
      ...validInput,
      appointmentTime: "12:00",
    }),
    AppointmentConflictError,
  );
});

test("deletes appointments and reports missing records", async () => {
  const { createAppointment, deleteAppointment, getAppointment } =
    createContext();
  const created = await createAppointment.execute(validInput);

  assert.equal(await deleteAppointment.execute(created.id), true);
  await assert.rejects(
    getAppointment.execute(created.id),
    AppointmentNotFoundError,
  );
  await assert.rejects(
    deleteAppointment.execute(created.id),
    AppointmentNotFoundError,
  );
});
