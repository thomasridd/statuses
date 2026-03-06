# statuses
SPEC.md

Domestic Dashboard & Analytics Platform

1. Overview

This specification defines the architecture, data models, UI, analytics insights, and logging system for a Domestic Dashboard Analytics Application.

The application provides:
	•	A Domestic Operations Dashboard
	•	Analytics & Insights
	•	Status Tracking
	•	Structured Logging and Observability
	•	Event-driven architecture

The system is intended to support operational monitoring, analytics exploration, and debugging of domestic workflows.

⸻

2. System Goals

Primary Objectives
	1.	Provide a central dashboard for domestic system operations.
	2.	Deliver analytics insights about usage and performance.
	3.	Maintain real-time status tracking for system entities.
	4.	Enable traceability and debugging using structured logging.
	5.	Support scalable analytics and observability.

⸻

3. High-Level Architecture

                ┌─────────────────────────┐
                │       Frontend UI        │
                │   Domestic Dashboard     │
                └───────────┬──────────────┘
                            │
                            ▼
                ┌─────────────────────────┐
                │        API Layer         │
                │  Dashboard / Analytics   │
                └───────────┬──────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
 │ Status Store │   │ Event Stream │   │ Log Pipeline │
 │  (Postgres)  │   │ (Kafka)      │   │ (OpenTelemetry)│
 └──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
 ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
 │ Analytics DB │   │ Data Lake    │   │ Observability │
 │ (Warehouse)  │   │              │   │ (ELK/Grafana) │
 └──────────────┘   └──────────────┘   └──────────────┘


⸻

4. Frontend Dashboard UI

Dashboard Layout

The Domestic Dashboard consists of several primary UI sections.

---------------------------------------------------
Top Navigation
---------------------------------------------------

KPI Summary Cards

---------------------------------------------------
Charts / Analytics Panels
---------------------------------------------------

Operational Status Table

---------------------------------------------------
Event Logs / Activity Feed
---------------------------------------------------


⸻

4.1 Navigation

Main navigation includes:
	•	Dashboard
	•	Analytics
	•	Entities
	•	Logs
	•	Settings

⸻

4.2 KPI Summary Cards

Displays key operational metrics.

Example metrics:

Metric	Description
Total Entities	Total items in system
Active Jobs	Jobs currently processing
Failures	Total failed jobs
Success Rate	Completion rate
Avg Processing Time	Average task duration

Example UI:

[ Total Entities ]
[ Active Jobs ]
[ Failures ]
[ Success Rate ]


⸻

4.3 Analytics Panels

Visual components displaying system insights.

Examples:
	•	Requests over time
	•	Success vs failure rates
	•	System throughput
	•	Latency distribution
	•	Worker utilization

Charts:
	•	Line charts
	•	Bar charts
	•	Heatmaps
	•	Pie charts

⸻

4.4 Operational Status Table

Shows live system entities.

Columns:

Column	Description
Entity ID	Unique identifier
Type	Entity type
Status	Current status
Updated	Last update time
Owner	Service or user
Metadata	Additional info

Example:

Entity ID | Type | Status | Updated
--------------------------------------
123       | Job  | RUNNING | 10:04
124       | Job  | FAILED  | 10:01


⸻

4.5 Event Activity Feed

Displays recent events and transitions.

Example:

10:05 Job 123 STARTED
10:06 Job 123 FAILED
10:07 Job 124 STARTED


⸻

5. Analytics Insights

Analytics components provide operational insights.

Key Insights

1. System Health

Metrics:
	•	success rate
	•	failure rate
	•	retry rate

Visualization:
	•	stacked bar charts
	•	percentage indicators

⸻

2. Throughput

Measures system performance.

Metrics:
	•	requests per minute
	•	jobs processed per hour
	•	peak load periods

Visualization:
	•	time series charts

⸻

3. Latency Analysis

Track performance.

Metrics:
	•	average processing time
	•	p95 latency
	•	p99 latency

Visualization:
	•	distribution graphs
	•	box plots

⸻

4. Failure Analysis

Identify system problems.

Metrics:
	•	failures by reason
	•	failures by service
	•	failures over time

⸻

5. Operational Insights

Example derived insights:
	•	busiest time of day
	•	most common failure reason
	•	average retries per job
	•	service reliability

⸻

6. Status Data Model

The Status Data Model represents the current state of system entities.

Entities can represent:
	•	jobs
	•	workflows
	•	tasks
	•	requests

⸻

6.1 EntityStatus Table

EntityStatus
-------------
id (UUID)
entity_id (UUID)
entity_type (string)

status (enum)
status_reason (string)

