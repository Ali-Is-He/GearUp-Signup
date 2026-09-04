# GearUp-Signup
Sign up tool for PWCS Gear Up.

A static sign-up page (hosted on GitHub Pages) where students click sessions
on a calendar-style grid to say which ones they're interested in throughout
the day — similar to a college course registration screen. Picking a session
that overlaps one already picked swaps it out automatically. Submissions are
saved to a Google Sheet via a Google Apps Script Web App — no backend/server
needed.

## How it's structured

- `index.html`, `style.css`, `script.js` — the sign-up page. `script.js`
  builds the grid from `schedule.js`, so you only need to edit that one file
  when times/classes/descriptions change.
- `schedule.js` — `CLASSES` (column order), `SESSIONS` (every clickable
  session with its class, time range, and description), and `BREAKS`
  (non-interactive blocks like lunch). Add session descriptions here as
  they're finalized — the `description` field on each session is currently
  blank (shown as a tooltip on hover until then).
- `config.js` — holds the Google Apps Script Web App URL the form submits to.
- `apps-script/Code.gs` — the script to paste into the Google Sheet's Apps
  Script editor. It appends one row per submission.

## One-time setup

### 1. Create the Google Sheet + Apps Script

1. Create a new Google Sheet (e.g. "GearUp Signups").
2. In the Sheet, go to **Extensions > Apps Script**.
3. Delete any starter code and paste in the contents of `apps-script/Code.gs`.
4. Click **Deploy > New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, authorize the permissions it asks for, and copy the Web
   App URL it gives you (ends in `/exec`).
6. The first submission will auto-create a "Signups" tab with headers, so you
   don't need to set up columns by hand.

### 2. Connect the form to it

Open `config.js` and replace the placeholder with the Web App URL from step
above:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
```

### 3. Enable GitHub Pages

1. Push this repo to GitHub (if not already).
2. Go to **Settings > Pages** on the repo.
3. Under "Build and deployment", set source to **Deploy from a branch**,
   branch `main`, folder `/ (root)`.
4. Save — GitHub will give you a URL like
   `https://<username>.github.io/GearUp-Signup/`.

That's it — share that URL with students.

## Updating the schedule later

Everything about classes, sessions, times, and descriptions lives in
`schedule.js`. Edit the `description` fields as they're written, or adjust
times/classes if the schedule changes — the form updates automatically.

## Redeploying the Apps Script after edits

If you change `apps-script/Code.gs`, you need to redeploy for changes to take
effect: in the Apps Script editor, **Deploy > Manage deployments > Edit
(pencil icon) > New version > Deploy**. The Web App URL stays the same.
