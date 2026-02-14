// =========================
// Config
// =========================
const WHATSAPP_NUMBER = "27670070229"; // SA format: 067... => 27...

function buildWhatsAppLink(text) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

// =========================
// Sticky header offset var (smooth scroll offset)
// =========================
function setHeaderOffsetVar(){
  const header = document.querySelector(".site-header");
  if (!header) return;
  const h = Math.ceil(header.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--header-offset", `${h}px`);
}

// =========================
// Scroll progress bar
// =========================
function initProgressBar(){
  const bar = document.getElementById("scrollProgressBar");
  if (!bar) return;

  const update = () => {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const scrollHeight = doc.scrollHeight - window.innerHeight;
    const p = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${Math.max(0, Math.min(100, p))}%`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

// =========================
// Scroll-spy active nav highlight
// =========================
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-links a[data-spy]'));
  const sections = links
    .map(a => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const setActive = (id) => {
    links.forEach(a => {
      const target = a.getAttribute("href").slice(1);
      a.classList.toggle("active", target === id);
    });
  };

  setActive(sections[0].id);

  const obs = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) setActive(visible.target.id);
  }, {
    threshold: [0.25, 0.4, 0.6],
    rootMargin: "-30% 0px -55% 0px"
  });

  sections.forEach(sec => obs.observe(sec));

  links.forEach(a => {
    a.addEventListener("click", () => {
      const id = a.getAttribute("href").slice(1);
      setActive(id);
    });
  });
}

// =========================
// WhatsApp wiring (top button + form)
// =========================
function initWhatsApp() {
  const topWhatsappLink = document.getElementById("topWhatsappLink");
  if (topWhatsappLink) {
    topWhatsappLink.href = buildWhatsAppLink(
      "Hi EJT DIGITAL — I’d like to book a free strategy call."
    );
  }

  const form = document.getElementById("whatsappForm");
  if (!form) return;

  form.addEventListener("submit", function(e){
    e.preventDefault();

    const name = (document.getElementById("name")?.value || "").trim();
    const email = (document.getElementById("email")?.value || "").trim();
    const phone = (document.getElementById("phone")?.value || "").trim();
    const message = (document.getElementById("message")?.value || "").trim();

    const lines = [
      "Hi EJT DIGITAL,",
      "",
      "I’d like to enquire about brand scaling.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      message ? "" : null,
      message ? `Message: ${message}` : null
    ].filter(Boolean);

    const waUrl = buildWhatsAppLink(lines.join("\n"));
    window.open(waUrl, "_blank", "noopener,noreferrer");
  });
}

// =========================
// Init
// =========================
document.addEventListener("DOMContentLoaded", () => {
  setHeaderOffsetVar();
  window.addEventListener("resize", setHeaderOffsetVar);

  initProgressBar();
  initScrollSpy();
  initWhatsApp();
});
