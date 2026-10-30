const { AppointmentNotFoundError } = require("../domain/errors");

class DeleteAppointment {
  constructor({ repository }) {
    this.repository = repository;
  }

  async execute(id) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new AppointmentNotFoundError();
    }

    return true;
  }
}

module.exports = { DeleteAppointment };
