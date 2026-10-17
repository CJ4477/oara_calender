
## 🔒 Admin Console Login (`https://clintjoy.github.io/oara_calender/admin`)
The Admin Console is protected by a username and password prompt so regular visitors cannot delete events, reset data, or trigger monthly repo packs.
- **Default Username**: `admin`
- **Default Password**: `oara2026`
- **Change Credentials**: Once signed in to `/admin`, click **🔑 Credentials** in the top Admin bar to customize the username and password, or click **🔒 Logout** to lock the console.

# OARA Social Calendar & Reminder Hub (iOS & Android Deployment Package)

This folder is a complete, ready-to-deploy **Progressive Web App (PWA)** and **Capacitor Mobile Package** for the **Orchid Avenue Residents Association (OARA)** Social Calendar.

---

## Option 1: Fastest Free Cloud Deployment (Works on iOS & Android in 30 Seconds)

Because this package includes `index.html`, `manifest.json`, `sw.js`, and app icons (`icon-192.png`, `icon-512.png`), you can host it for free on any static host and install it directly onto both **iPhone/iPad (iOS)** and **Android**:

### Step A — Deploy to a Free HTTPS URL
1. **Netlify Drop (Easiest, No Coding Required):**
   - Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop this unzipped `oara_mobile_pwa_deploy` folder onto the page.
   - Netlify immediately gives you a live `https://...netlify.app` link (you can rename it to e.g. `https://oara-calendar.netlify.app`).
2. **Alternative Free Hosts:**
   - **Vercel:** Run `npx vercel` inside this folder or import to [vercel.com](https://vercel.com).
   - **GitHub Pages:** Upload these files to a GitHub repository and enable **Settings → Pages**.

### Step B — Install on Android & iOS
- **On Android (Chrome):**
  1. Open your deployed `https://...` URL in Chrome.
  2. Tap **"Install App"** on the prompt (or tap `⋮` → **Install app / Add to Home screen**).
  3. The **OARA Calendar** app icon is added to your phone launcher and opens full-screen like a native app.
- **On iPhone / iPad (iOS Safari):**
  1. Open your deployed `https://...` URL in **Safari**.
  2. Tap the **Share** button (square with an upward arrow at the bottom).
  3. Tap **"Add to Home Screen"** → **Add**.
  4. Launch **OARA Calendar** from your iOS Home Screen full-screen.

---

## Option 2: 100% Reliable Lock-Screen Alarms on iOS & Android (`.ics` Sync)

Mobile operating systems pause background browser tabs when your phone is locked. To get guaranteed native lock-screen alarms on both iOS and Android:
1. Open the app and tap **📱 iOS / Android Setup** in the top bar.
2. Set your preferred reminder time (e.g., `08:00 AM`) and tap **📅 Download .ics Alarm File (All Events)**.
3. Open the downloaded `.ics` file on your iPhone (imports into **Apple Calendar**) or Android (imports into **Google / Samsung Calendar**). All 105 recurring OARA birthdays and anniversaries will ring at your exact chosen time even offline!

---

## Option 3: Build a Native `.apk` (Android) or `.ipa` (iOS) with Capacitor

If you ever want to compile a standalone Android `.apk` or iOS Xcode project:
```bash
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
npx cap copy
npx cap open android   # Opens Android Studio to build .apk
npx cap open ios       # Opens Xcode on macOS to build iOS app
```
