const CACHE_NAME = 'oara-calendar-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './data/oara_events.json'
];

let swState = {
  events: [],
  settings: {
    masterEnabled: true,
    defaultTime: '08:00',
    advanceOption: 'same_day'
  },
  firedKeys: {},
  scheduledTimers: []
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-First with Offline Cache Fallback so GitHub Pages updates always show immediately
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((networkResp) => {
        if (networkResp && networkResp.status === 200 && event.request.url.startsWith(self.location.origin)) {
          const respClone = networkResp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone)).catch(() => {});
        }
        return networkResp;
      })
      .catch(() => caches.match(event.request))
  );
});

function computeMsUntilReminder(ev, settings, now) {
  if (!settings || !settings.masterEnabled || ev.reminderEnabled === false) return -1;
  const remTime = ev.customTime || settings.defaultTime || '08:00';
  const parts = remTime.split(':');
  const hh = parseInt(parts[0], 10) || 8;
  const mm = parseInt(parts[1], 10) || 0;

  for (let offsetDays = 0; offsetDays <= 1; offsetDays++) {
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays, hh, mm, 0);
    const diffMs = target.getTime() - now.getTime();
    if (diffMs < -55000) continue;

    const isSameDay = (target.getMonth() + 1 === ev.month) && (target.getDate() === ev.day);
    const nextDay = new Date(target.getFullYear(), target.getMonth(), target.getDate() + 1);
    const isDayBefore = (nextDay.getMonth() + 1 === ev.month) && (nextDay.getDate() === ev.day);

    const opt = settings.advanceOption || 'same_day';
    if ((isSameDay && (opt === 'same_day' || opt === 'both')) ||
        (isDayBefore && (opt === 'day_before' || opt === 'both'))) {
      return Math.max(0, diffMs);
    }
  }
  return -1;
}

self.addEventListener('message', (event) => {
  const data = event.data || {};

  if (data.type === 'SCHEDULE_DELAYED_NOTIFICATION') {
    const delayMs = Math.max(1000, Number(data.delayMs) || 15000);
    const title = data.title || '🎉 OARA Social Calendar Reminder';
    const body = data.body || 'Celebration reminder! Tap to open the OARA Social Calendar and send WhatsApp wishes.';

    event.waitUntil(
      new Promise((resolve) => {
        setTimeout(() => {
          self.registration.showNotification(title, {
            body: body,
            icon: './icon-192.png',
            badge: './icon-192.png',
            tag: 'oara-delayed-test-' + Date.now(),
            renotify: true,
            requireInteraction: true,
            vibrate: [250, 120, 250, 120, 300]
          }).then(resolve).catch(resolve);
        }, delayMs);
      })
    );
    return;
  }

  if (data.type === 'SYNC_REMINDERS') {
    swState.events = Array.isArray(data.events) ? data.events : swState.events;
    swState.settings = Object.assign({}, swState.settings, data.settings || {});

    // Clear old timers
    swState.scheduledTimers.forEach((id) => clearTimeout(id));
    swState.scheduledTimers = [];

    const now = new Date();
    const nearWaitPromises = [];

    swState.events.forEach((ev) => {
      const diffMs = computeMsUntilReminder(ev, swState.settings, now);
      if (diffMs < 0) return;

      const icon = ev.type === 'BIRTHDAY' ? '🎂 Birthday' : '💍 Anniversary';
      const title = `🎉 OARA Reminder: ${ev.name}`;
      const body = `${ev.name} (${icon})! Tap to open the OARA app and send WhatsApp group wishes.`;
      const fireKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}_${ev.id}_${ev.customTime || swState.settings.defaultTime}`;

      // 1. Use TimestampTrigger API if browser supports OS-scheduled notifications
      if (' TimestampTrigger' in self || 'TimestampTrigger' in self) {
        try {
          self.registration.showNotification(title, {
            body: body,
            icon: './icon-192.png',
            badge: './icon-192.png',
            tag: fireKey,
            showTrigger: new self.TimestampTrigger(now.getTime() + diffMs)
          }).catch(() => {});
        } catch (e) {}
      }

      // 2. For reminders due within the next 30 minutes, hold a Service Worker wake timer
      if (diffMs <= 30 * 60 * 1000 && !swState.firedKeys[fireKey]) {
        const p = new Promise((resolve) => {
          const tid = setTimeout(() => {
            if (!swState.firedKeys[fireKey]) {
              swState.firedKeys[fireKey] = true;
              self.registration.showNotification(title, {
                body: body,
                icon: './icon-192.png',
                badge: './icon-192.png',
                tag: fireKey,
                renotify: true,
                requireInteraction: true,
                vibrate: [250, 120, 250]
              }).then(resolve).catch(resolve);
            } else {
              resolve();
            }
          }, diffMs);
          swState.scheduledTimers.push(tid);
        });
        nearWaitPromises.push(p);
      }
    });

    if (nearWaitPromises.length > 0) {
      event.waitUntil(Promise.all(nearWaitPromises));
    }
  }
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'oara-daily-reminder-check') {
    event.waitUntil(
      fetch(['.', 'data', 'oara_events.json'].join('/'), { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data || !Array.isArray(data.events)) return;
          const now = new Date();
          const m = now.getMonth() + 1;
          const d = now.getDate();
          const todays = data.events.filter((e) => e.month === m && e.day === d && e.reminderEnabled !== false);
          if (todays.length > 0) {
            const names = todays.map((e) => `${e.name} (${e.type})`).join(', ');
            return self.registration.showNotification('🎉 OARA Celebrations Today!', {
              body: `${names} — Tap to send WhatsApp wishes!`,
              icon: './icon-192.png',
              badge: './icon-192.png',
              tag: `oara-periodic-${now.getFullYear()}-${m}-${d}`
            });
          }
        })
        .catch(() => {})
    );
  }
});

self.addEventListener('push', (event) => {
  let payload = { title: '🎉 OARA Social Calendar Reminder', body: "Check today's celebrations and send WhatsApp wishes!" };
  if (event.data) {
    try {
      payload = Object.assign(payload, event.data.json());
    } catch (e) {
      payload.body = event.data.text();
    }
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      requireInteraction: true,
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('./');
    })
  );
});
