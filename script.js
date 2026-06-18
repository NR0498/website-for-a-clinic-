const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

const clinicConfig = {
  email: "clinic@example.com",
  phone: "+910000000000",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  googleReviewsEndpoint: "/api/google-reviews",
  appointmentEndpoint: "https://formsubmit.co/ajax/clinic@example.com",
  contactEndpoint: "https://formsubmit.co/ajax/clinic@example.com",
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (header) {
  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 20);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-slideshow]").forEach((slideshow) => {
  const slides = Array.from(slideshow.querySelectorAll(".slide"));
  const nextButton = slideshow.querySelector("[data-slide-next]");
  const prevButton = slideshow.querySelector("[data-slide-prev]");
  let activeIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("active")));
  let timer;

  function showSlide(index) {
    if (!slides.length) return;
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });
  }

  function restartTimer() {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(activeIndex + 1), 4500);
  }

  nextButton?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    restartTimer();
  });

  prevButton?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    restartTimer();
  });

  showSlide(activeIndex);
  if (slides.length > 1) restartTimer();
});

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isPlaceholderEndpoint(endpoint) {
  return !endpoint || endpoint.includes("clinic@example.com");
}

async function submitFormEndpoint(endpoint, payload) {
  if (isPlaceholderEndpoint(endpoint)) {
    return { ok: false, reason: "placeholder" };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Form service returned ${response.status}`);
  }

  return { ok: true };
}

function renderReviewCard(review) {
  const rating = Math.max(0, Math.min(5, Number(review.rating || 5)));
  const stars = "★".repeat(Math.round(rating)).padEnd(5, "☆");
  const author = escapeHtml(review.author_name || "Google reviewer");
  const time = escapeHtml(review.relative_time_description || "");
  const text = escapeHtml(review.text || "");
  const authorUrl = review.author_url ? String(review.author_url) : "";

  return `
    <article class="review-card">
      <div class="review-stars" aria-label="${rating} out of 5 stars">${stars}</div>
      <p>"${text}"</p>
      <div class="review-meta">
        <strong>${author}</strong>
        ${time ? `<span>${time}</span>` : ""}
        ${authorUrl ? `<a href="${escapeHtml(authorUrl)}" target="_blank" rel="noreferrer">View on Google</a>` : ""}
      </div>
    </article>
  `;
}

async function loadGoogleReviews() {
  const reviewsContainer = document.querySelector("[data-reviews]");
  const reviewsStatus = document.querySelector("[data-reviews-status]");
  if (!reviewsContainer || !clinicConfig.googleReviewsEndpoint) return;

  try {
    const response = await fetch(clinicConfig.googleReviewsEndpoint, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Reviews endpoint returned ${response.status}`);
    }

    const data = await response.json();
    const reviews = Array.isArray(data.reviews) ? data.reviews.filter((review) => review.text).slice(0, 3) : [];
    if (!reviews.length) return;

    reviewsContainer.innerHTML = reviews.map(renderReviewCard).join("");
    if (reviewsStatus) {
      const rating = data.rating ? `${Number(data.rating).toFixed(1)} rating` : "Google reviews";
      const total = data.user_ratings_total ? ` from ${data.user_ratings_total} reviews` : "";
      reviewsStatus.textContent = `Live from Google: ${rating}${total}.`;
    }
  } catch (error) {
    if (reviewsStatus) {
      reviewsStatus.textContent = "Google reviews will appear here after the API endpoint is configured.";
    }
  }
}

loadGoogleReviews();