updated_at (timestamp)
updated_by (string/service)

version (int)
metadata (jsonb)


⸻

6.2 Status Enum

PENDING
PROCESSING
SUCCEEDED
FAILED
CANCELLED
RETRYING


⸻

6.3 Example Row

entity_id	entity_type	status	updated_at
123	job	PROCESSING	10:05


⸻

7. Status Transition Model

Tracks historical state changes.

StatusTransition
----------------
id (UUID)

entity_id (UUID)

from_status (enum)
to_status (enum)

trigger (string)
reason (string)

timestamp (timestamp)
actor (user/service)

correlation_id (UUID)


⸻

Example

from	to	trigger
PENDING	PROCESSING	worker-start
PROCESSING	FAILED	timeout


⸻

8. Logging Architecture

Logs capture system events and diagnostics.

Logs must be structured JSON.

⸻

LogEvent Schema

LogEvent
---------
timestamp

level
service
environment

message

trace_id
span_id
correlation_id

entity_id
entity_type

event_type

payload (json)

host
version


⸻

Example Log Event

{
  "timestamp": "2026-03-06T10:05:21Z",
  "level": "INFO",
  "service": "payment-service",
  "event_type": "STATUS_CHANGED",
  "entity_id": "123",
  "from_status": "PENDING",
  "to_status": "PROCESSING",
  "trace_id": "abc123",
  "payload": {
    "worker": "processor-4"
  }
}


⸻

9. Event & Logging Flow

When a status changes:

1. Service processes request
2. Status updated in database
3. StatusTransition recorded
4. LogEvent emitted
5. Event optionally published to stream

Example flow:

API receives request
      │
      ▼
Create entity
      │
status = PENDING
      │
log: ENTITY_CREATED
      │
worker picks task
      │
status = PROCESSING
      │
log: STATUS_CHANGED


⸻

10. Observability Architecture

Application Services
        │
        │ emit logs/events
        ▼
Structured Logger
        │
        ▼
Log Pipeline
(FluentBit / Logstash / OpenTelemetry)
        │
        ├────────► Observability (Grafana / ELK)
        │
        ▼
Event Stream
(Kafka / PubSub / Kinesis)
        │
        ▼
Event Store / Data Lake


⸻

11. Database Schema

Entity Status

CREATE TABLE entity_status (
  entity_id UUID PRIMARY KEY,
  entity_type TEXT,
  status TEXT,
  status_reason TEXT,
  updated_at TIMESTAMP,
  updated_by TEXT,
  version INT,
  metadata JSONB
);


⸻

Status Transition

CREATE TABLE status_transition (
  id UUID PRIMARY KEY,
  entity_id UUID,
  from_status TEXT,
  to_status TEXT,
  trigger TEXT,
  reason TEXT,
  timestamp TIMESTAMP,
  actor TEXT,
  correlation_id UUID
);


⸻

12. Observability Queries

Failed Jobs

SELECT *
FROM entity_status
WHERE status = 'FAILED';


⸻

Status History

SELECT *
FROM status_transition
WHERE entity_id = '123'
ORDER BY timestamp;


⸻

Debug Request

Search logs using:

trace_id = abc123


⸻

13. Event Sourcing (Optional Advanced Pattern)

Instead of storing status directly, state can be derived from events.

Example events:

JOB_CREATED
JOB_STARTED
JOB_FAILED
JOB_RETRIED
JOB_SUCCEEDED

Status can be reconstructed using:

status = reduce(events)

Benefits:
	•	perfect audit history
	•	replayable system state
	•	analytics friendly

Tradeoff:
	•	increased architectural complexity.

⸻

14. Recommended Tech Stack

Frontend
	•	React
	•	Next.js
	•	Tailwind
	•	Charting library (Recharts / Chart.js)

⸻

Backend
	•	Node.js / Python
	•	REST or GraphQL API

⸻

Data & Events
	•	PostgreSQL (status storage)
	•	Kafka / PubSub (event streaming)
	•	Data warehouse for analytics

⸻

Observability
	•	OpenTelemetry
	•	FluentBit / Logstash
	•	Elasticsearch
	•	Grafana

⸻

15. Best Practices

✔ Use structured JSON logs
✔ Include trace_id, entity_id, correlation_id
✔ Maintain immutable logs
✔ Use status enums
✔ Record all transitions
✔ Avoid large payloads in logs
✔ Version event schemas

⸻

16. Future Enhancements

Potential improvements:
	•	Real-time dashboard updates using WebSockets
	•	ML anomaly detection on failures
	•	Predictive scaling insights
	•	Automatic alerting system
	•	AI-powered incident summaries

⸻

END OF SPEC
