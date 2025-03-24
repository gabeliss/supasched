# MVP Architecture & Setup

This document outlines the recommended architecture, tooling, and technical constraints for building the MVP of the Supasched platform. It ensures that frontend, backend, and auth layers are aligned and built for clarity and extensibility.

---

## 1. Authentication & Authorization

### 🔐 Supabase Auth

- Use Supabase’s built-in email/password or magic link authentication.
- Store therapist ID as the Supabase `user.id`.

### 🔒 Securing API Endpoints

- All therapist-facing API endpoints require a valid access token.
- The backend should validate sessions with Supabase and match therapist ID.

---

## 2. Database & Migrations

### 📦 Tables Required

- `availability`
- `time_off`
- `appointments`

### 📈 Indexes

For performance on large datasets:

- `appointments(therapist_id, start_time)`
- `time_off(therapist_id, start_time)`
- `availability(therapist_id, start_time)`

### ⚙️ Migration Strategy

- Define schemas using Supabase SQL editor or migration scripts.
- Reuse enums (e.g., appointment `status`) where possible for consistency.

---

## 3. Frontend Structure

### 🧭 Routes

- `/dashboard`
  - Calendar view
  - Tabs for: Availability, Time Off, Appointments, Widget Embed
- `/book/[therapist_username]`
  - Public, client-facing booking widget

### 🌐 State Management

- Use **React Query** or **SWR** for server-side state (availability, appointments, etc.)
- Optionally use React Context for therapist metadata (name, timezone, etc.)

---

## 4. Error Handling & Edge Cases

### ⚠️ Conflict Rules

- **Blocked**:

  - Double bookings
  - Time-off conflicts (unless overridden)
  - Appointments outside availability

- **Overridable (with confirmation):**
  - Appointments during time-off
  - Overlapping availability entries (if UI permits)

### 💡 Fallback States

- No availability yet → show CTA to add availability
- No appointments → friendly message

### 🕓 Timezones

- For MVP: assume client and therapist share the same timezone
- All times are displayed in **therapist’s local timezone**
