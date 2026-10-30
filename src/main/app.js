const path = require("node:path");
const express = require("express");
const helmet = require("helmet");
const { AppointmentNotFoundError } = require("../domain/errors");
const { errorHandler } = require("../presentation/middlewares/errorHandler");
const {
  createAppointmentRoutes,
} = require("../presentation/routes/appointmentRoutes");

const viewsPath = path.join(__dirname, "..", "presentation", "views");
const publicPath = path.join(__dirname, "..", "presentation", "public");

function createApp(useCases) {
  const app = express();
  app.set("view engine", "ejs");
  app.set("views", viewsPath);
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(publicPath));
  app.use(createAppointmentRoutes(useCases));
  app.use((_request, _response, next) => next(new AppointmentNotFoundError()));
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
