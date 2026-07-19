const form = document.getElementById("appointment-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const requestedDate = String(data.get("date") || "");
  const day = requestedDate ? new Date(`${requestedDate}T12:00:00`).getDay() : -1;

  if (day === 0 || day === 6) {
    window.alert("Berry Automotive appointments are available Monday through Friday. Please choose a weekday.");
    return;
  }

  const message = [
    "Hi Berry Automotive, I'd like to request an appointment.",
    `Name: ${data.get("name") || ""}`,
    `Vehicle: ${data.get("vehicle") || ""}`,
    `Service: ${data.get("service") || ""}`,
    `Preferred appointment: ${requestedDate} (${data.get("time") || ""})`,
    `What is happening: ${data.get("details") || ""}`,
    `Best callback number: ${data.get("phone") || ""}`,
    "I understand this appointment is not scheduled until Berry Automotive confirms it.",
  ].join("\n");

  window.location.href = `sms:+19195914206?body=${encodeURIComponent(message)}`;
});
