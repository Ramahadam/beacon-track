# User Stories — IT Ticketing System

> **Purpose:** This document defines the personas, goals, and user stories for the ticketing system. It is the source of truth for UI/UX design and system design decisions. Each story follows the format: *As a [persona], I want [goal], so that [outcome].*

---

## Personas

### 1. End User (Standard)
An employee at the organisation who encounters IT problems or needs IT resources. Not technical. Uses the system only to raise and track their own tickets. Needs the simplest possible experience.

**Goals:** Submit tickets quickly, know what's happening with them, get resolved fast.
**Pain points:** Doesn't know what "type" of ticket to raise. Fills in the wrong form. Has no visibility after submitting.

---

### 2. IT Analyst (Staff)
An IT support engineer who handles incoming tickets day-to-day. Works through a queue, assigns tickets, updates statuses, adds notes, communicates with users.

**Goals:** See what needs attention, act on tickets efficiently, not lose context between sessions.
**Pain points:** Manually triaging ticket type and priority wastes time. No clear urgency signal. Difficult to spot frustrated users.

---

### 3. IT Admin (Staff)
An IT manager or team lead who oversees the whole operation. Manages user accounts, monitors team performance, tracks SLA compliance, handles change approvals.

**Goals:** Visibility over the full system. Manage access. Ensure SLAs are met. Approve risky changes.
**Pain points:** No single dashboard showing what's breaching SLA. Hard to audit who changed what. No role management UI beyond manual DB edits.

---

## Epic 1 — Authentication & Access

| # | Story | Acceptance Criteria |
|---|---|---|
| 1.1 | As an **end user**, I want to log in with my email and password so that I can access my tickets securely. | Login page accepts credentials, redirects to My Tickets on success, shows error on failure. |
| 1.2 | As an **analyst or admin**, I want to be redirected to the staff dashboard after login so that I land in the right workspace immediately. | Staff roles redirect to `/dashboard`, standard role redirects to `/my-tickets`. |
| 1.3 | As an **admin**, I want to create new user accounts with a specific role so that I control who has staff access. | `/users/new` form creates user with role selection; new user can log in immediately. |
| 1.4 | As an **admin**, I want to deactivate a user account without deleting it so that access is revoked but history is preserved. | Toggle `isActive` on user; deactivated user cannot log in; their past tickets remain visible. |
| 1.5 | As any **logged-in user**, I want to update my profile (name, mobile, avatar) so that my details stay current. | `/profile` page saves changes; avatar uploads to blob storage. |
| 1.6 | As any **logged-in user**, I want to switch between light, dark, and system theme so that the UI matches my preference. | Theme toggle persists to DB (`ThemePreference` field); applies on next load. |

---

## Epic 2 — Incident Management

| # | Story | Acceptance Criteria |
|---|---|---|
| 2.1 | As an **end user**, I want to report an incident by describing what broke so that IT can investigate and fix it. | Form accepts summary, description, priority, impact; creates an Incident record with status `loged`. |
| 2.2 | As an **end user**, I want to use AI to classify my description before submitting so that I don't have to guess the ticket type or priority. | Modal analyzes description, returns type + priority + reason; pre-fills the form on continue. |
| 2.3 | As an **end user**, I want to see all my open and closed incidents in one place so that I know their current status. | My Tickets page shows incidents tab with status badges, sortable, paginated. |
| 2.4 | As an **analyst**, I want to see all open incidents in a list with priority and deadline visible so that I can triage quickly. | `/incidents` list shows priority badge, SLA deadline, owner; sortable and filterable by status. |
| 2.5 | As an **analyst**, I want to assign an incident to myself or a colleague so that ownership is clear. | Assign-to dropdown on incident detail; updates `owner` field; visible in the list. |
| 2.6 | As an **analyst**, I want to update the status of an incident (progress → fulfilled) so that the user knows it's resolved. | Status dropdown on detail page; each change is recorded with a timestamp. |
| 2.7 | As an **analyst**, I want to add internal notes to an incident so that context is shared with my team without emailing. | Notes section on detail page; notes stored as JSON with author + timestamp. |
| 2.8 | As an **analyst**, I want to attach a file to an incident (screenshot, log) so that evidence is captured. | File upload on create and detail pages; stored in Vercel Blob; linked to ticket. |
| 2.9 | As an **admin**, I want to delete an incident so that test or duplicate entries can be cleaned up. | Delete button on detail page (admin only); redirects to list after deletion. |