function startShader() {
  const canvas = document.getElementById("shader-canvas");
  if (!canvas) return;

  function syncSize() {
    const width = canvas.clientWidth || 1280;
    const height = canvas.clientHeight || 720;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(syncSize).observe(canvas);
  }
  syncSize();

  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return;

  const vertexSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;
    void main() {
      v_texCoord = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;
    varying vec2 v_texCoord;
    uniform float u_time;
    void main() {
      vec2 uv = v_texCoord;
      float motion = sin(uv.x * 3.0 + u_time * 0.4) * 0.1;
      motion += sin(uv.y * 2.0 + u_time * 0.3) * 0.1;
      vec3 forestGreen = vec3(0.106, 0.188, 0.133);
      vec3 sageGreen = vec3(0.482, 0.584, 0.498);
      vec3 earthTerracotta = vec3(0.698, 0.345, 0.224);
      vec3 offWhite = vec3(0.984, 0.976, 0.957);
      float t1 = smoothstep(0.3, 0.7, uv.y + motion);
      float t2 = smoothstep(0.4, 0.8, uv.x - motion);
      vec3 color = mix(forestGreen, sageGreen, t1);
      color = mix(color, earthTerracotta, t2 * 0.3);
      color = mix(color, offWhite, (1.0 - t1) * 0.2);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const timeUniform = gl.getUniformLocation(program, "u_time");

  function render(time) {
    if (typeof ResizeObserver === "undefined") syncSize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (timeUniform) gl.uniform1f(timeUniform, time * 0.001);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

startShader();

const consultationCopy = {
  offline: {
    title: "Offline appointment",
    note: "Share your preferred clinic visit time and basic health concern.",
    status: "Your offline appointment request is ready. The clinic can confirm timing by phone.",
  },
  video: {
    title: "Video consultation",
    note: "Choose a date, time, and preferred video platform for the online appointment.",
    status: "Your video consultation request is ready. Meeting details can be shared after confirmation.",
  },
  call: {
    title: "Call consultation",
    note: "Choose a convenient call slot and mention the main health concern.",
    status: "Your call consultation request is ready. The clinic can confirm the phone slot.",
  },
};

const optionCards = document.querySelectorAll("[data-consultation-type]");
const typeInput = document.querySelector("[data-type-input]");
const formTitle = document.querySelector("[data-form-title]");
const formNote = document.querySelector("[data-form-note]");
const locationField = document.querySelector("[data-location-field]");
const onlineField = document.querySelector("[data-online-field]");
const bookingForm = document.querySelector("[data-booking-form]");
const formStatus = document.querySelector("[data-form-status]");
const dateInput = document.querySelector('input[type="date"]');
const serviceInput = document.querySelector("[data-service-input]");
const selectedService = document.querySelector("[data-selected-service]");

if (dateInput) {
  dateInput.min = new Date().toISOString().split("T")[0];
}

function setConsultationType(type) {
  const selectedType = consultationCopy[type] ? type : "offline";
  const copy = consultationCopy[selectedType];

  optionCards.forEach((card) => {
    card.classList.toggle("active", card.getAttribute("data-consultation-type") === selectedType);
  });

  if (typeInput) typeInput.value = selectedType;
  if (formTitle) formTitle.textContent = copy.title;
  if (formNote) formNote.textContent = copy.note;
  if (locationField) locationField.hidden = selectedType !== "offline";
  if (onlineField) onlineField.hidden = selectedType !== "video";
  if (formStatus) formStatus.textContent = "";
}

optionCards.forEach((card) => {
  card.addEventListener("click", () => {
    const type = card.getAttribute("data-consultation-type") || "offline";
    setConsultationType(type);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const urlType = new URLSearchParams(window.location.search).get("type");
const urlService = new URLSearchParams(window.location.search).get("service");
setConsultationType(urlType || "offline");

const serviceLabels = {
  "ayurvedic-consultation": "Ayurvedic consultation",
  "custom-diet-plan": "Customized diet plan",
  "yoga-therapy": "Yoga therapy",
};

if (serviceInput && selectedService) {
  const label = serviceLabels[urlService] || "General consultation";
  serviceInput.value = label;
  selectedService.textContent = `Selected service: ${label}`;
  selectedService.hidden = false;
}

if (bookingForm && formStatus) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const type = String(formData.get("consultationType") || "offline");
    const appointment = {
      id: `RP-${Date.now()}`,
      service: String(formData.get("service") || "General consultation"),
      type,
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      date: String(formData.get("date") || ""),
      time: String(formData.get("time") || ""),
      location: String(formData.get("location") || ""),
      platform: String(formData.get("platform") || ""),
      concern: String(formData.get("concern") || ""),
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("appointmentRequests") || "[]");
    existing.push(appointment);
    localStorage.setItem("appointmentRequests", JSON.stringify(existing));

    const summary = [
      `Appointment ID: ${appointment.id}`,
      `Service: ${appointment.service}`,
      `Mode: ${consultationCopy[type].title}`,
      `Name: ${appointment.name}`,
      `Phone: ${appointment.phone}`,
      `Preferred date: ${appointment.date}`,
      `Preferred time: ${appointment.time}`,
      appointment.location ? `Location: ${appointment.location}` : "",
      appointment.platform ? `Platform: ${appointment.platform}` : "",
      `Concern: ${appointment.concern}`,
    ].filter(Boolean).join("\n");

    const mailto = `mailto:${clinicConfig.email}?subject=${encodeURIComponent(`Appointment request ${appointment.id}`)}&body=${encodeURIComponent(summary)}`;
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `UID:${appointment.id}@drrajpathak.local`,
      `SUMMARY:${appointment.service} with Dr Raj Pathak`,
      `DESCRIPTION:${summary.replace(/\n/g, "\\n")}`,
      appointment.date ? `DTSTART;VALUE=DATE:${appointment.date.replace(/-/g, "")}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const calendarUrl = URL.createObjectURL(blob);

    formStatus.textContent = "Sending appointment request...";

    try {
      const result = await submitFormEndpoint(clinicConfig.appointmentEndpoint, {
        _subject: `Appointment request ${appointment.id}`,
        _template: "table",
        appointmentId: appointment.id,
        service: appointment.service,
        mode: consultationCopy[type].title,
        name: appointment.name,
        phone: appointment.phone,
        preferredDate: appointment.date,
        preferredTime: appointment.time,
        location: appointment.location,
        platform: appointment.platform,
        concern: appointment.concern,
      });

      bookingForm.reset();
      setConsultationType(type);
      if (serviceInput && selectedService) {
        serviceInput.value = appointment.service;
        selectedService.textContent = `Selected service: ${appointment.service}`;
        selectedService.hidden = false;
      }

      if (result.ok) {
        formStatus.innerHTML = `${consultationCopy[type].status} Request sent to the clinic inbox. <a download="${appointment.id}.ics" href="${calendarUrl}">Download calendar file</a>`;
      } else {
        formStatus.innerHTML = `FormSubmit is ready but needs your real clinic email in script.js. <a href="${mailto}">Open email draft</a> <a download="${appointment.id}.ics" href="${calendarUrl}">Download calendar file</a>`;
      }
    } catch (error) {
      formStatus.innerHTML = `The form service could not send this request. <a href="${mailto}">Open email draft</a> <a download="${appointment.id}.ics" href="${calendarUrl}">Download calendar file</a>`;
    }
  });
}

const contactForm = document.querySelector("[data-contact-form]");
const contactStatus = document.querySelector("[data-contact-status]");

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const message = [
      `Name: ${formData.get("name")}`,
      `Contact: ${formData.get("contact")}`,
      `Message: ${formData.get("message")}`,
    ].join("\n");
    const mailto = `mailto:${clinicConfig.email}?subject=${encodeURIComponent("Website contact message")}&body=${encodeURIComponent(message)}`;
    contactStatus.textContent = "Sending message...";

    try {
      const result = await submitFormEndpoint(clinicConfig.contactEndpoint, {
        _subject: "Website contact message",
        _template: "table",
        name: String(formData.get("name") || ""),
        contact: String(formData.get("contact") || ""),
        message: String(formData.get("message") || ""),
      });

      contactForm.reset();
      contactStatus.innerHTML = result.ok
        ? "Message sent to the clinic inbox."
        : `FormSubmit is ready but needs your real clinic email in script.js. <a href="${mailto}">Open email draft</a>`;
    } catch (error) {
      contactStatus.innerHTML = `The form service could not send this message. <a href="${mailto}">Open email draft</a>`;
    }
  });
}
