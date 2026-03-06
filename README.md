# Domestic Status Logger – Specification

## 1. Overview

The **Domestic Status Logger** is a lightweight web application for recording everyday domestic activities as timestamped events.

The system is designed to be:

* extremely quick to use
* easy to deploy
* simple to maintain
* fully supported by **Netlify serverless infrastructure**

The core idea is that the user logs **Statuses**, which represent activities or conditions. Each log entry records:

* a **timestamp**
* a **status**
* an optional **numeric value**

Example logs:

```
20:14 Cooked dinner
20:25 Washed dishes
20:40 Read book (mins) 10
21:10 Water (ml) 250
```

The system supports both:

* **Simple statuses** (timestamp only)
* **Value statuses** (timestamp + numeric measurement)

The application prioritises:

1. **Fast homepage logging**
2. **Large built-in status library**
3. **Minimal configuration**
4. **Simple analytics from accumulated logs**

---

# 2. Core Concepts

## Status

A **Status** is a predefined activity that can be logged.

Examples:

```
Cooked dinner
Cleaned kitchen
Read book (mins)
Water (ml)
Walk (mins)
```

Statuses belong to a **Motive category** and may optionally include a numeric value.

---

## Log Entry

A **Log Entry** records when a status occurs.

Example:

```
timestamp: 2026-03-06 20:15
status: read_book
value: 10
```

For simple statuses:

```
timestamp: 2026-03-06 20:05
status: cleaned_kitchen
```

---

## Motive

A **Motive** groups statuses based on purpose.

Examples:

* Domestic Maintenance
* Food
* Wellbeing
* Productivity
* Leisure
* Social

Motives organise the status library and allow simple analytics.

---

# 3. Status Types

## 3.1 Simple Status

A simple status records only a timestamp.

Example:

```
Cleaned kitchen
```

Log entry:

```
timestamp: 20:15
status: cleaned_kitchen
```

These are used for discrete events.

Examples:

* Cooked dinner
* Showered
* Took bins out
* Paid bill

---

## 3.2 Value Status

A value status records a timestamp **plus a numeric value**.

Example status definitions:

```
Read book (mins)
Water (ml)
Walk (mins)
Coffee (cups)
```

Example logs:

```
Read book (mins) 10
Water (ml) 250
Walk (mins) 30
```

These enable simple quantitative analytics.

---

# 4. Default Values

Value statuses include a **default value**.

This enables **one-click logging**.

Example definitions:

```
Read book (mins) → default 10
Water (ml) → default 250
Milk (ml) → default 150
Walk (mins) → default 20
Coffee (cups) → default 1
```

### Logging Behaviour

When the user clicks a value status:

```
Read book (mins)
```

The system logs:

```
Read book 10 mins
```

The value can optionally be adjusted before saving.

---

# 5. Homepage Logging Interface

The homepage is the **primary interaction surface**.

Design goals:

* extremely fast logging
* minimal friction
* clear visual organisation

## Layout

### Search Bar

Allows quick discovery of statuses.

```
Search statuses...
```

---

### Status Grid

Grid of commonly used statuses.

Example:

```
[ Cooked dinner ]
[ Cleaned kitchen ]
[ Read book 10m ]
[ Walk 20m ]
[ Water 250ml ]
[ Made coffee ]
```

Behaviour:

* **Simple status:** logs immediately
* **Value status:** logs using default value

---

### Recent Activity

Shows the most recent log entries.

Example:

```
20:14 Cooked dinner
20:25 Washed dishes
20:40 Read book 10m
21:10 Water 250ml
```

---

# 6. Status Library

The system includes a **large built-in library (~100 statuses)**.

Users can:

* enable or disable statuses
* reorder statuses
* add custom statuses
* move statuses between motives

---

# 7. Built-In Status Library

## 7.1 Domestic Maintenance

Kitchen:

```
Cleaned kitchen — simple
Washed dishes — simple
Loaded dishwasher — simple
Unloaded dishwasher — simple
Wiped surfaces — simple
Took bins out — simple
```

General cleaning:

```
Tidied house — simple
Vacuumed — simple
Mopped floor — simple
Dusted — simple
Cleaned bathroom — simple
Cleaned toilet — simple
Cleaned shower — simple
Changed bedding — simple
```

Laundry:

```
Started laundry — simple
Hung laundry — simple
Folded laundry — simple
Put laundry away — simple
```

---

## 7.2 Food

Cooking:

```
Cooked breakfast — simple
Cooked lunch — simple
Cooked dinner — simple
Prepared snack — simple
Baked — simple
Meal prep — simple
```

Eating:

```
Ate breakfast — simple
Ate lunch — simple
Ate dinner — simple
Ate snack — simple
Takeaway meal — simple
Restaurant meal — simple
```

Drinks:

