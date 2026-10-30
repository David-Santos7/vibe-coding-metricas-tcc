const express = require("express");
const {
  createAppointmentController,
} = require("../controllers/appointmentController");

function createAppointmentRoutes(useCases) {
  const router = express.Router();
  const controller = createAppointmentController(useCases);

  router.get("/", controller.home);
  router.get("/appointments", controller.list);
  router.get("/appointments/new", controller.newForm);
  router.post("/appointments", controller.create);
  router.get("/appointments/:id/edit", controller.editForm);
  router.post("/appointments/:id/update", controller.update);
  router.post("/appointments/:id/delete", controller.delete);
  router.get("/appointments/:id", controller.show);

  return router;
}

module.exports = { createAppointmentRoutes };
