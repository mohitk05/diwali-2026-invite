// Gallery: reads /gallery.json
const grid = document.getElementById("grid");
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");

fetch("/gallery.json").then((r) => r.json()).then((photos) => {
  for (const p of photos) {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "View photo: " + p.alt);
    b.innerHTML = `<img loading="lazy" src="${p.src}" alt="${p.alt}">`;
    b.onclick = () => { lbImg.src = p.src; lbImg.alt = p.alt; lb.hidden = false; };
    grid.appendChild(b);
  }
}).catch(() => { document.getElementById("gallery").hidden = true; });

lb.onclick = () => (lb.hidden = true);
addEventListener("keydown", (e) => e.key === "Escape" && (lb.hidden = true));

// RSVP
const form = document.getElementById("form");
const status = document.getElementById("status");
const guestsWrap = document.getElementById("guests-wrap");

form.addEventListener("change", () => {
  guestsWrap.hidden = form.attending.value === "no";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "";
  status.textContent = "Sending…";
  const data = Object.fromEntries(new FormData(form));
  try {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    });
    const out = await res.json();
    if (!res.ok) throw new Error(out.error || "Something went wrong.");
    status.className = "ok";
    status.textContent = data.attending === "yes"
      ? "Thank you! We can't wait to celebrate with you. 🪔"
      : "Thanks for letting us know — you'll be missed!";
    form.reset();
  } catch (err) {
    status.className = "err";
    status.textContent = err.message;
  }
});
