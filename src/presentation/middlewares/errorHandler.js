const {
  AppointmentConflictError,
  AppointmentNotFoundError,
  ValidationError,
} = require("../../domain/errors");

function errorHandler(error, _request, response, next) {
  if (response.headersSent) {
    return next(error);
  }

  let status = 500;
  let message = "Ocorreu um erro inesperado. Tente novamente.";

  if (error instanceof ValidationError) {
    status = 400;
    message = error.message;
  } else if (error instanceof AppointmentNotFoundError) {
    status = 404;
    message = error.message;
  } else if (error instanceof AppointmentConflictError) {
    status = 409;
    message = error.message;
  } else {
    console.error(error);
  }

  return response.status(status).render("error", { message, status });
}

module.exports = { errorHandler };