---

## Epic 3 — Service Request Management

| # | Story | Acceptance Criteria |
|---|---|---|
| 3.1 | As an **end user**, I want to request a new IT resource (software, hardware, access) so that I can get what I need without raising an incident. | Service Request form with summary, description, priority, optional impact. |
| 3.2 | As an **end user**, I want to track the status of my service requests so that I know if they've been fulfilled. | My Tickets → Requests tab shows status and priority for each request. |
| 3.3 | As an **analyst**, I want to see all open service requests with their priority so that I can work through them in order. | `/requests` list with filters, sort, pagination. |
| 3.4 | As an **analyst**, I want to assign and update service requests the same way I do incidents so that the workflow is consistent. | Same assign/status/notes/file pattern as incidents. |

---

## Epic 4 — Change Request Management

| # | Story | Acceptance Criteria |
|---|---|---|
| 4.1 | As an **analyst**, I want to raise a change request for infrastructure modifications so that changes are tracked and approved before implementation. | Change Request form with summary, description, category (software/hardware/network/etc.), classification, rollback plan. |
| 4.2 | As an **end user**, I want to raise a change request for something I need changed so that it goes through the proper approval process. | Same form available under My Tickets → Change Requests. |
| 4.3 | As an **admin**, I want to approve or reject a change request so that risky changes don't happen without oversight. | Status can be moved to `approved` or `cancelled` by admin; status history visible. |
| 4.4 | As an **analyst**, I want to mark a change request as implemented so that the record is closed accurately. | Status moves to `implemented`; visible in the change list. |
| 4.5 | As an **analyst**, I want to see the rollback plan on a change request so that I know how to revert if something goes wrong. | Rollback plan field displayed prominently on the detail page. |

---

## Epic 5 — Staff Dashboard & Analytics

| # | Story | Acceptance Criteria |
|---|---|---|
| 5.1 | As an **analyst or admin**, I want to see a summary of open incidents, requests, and changes at a glance so that I understand the current workload. | Dashboard stat cards: open incidents, open requests, open changes, active users. |
| 5.2 | As an **analyst**, I want to see open incidents broken down by priority so that I know where the most critical work is. | Horizontal bar chart on dashboard showing count per priority level. |
| 5.3 | As an **analyst**, I want to see the most recent open incidents on the dashboard so that I can jump into them directly. | Recent incidents table with ID, summary, priority, created date; links to detail. |
| 5.4 | As an **admin**, I want to see SLA compliance metrics so that I can identify if response times are being met. | *Planned* — SLA countdown on ticket list; dashboard shows % tickets within SLA. |
| 5.5 | As an **admin**, I want to export ticket data to Excel so that I can share reports outside the system. | Export button on list pages; downloads `.xlsx` with all visible columns. |

---

## Epic 6 — AI Features

| # | Story | Acceptance Criteria |
|---|---|---|
| 6.1 | As an **end user**, I want AI to classify my description into the right ticket type and priority so that I don't need to know ITSM terminology. | Modal returns type, priority, reason in under 5 seconds; pre-fills the correct form. |
| 6.2 | As an **end user**, I want the AI feature to work even if the API is unavailable so that I'm never blocked from submitting a ticket. | Local fallback classifier runs when API fails; shows "Demo mode" badge; feature always functional. |
| 6.3 | As an **analyst**, I want to see a sentiment badge on tickets so that I can prioritise frustrated users. | *Planned* — badge (frustrated / neutral / calm) shown on ticket list and detail page. |
| 6.4 | As an **analyst**, I want AI to suggest a reply based on similar past tickets so that I can respond faster and more consistently. | *Planned* — "Suggest Reply" button on ticket detail; drafts a response using RAG over closed tickets. |

---

