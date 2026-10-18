# OARA Social Calendar & Reminder Hub (`https://github.com/CJ4477/oara_calender`)

Official Progressive Web App (PWA), Monthly Repo Sync & WhatsApp Wishes Hub for the **Orchid Avenue Residents Association (OARA)** Social Calendar (105 pre-loaded birthdays and anniversaries across all 12 months).

- **GitHub Repository**: [https://github.com/CJ4477/oara_calender](https://github.com/CJ4477/oara_calender)
- **Live Public App URL**: [https://cj4477.github.io/oara_calender/](https://cj4477.github.io/oara_calender/)
- **Password-Protected Admin Console**: [https://cj4477.github.io/oara_calender/admin/](https://cj4477.github.io/oara_calender/admin/) (or `#/admin`)

---

## 🌐 Public View vs. 🔒 Password-Protected Admin Console

1. **Public Resident View (`/`)**
   - Accessible at [https://cj4477.github.io/oara_calender/](https://cj4477.github.io/oara_calender/).
   - Residents can browse all 12 months, search celebrations, set custom reminder times, add/edit celebrations, and send bilingual Malayalam + English wishes to the **OARA WhatsApp Group**.
   - All test/simulation buttons, event deletion (`🗑️`), data reset/backup, and Monthly Repo Pack controls are hidden from the public view.

2. **Admin Console (`/admin` or `#/admin`)**
   - Accessible via [https://cj4477.github.io/oara_calender/admin/](https://cj4477.github.io/oara_calender/admin/) or by clicking **🛡️ Admin Console (/admin)** in the page footer.
   - Protected by a username and password login gate:
     - **Default Username**: `admin`
     - **Default Password**: `oara2026`
   - Once signed in, you unlock:
     - **🔊 Test & Simulation Controls**: Test In-App Alert & Chime, Test Closed-App Push (15s), Send Test Push to Phone, and Simulate Reminder Now
     - **🗑️ Delete Event** buttons on every row and inside the Edit modal
     - **⚙️ Backup / Restore** (JSON export, JSON import, and reset to original PDF data)
     - **📦 Monthly Repo Pack-Up & 1-Click Full App GitHub Deploy** (pre-configured for `CJ4477/oara_calender`)
     - **🔑 Credentials** button in the top Admin bar to customize your Admin username and password
     - **🔒 Logout** button to lock the Admin Console immediately

---

## 🚀 Deploying Latest Changes to `https://github.com/CJ4477/oara_calender`

### Option A: 1-Click In-Browser GitHub Deploy (No Terminal Needed)
1. Open the app and sign in to **🛡️ Admin Console (/admin)** (`admin` / `oara2026`).
2. Click **📦 Monthly Repo Pack** (or **🚀 GitHub Repo Commit / Setup**).
3. Enter your **GitHub Personal Access Token** (`repo` / `contents:write` permission) and click **🌐 Deploy Full App & Latest Changes to `CJ4477/oara_calender`**.
4. The app automatically commits `index.html`, `404.html`, `admin/index.html`, `sw.js`, `manifest.json`, `data/oara_events.json`, and `README.md` directly to `https://github.com/CJ4477/oara_calender`.

### Option B: Command-Line Git Push (Using Included Script)
Unzip `oara_mobile_pwa_deploy.zip` and run:
```bash
chmod +x deploy_to_github.sh
./deploy_to_github.sh
```

---

## 📲 Real Mobile Notifications on iOS & Android (Even When App Is Closed)

### 1. Cloud-Scheduled & Daily Push Notifications (`ntfy.sh` + GitHub Actions)
- Install the free **ntfy** app on iPhone (App Store) or Android (Google Play) and subscribe to your topic (default: `oara-social-calendar-alerts`).
- Saving a reminder time pre-schedules Today's & Tomorrow's alerts on `ntfy.sh` cloud servers (`At:` timer) and syncs with the background Service Worker (`sw.js`).
- The included workflow (`.github/workflows/daily_oara_notifications.yml`) also runs daily at **08:00 AM IST**.

### 2. Native Phone Calendar Lock-Screen Alarms (`.ics` Sync)
1. Open the app and tap **📱 iOS / Android Setup** in the top bar.
2. Tap **📅 Download .ics Alarm File (All Events)** to add all 105 recurring OARA celebrations to Apple Calendar / Google Calendar.
