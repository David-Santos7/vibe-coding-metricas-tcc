const { AppointmentConflictError } = require("../../src/domain/errors");

class InMemoryAppointmentRepository {
  constructor() {
    this.appointments = new Map();
  }

  async create(appointment) {
    if (
      await this.findByDateAndTime(
        appointment.appointmentDate,
        appointment.appointmentTime,
      )
    ) {
      throw new AppointmentConflictError();
    }

    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  async findById(id) {
    return this.appointments.get(id) || null;
  }

  async findAll() {
    return [...this.appointments.values()].sort((left, right) =>
      `${left.appointmentDate}T${left.appointmentTime}`.localeCompare(
        `${right.appointmentDate}T${right.appointmentTime}`,
      ),
    );
  }

  async findByDateAndTime(date, time, excludeId) {
    return (
      [...this.appointments.values()].find(
        (appointment) =>
          appointment.appointmentDate === date &&
          appointment.appointmentTime === time &&
          appointment.id !== excludeId,
      ) || null
    );
  }

  async update(appointment) {
    this.appointments.set(appointment.id, appointment);
    return appointment;
  }

  async delete(id) {
    return this.appointments.delete(id);
  }
}

module.exports = InMemoryAppointmentRepository;
