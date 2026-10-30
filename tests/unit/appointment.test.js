const test = require("node:test");
const assert = require("node:assert/strict");
const { Appointment } = require("../../src/domain/Appointment");
const { ValidationError } = require("../../src/domain/errors");

const validInput = {
  id: "appointment-1",
  clientName: "  Ana Silva  ",
  service: "  Consulta  ",
  appointmentDate: "2026-10-30",
  appointmentTime: "10:30",
  notes: "  Primeira consulta  ",
  createdAt: "2026-10-01T12:00:00.000Z",
  updatedAt: "2026-10-01T12:00:00.000Z",
};

test("normalizes required text and optional notes", () => {
  const appointment = Appointment.create(validInput);

  assert.equal(appointment.clientName, "Ana Silva");
  assert.equal(appointment.service, "Consulta");
  assert.equal(appointment.notes, "Primeira consulta");
});

test("rejects a blank client name or service", () => {
  assert.throws(
    () => Appointment.create({ ...validInput, clientName: "   " }),
    ValidationError,
  );
  assert.throws(
    () => Appointment.create({ ...validInput, service: "  " }),
    ValidationError,
  );
});

test("rejects impossible dates and dates outside YYYY-MM-DD", () => {
  assert.throws(
    () => Appointment.create({ ...validInput, appointmentDate: "2026-02-29" }),
    ValidationError,
  );
  assert.throws(
    () => Appointment.create({ ...validInput, appointmentDate: "30/10/2026" }),
    ValidationError,
  );
});

test("rejects invalid 24-hour times", () => {
  for (const appointmentTime of ["24:00", "12:60", "9:05"]) {
    assert.throws(
      () => Appointment.create({ ...validInput, appointmentTime }),
      ValidationError,
    );
  }
});

test("limits optional notes to 500 characters", () => {
  assert.throws(
    () => Appointment.create({ ...validInput, notes: "x".repeat(501) }),
    ValidationError,
  );
  assert.equal(
    Appointment.create({ ...validInput, notes: "x".repeat(500) }).notes.length,
    500,
  );
});

test("accepts historical appointments as valid records", () => {
  const appointment = Appointment.create({
    ...validInput,
    appointmentDate: "2020-01-01",
  });

  assert.equal(appointment.appointmentDate, "2020-01-01");
});
