// Edit this file to update class names, descriptions, or times.
// All times are 24-hour "HH:MM". Add a session's description as it's finalized.

const DAY_START = "08:00";
const DAY_END = "15:00";
const SLOT_MINUTES = 15; // grid granularity — every row is this many minutes

const CLASSES = [
  "Beginner Build",
  "Beginner Code",
  "Beginner Notebook",
  "Strategy",
  "Advanced Build",
  "Advanced Code",
  "Advanced Notebook",
  "Engage (IQ)"
];

// Non-interactive blocks shown across the whole day (spans all class columns).
const BREAKS = [
  { label: "Arrival / Prep in Pit", start: "08:00", end: "08:30" },
  { label: "Opening Ceremony", start: "08:30", end: "09:00" },
  { label: "Lunch", start: "11:00", end: "12:00" },
  { label: "Clean-Up", start: "14:30", end: "15:00" }
];

// Every clickable session. `session` is the label shown on the block.
const SESSIONS = [
  { class: "Beginner Build", session: "Session A", start: "09:00", end: "10:30", description: "" },
  { class: "Beginner Build", session: "Short Session 1", start: "10:30", end: "11:00", description: "" },
  { class: "Beginner Build", session: "Session B", start: "12:00", end: "12:30", description: "" },
  { class: "Beginner Build", session: "Short Session 2", start: "13:30", end: "14:00", description: "" },
  { class: "Beginner Build", session: "Short Session 3", start: "14:00", end: "14:30", description: "" },

  { class: "Beginner Code", session: "Session A", start: "09:00", end: "10:30", description: "" },
  { class: "Beginner Code", session: "Short Session 1", start: "10:30", end: "11:00", description: "" },
  { class: "Beginner Code", session: "Session B", start: "12:00", end: "12:30", description: "" },
  { class: "Beginner Code", session: "Short Session 2", start: "13:30", end: "14:00", description: "" },
  { class: "Beginner Code", session: "Short Session 3", start: "14:00", end: "14:30", description: "" },

  { class: "Beginner Notebook", session: "Session A", start: "09:00", end: "10:00", description: "" },
  { class: "Beginner Notebook", session: "Session B", start: "10:00", end: "11:00", description: "" },
  { class: "Beginner Notebook", session: "Session C", start: "12:00", end: "13:00", description: "" },
  { class: "Beginner Notebook", session: "Session D", start: "13:00", end: "14:00", description: "" },
  { class: "Beginner Notebook", session: "Short Session 1", start: "14:00", end: "14:30", description: "" },

  { class: "Strategy", session: "Session A", start: "09:00", end: "10:00", description: "" },
  { class: "Strategy", session: "Session B", start: "10:00", end: "11:00", description: "" },
  { class: "Strategy", session: "Session C", start: "12:00", end: "13:00", description: "" },
  { class: "Strategy", session: "Session D", start: "13:00", end: "14:00", description: "" },
  { class: "Strategy", session: "Short Session 1", start: "14:00", end: "14:30", description: "" },

  { class: "Advanced Build", session: "Session A", start: "09:00", end: "10:30", description: "" },
  { class: "Advanced Build", session: "Short Session 1", start: "10:30", end: "11:00", description: "" },
  { class: "Advanced Build", session: "Session B", start: "12:00", end: "12:30", description: "" },
  { class: "Advanced Build", session: "Short Session 2", start: "13:30", end: "14:00", description: "" },
  { class: "Advanced Build", session: "Short Session 3", start: "14:00", end: "14:30", description: "" },

  { class: "Advanced Code", session: "Session A", start: "09:00", end: "10:30", description: "" },
  { class: "Advanced Code", session: "Short Session 1", start: "10:30", end: "11:00", description: "" },
  { class: "Advanced Code", session: "Session B", start: "12:00", end: "12:30", description: "" },
  { class: "Advanced Code", session: "Short Session 2", start: "13:30", end: "14:00", description: "" },
  { class: "Advanced Code", session: "Short Session 3", start: "14:00", end: "14:30", description: "" },

  { class: "Advanced Notebook", session: "Session A", start: "09:00", end: "10:00", description: "" },
  { class: "Advanced Notebook", session: "Session B", start: "10:00", end: "11:00", description: "" },
  { class: "Advanced Notebook", session: "Session C", start: "12:00", end: "13:00", description: "" },
  { class: "Advanced Notebook", session: "Session D", start: "13:00", end: "14:00", description: "" },
  { class: "Advanced Notebook", session: "Short Session 1", start: "14:00", end: "14:30", description: "" },

  { class: "Engage (IQ)", session: "Session A", start: "09:00", end: "10:00", description: "" },
  { class: "Engage (IQ)", session: "Session B", start: "10:00", end: "11:00", description: "" },
  { class: "Engage (IQ)", session: "Session C", start: "12:00", end: "13:00", description: "" },
  { class: "Engage (IQ)", session: "Session D", start: "13:00", end: "14:00", description: "" },
  { class: "Engage (IQ)", session: "Short Session 1", start: "14:00", end: "14:30", description: "" }
];