```
Water (ml) — value — default 250
Milk (ml) — value — default 150
Juice (ml) — value — default 200
Tea (cups) — value — default 1
Coffee (cups) — value — default 1
Alcohol (units) — value — default 1
```

---

## 7.3 Shopping

```
Grocery shopping — simple
Online grocery order — simple
Household supplies shopping — simple
Pharmacy visit — simple
Received delivery — simple
```

---

## 7.4 Personal Wellbeing

Hygiene:

```
Showered — simple
Bath — simple
Brushed teeth — simple
Skincare — simple
Hair wash — simple
```

Health tracking:

```
Weight (kg) — value — default 75
Steps — value — default 1000
Water intake (ml) — value — default 250
```

---

## 7.5 Exercise

```
Walk (mins) — value — default 20
Run (mins) — value — default 20
Cycle (mins) — value — default 30
Workout (mins) — value — default 30
Stretching (mins) — value — default 10
Yoga (mins) — value — default 20
Gym session — simple
Sports activity (mins) — value — default 45
```

---

## 7.6 Productivity

```
Worked on job (mins) — value — default 30
Deep work (mins) — value — default 30
Admin tasks (mins) — value — default 20
Emails — simple
Planning — simple
Studied (mins) — value — default 30
Side project (mins) — value — default 30
Learning (mins) — value — default 20
```

---

## 7.7 Reading & Media

```
Read book (mins) — value — default 10
Read article — simple
News reading (mins) — value — default 10
Podcast (mins) — value — default 20
Audiobook (mins) — value — default 20
```

---

## 7.8 Leisure

```
Watched TV (mins) — value — default 30
Movie — simple
YouTube (mins) — value — default 20
Video game (mins) — value — default 30
Browsing internet (mins) — value — default 15
Social media (mins) — value — default 10
Music listening (mins) — value — default 20
```

---

## 7.9 Social

```
Called friend — simple
Called family — simple
Met friend — simple
Hosted guest — simple
Visited someone — simple
Event attended — simple
```

---

## 7.10 Sleep

```
Went to bed — simple
Woke up — simple
Sleep (hours) — value — default 7
Nap (mins) — value — default 20
```

---

## 7.11 Home Admin

```
Paid bill — simple
Budgeting — simple
House admin (mins) — value — default 20
Booking appointment — simple
Maintenance task — simple
```

---

## 7.12 Outdoor / Errands

```
Went outside — simple
Commute — simple
Walked outside (mins) — value — default 20
Errands run — simple
Park visit — simple
```

---

# 8. Data Model

## Motive

```
Motive
- id
- name
- order
```

---

## Status

```
Status
- id
- label
- motive_id
- type ("simple" | "value")
- unit (optional)
- default_value (optional)
- enabled
- order
```

Example:

```
id: read_book
label: Read book
type: value
unit: mins
default_value: 10
motive_id: leisure
```

---

## Log Entry

```
LogEntry
- id
- status_id
- timestamp
- value (optional)
```

Examples:

Simple status:

```
status: cleaned_kitchen
timestamp: 20:15
```

Value status:

```
status: read_book
timestamp: 21:00
value: 10
```

---

# 9. Analytics

Basic analytics derived from logs.

## Daily Summary

Example:

```
Today

Domestic
- Cleaned kitchen
- Washed dishes

Food
- Cooked dinner
- Water 750ml

Leisure
- Read book 30 mins
```

---

## Weekly Totals

Example:

```
Read book: 220 mins
Walk: 150 mins
Water: 6000 ml
```

---

## Status Counts

Simple statuses counted:

```
Cooked dinner — 5
Cleaned kitchen — 3
Showered — 7
```

---

# 10. Netlify Architecture

The entire application must run using **Netlify infrastructure**.

## Frontend

Static web application.

Possible frameworks:

* React
* Svelte
* Vue

Hosted on Netlify.

---

## Backend

Serverless functions.

Endpoints:

```
GET /statuses
GET /logs
POST /log
GET /summary
```

---

## Storage

Simple JSON or Netlify database.

Collections:

```
motives.json
statuses.json
logs.json
```

---

# 11. Logging Flow

```
User clicks status
↓
Frontend sends POST /log
↓
Netlify Function stores log entry
↓
Frontend displays success confirmation
```

Example confirmation:

```
✓ Logged: Read book 10 mins
```

---

# 12. Design Principles

## Frictionless Logging

Logging should require **one tap whenever possible**.

---

## Rich Default Library

Users should be able to start using the app **without configuration**.

---

## Quantitative Insight

Value statuses allow:

* time tracking
* hydration tracking
* exercise tracking
* activity measurement

---

## Simple Mental Model

Every event is:

```
timestamp
status
(optional value)
```

This simplicity allows the system to scale without complexity.
