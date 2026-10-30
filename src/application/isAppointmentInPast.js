const saoPauloDateTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function localDateTime(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError("The application clock must return a valid Date.");
  }

  const parts = Object.fromEntries(
    saoPauloDateTime
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

function isAppointmentInPast(appointment, now) {
  return (
    `${appointment.appointmentDate}T${appointment.appointmentTime}` <
    localDateTime(now)
  );
}

module.exports = { isAppointmentInPast };
