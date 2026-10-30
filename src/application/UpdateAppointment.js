const { Appointment } = require("../domain/Appointment");
const {
  AppointmentConflictError,
  AppointmentNotFoundError,
  ValidationError,
} = require("../domain/errors");
const { isAppointmentInPast } = require("./isAppointmentInPast");

class UpdateAppointment {
  constructor({ repository, clock = () => new Date() }) {
    this.repository = repository;
    this.clock = clock;
  }

  async execute(id, input) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new AppointmentNotFoundError();
    }

    const now = this.clock();
    if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
      throw new TypeError("The application clock must return a valid Date.");
    }

    const appointment = Appointment.create({
      ...existing,
      ...input,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: now.toISOString(),
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
        appointment.id,
      )
    ) {
      throw new AppointmentConflictError();
    }

    return this.repository.update(appointment);
  }
}

module.exports = { UpdateAppointment };
