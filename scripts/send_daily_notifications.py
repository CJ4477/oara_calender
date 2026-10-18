#!/usr/bin/env python3
"""
Reads data/oara_events.json (packed into the repo each month) and sends real Push
Notifications to iOS & Android devices via ntfy.sh at the scheduled time,
plus a monthly repo pack-up reminder on the 1st and 28th of every month.
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

    events = data.get('events', [])
    todays = [e for e in events if e.get('month') == month and e.get('day') == day and e.get('reminderEnabled', True)]

    if todays:
        names = ", ".join(f"{e['name']} ({e['type']})" for e in todays)
        title = f"OARA Celebrations Today ({day:02d}/{month:02d})"
        body = (
            f"Today's OARA Celebrations: {names}\n\n"
            f"Open the OARA Social Calendar app to send bilingual Malayalam/English wishes to the WhatsApp group!"
        )
        send_ntfy(topic, title, body, tags="tada,birthday,calendar")
        print(f"Sent push notification for {len(todays)} celebration(s): {names}")
    else:
        print(f"No OARA celebrations on {day:02d}/{month:02d}.")

    # Monthly Repo Pack-Up reminder on the 28th of each month
    if day == 28:
        send_ntfy(
            topic,
            "📦 OARA Monthly Repo Pack-Up Reminder",
            "End of month approaching! Open the OARA app and tap '📦 Monthly Repo Pack' to commit any new or edited events to the GitHub repository.",
            tags="package,calendar"
        )

def send_ntfy(topic, title, message, tags="calendar"):
    url = f"https://ntfy.sh/{topic}"
    req = urllib.request.Request(
        url,
        data=message.encode('utf-8'),
        headers={
            "Title": title,
            "Priority": "high",
            "Tags": tags
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            print("ntfy response:", resp.status)
    except Exception as exc:
        print("Warning sending ntfy push:", exc)

if __name__ == '__main__':
    main()