## Epic 7 — Notifications & Real-time

| # | Story | Acceptance Criteria |
|---|---|---|
| 7.1 | As an **end user**, I want to receive a notification when my ticket status changes so that I don't have to keep refreshing. | *Planned* — in-app toast or badge updates in real time when ticket is updated. |
| 7.2 | As an **analyst**, I want to see a live count of unassigned tickets so that I know when new work arrives without refreshing. | *Planned* — nav badge or dashboard counter updates live via WebSocket/SSE. |
| 7.3 | As an **analyst**, I want to be alerted when a ticket is approaching its SLA deadline so that I can act before a breach. | *Planned* — alert appears on the ticket list and dashboard when deadline < 1 hour away. |

---

## Epic 8 — Audit & Compliance

| # | Story | Acceptance Criteria |
|---|---|---|
| 8.1 | As an **admin**, I want every status change on a ticket to be logged with who did it and when so that I can audit the history. | *Planned* — `AuditLog` table records actor, action, old value, new value, timestamp for every ticket mutation. |
| 8.2 | As an **admin**, I want to see the full audit trail on a ticket detail page so that I can reconstruct exactly what happened. | *Planned* — Timeline component on detail page showing all events in order. |

---

## Page Inventory

This lists every page in the current system and its primary purpose. Use this as the basis for UI/UX design work.

| Path | Role | Purpose |
|---|---|---|
| `/login` | Public | Email + password login |
| `/dashboard` | Staff | Overview: stats, priority chart, recent incidents |
| `/incidents` | Staff | List all incidents with filter/sort/pagination |
| `/incidents/[id]` | Staff | Incident detail: status, notes, assignment, file |
| `/incidents/new` | Staff | Create new incident (with AI pre-fill support) |
| `/requests` | Staff | List all service requests |
| `/requests/[id]` | Staff | Service request detail |
| `/requests/new` | Staff | Create new service request (with AI pre-fill) |
| `/change` | Staff | List all change requests |
| `/change/[id]` | Staff | Change request detail |
| `/change/new` | Staff | Create new change request (with AI pre-fill) |
| `/users` | Admin | List all users |
| `/users/[id]` | Admin | Edit user: role, active status, details |
| `/users/new` | Admin | Create new user account |
| `/my-tickets` | Standard | Tabbed view of own incidents, requests, changes |
| `/my-tickets/incidents/[id]` | Standard | Own incident detail (read + notes) |
| `/my-tickets/incidents/new` | Standard | Create incident (with AI pre-fill) |
| `/my-tickets/requests/[id]` | Standard | Own request detail |
| `/my-tickets/requests/new` | Standard | Create request (with AI pre-fill) |
| `/my-tickets/change/[id]` | Standard | Own change request detail |
| `/my-tickets/change/new` | Standard | Create change request (with AI pre-fill) |
| `/profile` | All | Edit personal details, avatar, theme |

---

## Pages Needed (Not Yet Built)

| Path | Role | Purpose |
|---|---|---|
| `/dashboard/sla` | Admin | SLA compliance overview: % within SLA, breaches by type |
| `/dashboard/analytics` | Admin | Ticket trends, agent performance, resolution time charts |
| `/notifications` | All | Notification centre: unread alerts, status changes |
| `/audit` | Admin | Full audit log with filters by user, ticket, action |

---

## Data Model Summary (for system design reference)

```
User          id, email, passwordHash, firstname, lastname, mobile, userrole, isActive, file, theme
Incident      id, requester, summary, description, priority(1-4), impact, status, owner, notes(JSON), file, deadline
ServiceRequest id, requester, summary, description, priority(1-4), impact, status, owner, notes(JSON), file, deadline
ChangeRequest  id, requester, category, summary, description, classification(1-4), status, owner, rollback_plan, notes(JSON), file
```

**Status flows:**
- Incident / ServiceRequest: `loged → progress → hold → fulfilled | canceled`
- ChangeRequest: `requested → pending_approval → approved → implemented | cancelled`

**Roles:** `standard` (end user) | `analyst` (staff) | `admin` (staff + user management + change approval)
