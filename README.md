# OARA Social Calendar & Reminder Hub (`https://github.com/CJ4477`)

Official Progressive Web App (PWA), Monthly Repo Sync & WhatsApp Wishes Hub for the **Orchid Avenue Residents Association (OARA)** Social Calendar (105 pre-loaded birthdays and anniversaries across all 12 months).

- **GitHub Repository**: [https://github.com/CJ4477](https://github.com/CJ4477)

---

## 🌐 Public View vs. 🔒 Password-Protected Admin Console

1. **Public Resident View (`/`)**
   - Accessible at your main GitHub Pages URL (e.g., `https://cj4477.github.io/...` or `https://clintjoy.github.io/CJ4477/`).
   - Residents can browse all 12 months, search celebrations, set custom reminder times, add/edit celebrations, and send bilingual Malayalam + English wishes to the **OARA WhatsApp Group**.
   - Event deletion (`🗑️`), data reset/backup, and Monthly Repo Pack controls are completely hidden from the public view.

2. **Admin Console (`/admin` or `#/admin`)**
   - Accessible via `/admin` (e.g., `.../admin`) or by clicking **🔒 Admin Console (/admin)** in the page footer.
   - Protected by a username and password login gate:
     - **Default Username**: `admin`
     - **Default Password**: `oara2026`
   - Once signed in, you unlock:
     - **🗑️ Delete Event** buttons on every row and inside the Edit modal
     - **⚙️ Backup / Restore** (JSON export, JSON import, and reset to original PDF data)
     - **📦 Monthly Repo Pack-Up & 1-Click GitHub Commit** (pre-configured for `https://github.com/CJ4477`)
     - **🔑 Credentials** button in the top Admin bar to customize your Admin username and password
     - **🔒 Logout** button to lock the Admin Console immediately

---

## 📦 Monthly Data Pack-Up to GitHub Repository (`https://github.com/CJ4477`)

At the end of each month (or whenever celebrations are added/updated):
1. Sign in to the **Admin Console** (`/admin`).
2. Click **📦 Monthly Repo Pack** in the top Admin bar (or **📦 Pack Current Month JSON** / **⬇️ Pack All 12 Months (`oara_events.json`)**).
3. You can either:
   - **Download JSON**: Save `oara_events.json` (or `month-XX.json`) and commit it to the `data/` folder in [https://github.com/CJ4477](https://github.com/CJ4477), **OR**
   - **Direct 1-Click GitHub Commit**: Enter your repository (`https://github.com/CJ4477`) and a GitHub Personal Access Token (`repo` / `contents:write` scope) to commit `data/oara_events.json` directly from your phone or browser.

---

## 📲 Real Mobile Notifications on iOS & Android

### 1. Automated Daily Push Notifications (`ntfy.sh` + GitHub Actions)
- The included workflow (`.github/workflows/daily_oara_notifications.yml`) and script (`scripts/send_daily_notifications.py`) run automatically every day at **08:00 AM IST** (and on the 28th of every month for a Monthly Repo Pack reminder).
- Install the free **ntfy** app on iPhone (App Store) or Android (Google Play) and subscribe to your topic (default: `oara-social-calendar-alerts`, or set `NTFY_TOPIC` in your GitHub repository secrets).

### 2. Native Phone Calendar Lock-Screen Alarms (`.ics` Sync)
1. Open the app and tap **📱 iOS / Android Setup** in the top bar.
2. Set your preferred reminder time (e.g., `08:00 AM`) and tap **📅 Download .ics Alarm File (All Events)**.
3. Open the downloaded `.ics` file on iOS (Apple Calendar) or Android (Google Calendar) to get offline lock-screen alarms for all 105 yearly celebrations.

---

## 📱 Install as an App on iOS & Android (PWA)

- **Android (Chrome)**: Open your deployed GitHub Pages URL in Chrome → tap **Install App** (or `⋮` → **Add to Home screen**).
- **iPhone / iPad (Safari)**: Open your deployed GitHub Pages URL in Safari → tap **Share** → **Add to Home Screen** → **Add**.
