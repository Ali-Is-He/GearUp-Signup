(function () {
  const grid = document.getElementById("schedule-grid");
  const form = document.getElementById("signup-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const summaryList = document.getElementById("summary-list");
  const summaryEmpty = document.getElementById("summary-empty");

  const ROW_PX = 22;

  const popover = document.createElement("div");
  popover.className = "session-popover hidden";
  document.body.appendChild(popover);

  function showPopover(session, anchorEl) {
    popover.innerHTML = `
      <div class="popover-title">${session.class} — ${session.session}</div>
      <div class="popover-time">${formatHour(session.start)} – ${formatHour(session.end)}</div>
      <div class="popover-description">${session.description || "Description coming soon."}</div>
    `;
    popover.classList.remove("hidden");

    const rect = anchorEl.getBoundingClientRect();
    const popRect = popover.getBoundingClientRect();
    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 6;

    if (left + popRect.width > window.scrollX + document.documentElement.clientWidth - 8) {
      left = window.scrollX + document.documentElement.clientWidth - popRect.width - 8;
    }
    popover.style.left = `${Math.max(8, left)}px`;
    popover.style.top = `${top}px`;
  }

  function hidePopover() {
    popover.classList.add("hidden");
  }

  document.addEventListener("click", (e) => {
    if (!popover.contains(e.target) && !e.target.closest(".info-btn")) {
      hidePopover();
    }
  });

  function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  const dayStartMin = toMinutes(DAY_START);
  const dayEndMin = toMinutes(DAY_END);
  const totalSlots = (dayEndMin - dayStartMin) / SLOT_MINUTES;

  function slotFor(hhmm) {
    return (toMinutes(hhmm) - dayStartMin) / SLOT_MINUTES;
  }

  function formatHour(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
  }

  function sessionKey(s) {
    return `${s.class}__${s.session}`;
  }

  // sessionKey -> session object, for currently selected sessions.
  const selections = new Map();

  function overlaps(a, b) {
    return toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);
  }

  function buildGrid() {
    grid.style.gridTemplateColumns = `90px repeat(${CLASSES.length}, minmax(120px, 1fr))`;
    grid.style.gridTemplateRows = `40px repeat(${totalSlots}, ${ROW_PX}px)`;

    // Header row.
    const corner = document.createElement("div");
    corner.className = "grid-header grid-corner";
    corner.style.gridColumn = "1 / 2";
    corner.style.gridRow = "1 / 2";
    grid.appendChild(corner);

    CLASSES.forEach((className, i) => {
      const headerCell = document.createElement("div");
      headerCell.className = "grid-header";
      headerCell.textContent = className;
      headerCell.style.gridColumn = `${i + 2} / ${i + 3}`;
      headerCell.style.gridRow = "1 / 2";
      grid.appendChild(headerCell);
    });

    // Hour labels down the left side.
    for (let min = dayStartMin; min < dayEndMin; min += 60) {
      const label = document.createElement("div");
      label.className = "time-label";
      const hh = String(Math.floor(min / 60)).padStart(2, "0");
      const mm = String(min % 60).padStart(2, "0");
      label.textContent = formatHour(`${hh}:${mm}`);
      const startSlot = (min - dayStartMin) / SLOT_MINUTES;
      const span = Math.min(60 / SLOT_MINUTES, totalSlots - startSlot);
      label.style.gridColumn = "1 / 2";
      label.style.gridRow = `${startSlot + 2} / ${startSlot + 2 + span}`;
      grid.appendChild(label);
    }

    // Background row lines (one per class column, full height) for visual structure.
    CLASSES.forEach((_, i) => {
      const colBg = document.createElement("div");
      colBg.className = "grid-column-bg";
      colBg.style.gridColumn = `${i + 2} / ${i + 3}`;
      colBg.style.gridRow = `2 / ${totalSlots + 2}`;
      grid.appendChild(colBg);
    });

    // Breaks (span all class columns).
    BREAKS.forEach((brk) => {
      const el = document.createElement("div");
      el.className = "break-block";
      el.textContent = brk.label;
      el.style.gridColumn = `2 / ${CLASSES.length + 2}`;
      el.style.gridRow = `${slotFor(brk.start) + 2} / ${slotFor(brk.end) + 2}`;
      grid.appendChild(el);
    });

    // Session blocks.
    SESSIONS.forEach((s) => {
      const colIndex = CLASSES.indexOf(s.class);
      if (colIndex === -1) return;

      const key = sessionKey(s);
      const block = document.createElement("button");
      block.type = "button";
      block.className = "session-block";
      block.dataset.key = key;
      block.style.gridColumn = `${colIndex + 2} / ${colIndex + 3}`;
      block.style.gridRow = `${slotFor(s.start) + 2} / ${slotFor(s.end) + 2}`;

      block.innerHTML = `
        <button type="button" class="info-btn" aria-label="View description for ${s.class} ${s.session}">i</button>
        <span class="session-name">${s.session}</span>
        <span class="session-time">${formatHour(s.start)} – ${formatHour(s.end)}</span>
        <span class="session-count" data-count-key="${key}"></span>
      `;

      block.querySelector(".info-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        showPopover(s, block);
      });

      block.addEventListener("click", () => {
        hidePopover();
        toggleSession(s, block);
      });
      grid.appendChild(block);
    });
  }

  function toggleSession(session, block) {
    const key = sessionKey(session);

    if (selections.has(key)) {
      selections.delete(key);
      block.classList.remove("selected");
      renderSummary();
      return;
    }

    // Remove any selection that overlaps this session in time, regardless of class.
    for (const [existingKey, existingSession] of Array.from(selections.entries())) {
      if (overlaps(existingSession, session)) {
        selections.delete(existingKey);
        const existingBlock = grid.querySelector(`[data-key="${CSS.escape(existingKey)}"]`);
        if (existingBlock) existingBlock.classList.remove("selected");
      }
    }

    selections.set(key, session);
    block.classList.add("selected");
    renderSummary();
  }

  function renderSummary() {
    summaryList.innerHTML = "";
    const sorted = Array.from(selections.values()).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));

    summaryEmpty.style.display = sorted.length ? "none" : "block";

    sorted.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = `${formatHour(s.start)} – ${formatHour(s.end)}: ${s.class} (${s.session})`;
      summaryList.appendChild(li);
    });
  }

  function collectPayload() {
    const payload = {
      name: document.getElementById("student-name").value.trim(),
      team: document.getElementById("student-team").value.trim(),
      experience: document.getElementById("student-experience").value.trim(),
      submittedAt: new Date().toISOString()
    };

    CLASSES.forEach((className) => {
      const picked = Array.from(selections.values()).filter((s) => s.class === className);
      payload[className] = picked.map((s) => s.session).join(", ");
    });

    return payload;
  }

  function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = `form-status ${type || ""}`.trim();
  }

  async function refreshCounts() {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.startsWith("PASTE_")) return;

    try {
      const res = await fetch(APPS_SCRIPT_URL);
      const data = await res.json();
      if (data.result !== "success") return;

      SESSIONS.forEach((s) => {
        const count = (data.counts[s.class] && data.counts[s.class][s.session]) || 0;
        const el = grid.querySelector(`[data-count-key="${CSS.escape(sessionKey(s))}"]`);
        if (!el) return;
        if (count > 0) {
          el.textContent = `${count} interested`;
          el.title = `${count} student${count === 1 ? "" : "s"} ${count === 1 ? "is" : "are"} currently interested in this session.`;
        } else {
          el.textContent = "";
          el.removeAttribute("title");
        }
      });
    } catch (err) {
      // Counts are a nice-to-have — fail silently if unreachable.
    }
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.startsWith("PASTE_")) {
      setStatus("This form isn't connected to a spreadsheet yet. See README.md.", "error");
      return;
    }

    const payload = collectPayload();
    submitBtn.disabled = true;
    setStatus("Submitting…");

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      setStatus("Thanks! Your sign-up was submitted.", "success");
      selections.clear();
      grid.querySelectorAll(".session-block.selected").forEach((b) => b.classList.remove("selected"));
      renderSummary();
      form.reset();
      refreshCounts();
    } catch (err) {
      setStatus("Something went wrong submitting the form. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
    }
  });

  buildGrid();
  renderSummary();
  refreshCounts();
  setInterval(refreshCounts, 30000);
})();
