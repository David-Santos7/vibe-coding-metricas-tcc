function createAppointmentController({
  createAppointment,
  getAppointment,
  listAppointments,
  updateAppointment,
  deleteAppointment,
}) {
  return {
    home(_request, response) {
      response.render("home");
    },

    async list(_request, response) {
      const appointments = await listAppointments.execute();
      response.render("appointments/index", { appointments });
    },

    newForm(_request, response) {
      response.render("appointments/form", {
        appointment: {},
        action: "/appointments",
        heading: "Novo agendamento",
        submitLabel: "Salvar agendamento",
      });
    },

    async create(request, response) {
      const appointment = await createAppointment.execute(request.body);
      response.redirect(303, `/appointments/${appointment.id}`);
    },

    async show(request, response) {
      const appointment = await getAppointment.execute(request.params.id);
      response.render("appointments/show", { appointment });
    },

    async editForm(request, response) {
      const appointment = await getAppointment.execute(request.params.id);
      response.render("appointments/form", {
        appointment,
        action: `/appointments/${appointment.id}/update`,
        heading: "Editar agendamento",
        submitLabel: "Salvar alterações",
      });
    },

    async update(request, response) {
      const appointment = await updateAppointment.execute(
        request.params.id,
        request.body,
      );
      response.redirect(303, `/appointments/${appointment.id}`);
    },

    async delete(request, response) {
      await deleteAppointment.execute(request.params.id);
      response.redirect(303, "/appointments");
    },
  };
}

module.exports = { createAppointmentController };
