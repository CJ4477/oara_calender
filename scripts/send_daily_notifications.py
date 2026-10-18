#!/usr/bin/env python3
"""
Reads data/oara_events.json (packed into the repo each month) and sends real Push
Notifications to iOS & Android devices via ntfy.sh.
If an event has a customTime (or defaultReminderTime) later in the day, it uses
ntfy.sh's 'At:' scheduled delivery header so the phone rings at the exact configured
time even when the web app is completely closed!
"""
import datetime
import json
import os
import urllib.request

IST = datetime.timezone(datetime.timedelta(hours=5, minutes=30))

def main():
    now_ist = datetime.datetime.now(IST)
    month = now_ist.month
    day = now_ist.day
    topic = os.environ.get('NTFY_TOPIC', 'oara-social-calendar-alerts').strip()

    with open('data/oara_events.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    default_time = data.get('defaultReminderTime', '08:00') or '08:00'
    events = data.get('events', [])
    todays = [e for e in events if e.get('month') == month and e.get('day') == day and e.get('reminderEnabled', True)]

    if todays:
        for ev in todays:
            rem_time = (ev.get('customTime') or default_time).strip()
            try:
                hh, mm = [int(x) for x in rem_time.split(':')[:2]]
            except Exception:
                hh, mm = 8, 0
            target_dt = datetime.datetime(now_ist.year, month, day, hh, mm, 0, tzinfo=IST)
            target_unix = int(target_dt.timestamp())
            now_unix = int(now_ist.timestamp())

            title = f"OARA Celebration Today: {ev['name']} ({ev['type']})"
            body = (
                f"Today is {ev['name']}'s {ev['type']} ({day:02d}/{month:02d})!\n"
                f"Open the OARA Social Calendar app to send wishes to the WhatsApp group."
            )
            at_header = str(target_unix) if target_unix > now_unix + 30 else None
            send_ntfy(topic, title, body, tags="tada,birthday,calendar", at_timestamp=at_header)
            print(f"Dispatched notification for {ev['name']} (scheduled_at={at_header or 'immediate'})")
    else:
        print(f"No OARA celebrations on {day:02d}/{month:02d}.")

    # Monthly Repo Pack-Up reminder on the 28th of each month
    if day == 28:
        send_ntfy(
            topic,
            "📦 OARA Monthly Repo Pack-Up Reminder",
            "End of month approaching! Open the OARA Admin Console (/admin) and tap '📦 Monthly Repo Pack' to commit any new or edited events to the GitHub repository.",
            tags="package,calendar"
        )

def send_ntfy(topic, title, message, tags="calendar", at_timestamp=None):
    url = f"https://ntfy.sh/{topic}"
    headers = {
        "Title": title,
        "Priority": "high",
        "Tags": tags
    }
    if at_timestamp:
        headers["At"] = str(at_timestamp)
    req = urllib.request.Request(
        url,
        data=message.encode('utf-8'),
        headers=headers,
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print("ntfy response:", resp.status)
    except Exception as exc:
        print("Warning sending ntfy push:", exc)

if __name__ == '__main__':
    main()
