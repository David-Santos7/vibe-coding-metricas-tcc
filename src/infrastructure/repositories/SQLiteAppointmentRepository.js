const {
  AppointmentConflictError,
  AppointmentNotFoundError,
} = require("../../domain/errors");

const insertSql = `
  INSERT INTO appointments (
    id, client_name, service, appointment_date, appointment_time,
    notes, created_at, updated_at
  ) VALUES (
    @id, @clientName, @service, @appointmentDate, @appointmentTime,
    @notes, @createdAt, @updatedAt
  )
`;

const selectFields = `
  id,
  client_name AS clientName,
  service,
  appointment_date AS appointmentDate,
  appointment_time AS appointmentTime,
  notes,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

class SQLiteAppointmentRepository {
  constructor(database) {
    this.connection = database.connection;
    this.insertStatement = this.connection.prepare(insertSql);
    this.selectByIdStatement = this.connection.prepare(
      `SELECT ${selectFields} FROM appointments WHERE id = ?`,
    );
    this.selectAllStatement = this.connection.prepare(
      `SELECT ${selectFields} FROM appointments ORDER BY appointment_date, appointment_time`,
    );
    this.selectBySlotStatement = this.connection.prepare(`
      SELECT ${selectFields}
      FROM appointments
      WHERE appointment_date = @date
        AND appointment_time = @time
        AND (@excludeId IS NULL OR id != @excludeId)
    `);
    this.updateStatement = this.connection.prepare(`
      UPDATE appointments
      SET client_name = @clientName,
          service = @service,
          appointment_date = @appointmentDate,
          appointment_time = @appointmentTime,
          notes = @notes,
          updated_at = @updatedAt
      WHERE id = @id
    `);
    this.deleteStatement = this.connection.prepare(
      "DELETE FROM appointments WHERE id = ?",
    );
  }

  async create(appointment) {
    try {
      this.insertStatement.run({ ...appointment });
      return appointment;
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new AppointmentConflictError();
      }
      throw error;
    }
  }

  async findById(id) {
    return this.selectByIdStatement.get(id) || null;
  }

  async findAll() {
    return this.selectAllStatement.all();
  }

  async findByDateAndTime(date, time, excludeId = null) {
    return this.selectBySlotStatement.get({ date, time, excludeId }) || null;
  }

  async update(appointment) {
    try {
      const result = this.updateStatement.run({ ...appointment });
      if (result.changes === 0) {
        throw new AppointmentNotFoundError();
      }
      return appointment;
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        throw new AppointmentConflictError();
      }
      throw error;
    }
  }

  async delete(id) {
    return this.deleteStatement.run(id).changes > 0;
  }
}

module.exports = SQLiteAppointmentRepository;
