const { AppointmentNotFoundError } = require("../domain/errors");

class GetAppointment {
  constructor({ repository }) {
    this.repository = repository;
  }

  async execute(id) {
    const appointment = await this.repository.findById(id);
    if (!appointment) {
      throw new AppointmentNotFoundError();
    }

    return appointment;
  }
}

module.exports = { GetAppointment };
