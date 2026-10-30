const { CreateAppointment } = require("../application/CreateAppointment");
const { DeleteAppointment } = require("../application/DeleteAppointment");
const { GetAppointment } = require("../application/GetAppointment");
const { ListAppointments } = require("../application/ListAppointments");
const { UpdateAppointment } = require("../application/UpdateAppointment");
const SQLiteAppointmentRepository = require("../infrastructure/repositories/SQLiteAppointmentRepository");

function createCompositionRoot({ database, clock }) {
  const repository = new SQLiteAppointmentRepository(database);

  return {
    createAppointment: new CreateAppointment({ repository, clock }),
    getAppointment: new GetAppointment({ repository }),
    listAppointments: new ListAppointments({ repository }),
    updateAppointment: new UpdateAppointment({ repository, clock }),
    deleteAppointment: new DeleteAppointment({ repository }),
  };
}

module.exports = { createCompositionRoot };
