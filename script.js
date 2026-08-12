const form = document.getElementById("appointment-form");
const categorySelect = document.getElementById("service-category");
const jobSelect = document.getElementById("specific-job");
const dynamicJobNotice = document.getElementById("dynamic-job-notice");

const categoryLabels = {
  diagnostics: "Diagnostics",
  brakes: "Brake service",
  suspension: "Suspension & steering",
  engine: "Engine repair or replacement",
  transmission: "Transmission diagnosis or replacement",
  "not-sure": "Not sure — please advise",
};

const jobsByCategory = {
  diagnostics: [
    "Complete vehicle diagnostic inspection",
    "Check-engine or warning-light diagnosis",
    "No-start or hard-start diagnosis",
    "Battery, starting, or charging-system diagnosis",
    "Electrical-system diagnosis",
    "Rough-running, misfire, or stalling diagnosis",
    "Loss-of-power or poor-performance diagnosis",
    "Overheating or cooling-system diagnosis",
    "Noise or vibration diagnosis",
    "Fluid-leak diagnosis",
    "Smoke or unusual-smell diagnosis",
    "Intermittent-problem diagnosis",
    "Independent diagnosis or second opinion",
  ],
  brakes: [
    "Complete brake-system diagnosis",
    "Brake noise or vibration diagnosis",
    "ABS or brake warning-light diagnosis",
    "Brake inspection",
    "Front brake pads",
    "Rear brake pads",
    "Brake pads and rotors",
    "Brake rotors",
    "Brake caliper replacement",
    "Brake hardware repair",
    "Brake hose or line repair",
    "Brake-fluid leak repair",
    "Soft or low brake-pedal repair",
    "Master cylinder replacement",
    "Brake booster concern",
    "Drum brakes or brake shoes",
    "Parking-brake repair",
    "Brake-fluid bleed or flush",
  ],
  suspension: [
    "Complete steering and suspension diagnosis",
    "Clunking, squeaking, or suspension-noise diagnosis",
    "Pulling, wandering, or handling diagnosis",
    "Steering or suspension inspection",
    "Shock replacement",
    "Strut replacement",
    "Coil spring repair or replacement",
    "Control arm replacement",
    "Control-arm bushing replacement",
    "Ball-joint replacement",
    "Inner or outer tie-rod replacement",
    "Sway-bar link or bushing replacement",
    "Wheel-bearing or hub replacement",
    "Steering-rack concern",
    "Power-steering leak or steering concern",
    "Uneven ride-height diagnosis",
    "Uneven tire-wear inspection",
  ],
  engine: [
    "Complete engine diagnosis",
    "Check-engine-light diagnosis",
    "No-start or hard-start engine diagnosis",
    "Engine noise or internal-engine diagnosis",
    "Misfire or rough-running repair",
    "Stalling or loss-of-power repair",
    "Cooling-system diagnosis or repair",
    "Overheating repair",
    "Oil-leak diagnosis or repair",
    "Coolant-leak diagnosis or repair",
    "Compression or internal-engine testing",
    "Timing or internal-engine concern",
    "Engine-mount replacement",
    "Engine repair",
    "Engine replacement estimate",
    "Engine replacement consultation",
  ],
  transmission: [
    "Complete transmission diagnosis",
    "Slipping or shifting diagnosis",
    "Hard, delayed, or erratic shifting diagnosis",
    "Transmission noise or vibration diagnosis",
    "Transmission-fluid leak diagnosis",
    "Will-not-go-into-gear diagnosis",
    "No reverse diagnosis",
    "Vehicle will not move diagnosis",
    "Transmission replacement estimate",
    "Transmission replacement",
    "Transmission replacement consultation",
  ],
  "not-sure": [
    "General diagnostic inspection",
    "Not sure — please diagnose the problem",
    "General safety inspection",
    "Multiple problems or concerns",
    "Need help choosing a service",
    "Independent diagnosis or second opinion",
  ],
};

function updateJobOptions() {
  const jobs = jobsByCategory[categorySelect.value] || [];
  jobSelect.replaceChildren();

  if (!categorySelect.value) {
    const option = new Option("Choose a service category first", "");
    option.disabled = true;
    option.selected = true;
    jobSelect.add(option);
    jobSelect.disabled = true;
    dynamicJobNotice.textContent = "Choose a service category above. The specific-job list will then change automatically.";
    return;
  }

  jobSelect.add(new Option("Choose a specific job", ""));
  jobs.forEach((job) => jobSelect.add(new Option(job, job)));
  jobSelect.disabled = false;
  dynamicJobNotice.textContent = `${jobs.length} matching job options loaded, including a diagnostic choice for this category. Choose one or leave it blank.`;
}

categorySelect.addEventListener("change", updateJobOptions);
updateJobOptions();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const requestedDate = String(data.get("date") || "");
  const day = requestedDate ? new Date(`${requestedDate}T12:00:00`).getDay() : -1;

  if (day === 0 || day === 6) {
    window.alert("Berry Automotive appointments are available Monday through Friday. Please choose a weekday.");
    return;
  }

  const optionalLines = [];
  const category = String(data.get("category") || "");
  const job = String(data.get("job") || "");
  const setting = String(data.get("setting") || "");
  const concerns = data.getAll("concerns").map(String);
  const timing = data.getAll("timing").map(String);

  if (category) optionalLines.push(`Service category: ${categoryLabels[category] || category}`);
  if (job) optionalLines.push(`Specific job: ${job}`);
  if (setting) optionalLines.push(`Preferred service setting: ${setting}`);
  if (concerns.length) optionalLines.push(`Symptoms/concerns: ${concerns.join(", ")}`);
  if (timing.length) optionalLines.push(`When it happens: ${timing.join(", ")}`);

  const message = [
    "Hi Berry Automotive, I'd like to request an appointment.",
    `Name: ${data.get("name") || ""}`,
    `Vehicle: ${data.get("vehicle") || ""}`,
    ...optionalLines,
    `Preferred appointment: ${requestedDate} (${data.get("time") || ""})`,
    `What is happening: ${data.get("details") || ""}`,
    `Best callback number: ${data.get("phone") || ""}`,
    "I understand this appointment is not scheduled until Berry Automotive confirms it.",
  ].join("\n");

  window.location.href = `sms:+19195914206?body=${encodeURIComponent(message)}`;
});
