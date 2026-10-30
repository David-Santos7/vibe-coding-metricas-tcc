const { ValidationError } = require("./errors");

function requiredText(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`${label} é obrigatório.`);
  }

  return value.trim();
}

function validateDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new ValidationError(
      "Data do agendamento deve ser uma data válida no formato AAAA-MM-DD.",
    );
  }

  const [year, month, day] = value.split("-").map(Number);
  const daysInMonth = [
    31,
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
    throw new ValidationError(
      "Data do agendamento deve ser uma data válida no formato AAAA-MM-DD.",
    );
  }
}

function validateTime(value) {
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw new ValidationError(
      "Horário deve estar no formato HH:mm, entre 00:00 e 23:59.",
    );
  }
}

function validateTimestamp(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    throw new ValidationError("Os timestamps devem estar no formato ISO 8601.");
  }
}

class Appointment {
  constructor({
    id,
    clientName,
    service,
    appointmentDate,
    appointmentTime,
    notes = "",
    createdAt,
    updatedAt,
  }) {
    this.id = requiredText(id, "Identificador");
    this.clientName = requiredText(clientName, "Nome do cliente");
    this.service = requiredText(service, "Serviço");
    validateDate(appointmentDate);
    validateTime(appointmentTime);

    if (typeof notes !== "string") {
      throw new ValidationError("Observações devem ser um texto.");
    }
    if (notes.length > 500) {
      throw new ValidationError(
        "Observações devem ter no máximo 500 caracteres.",
      );
    }

    validateTimestamp(createdAt);
    validateTimestamp(updatedAt);

    this.appointmentDate = appointmentDate;
    this.appointmentTime = appointmentTime;
    this.notes = notes.trim();
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    Object.freeze(this);
  }

  static create(input) {
    return new Appointment(input);
  }
}

module.exports = { Appointment };
