const { randomUUID } = require("node:crypto");
const { Appointment } = require("../domain/Appointment");
const {
  AppointmentConflictError,
  ValidationError,
} = require("../domain/errors");
const { isAppointmentInPast } = require("./isAppointmentInPast");

class CreateAppointment {
  constructor({ repository, clock = () => new Date() }) {
    this.repository = repository;
    this.clock = clock;
  }

  async execute(input) {
    const now = this.clock();
    if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
      throw new TypeError("The application clock must return a valid Date.");
    }

    const timestamp = now.toISOString();
    const appointment = Appointment.create({
      ...input,
      id: randomUUID(),
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    if (isAppointmentInPast(appointment, now)) {
      throw new ValidationError(
        "Não é possível agendar em uma data ou horário passado.",
      );
    }

    if (
      await this.repository.findByDateAndTime(
        appointment.appointmentDate,
        appointment.appointmentTime,
      )
    ) {
      throw new AppointmentConflictError();
    }

    return this.repository.create(appointment);
  }
}

module.exports = { CreateAppointment };
