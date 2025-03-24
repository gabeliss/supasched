# Client Booking Flow

## Overview

The client booking flow allows prospective clients to schedule sessions directly through an embeddable widget placed on a therapist's website. The widget pulls real-time availability and submits appointment requests to the therapist for approval.

This document also includes how therapists access and preview their widget for setup.

---

## Client Booking Experience

- **Widget Embed:** Clients interact with a branded booking widget embedded via `<iframe>` on a therapist’s site.
- **Date Selection:**
  - Clients select a date from a calendar view.
  - Only dates with available time slots are clickable.
- **Time Selection:**
  - Once a date is chosen, available time slots are shown.
  - Time-off and booked appointments are excluded.
- **Booking Form:**
  - Client enters:
    - Full name
    - Email address
    - Optional message
  - Submits request
- **Confirmation:**
  - Appointment is created in `pending` state.
  - Client sees a confirmation message.

---

## API Endpoints (Client-Side)

### **Get Available Time Slots**

**`GET /api/availability/open?therapist_id={id}&date=YYYY-MM-DD`**

- Returns merged, conflict-free list of available time ranges.
- Takes into account:
  - Availability
  - Time-off
  - Existing appointments

### **Submit Appointment Request**

**`POST /api/appointments`**

- Request: `{ therapist_id, client_name, client_email, start_time, end_time, status: "pending" }`
- Response: `{ success: true, appointment_id }`

---

## Schema Notes

- Reuses `appointments` table.
- New appointment requests are inserted with:
  - `status: "pending"`
  - `client_name`, `client_email`, `start_time`, `end_time`

Therapists must manually review and approve these requests.

---

## Therapist Widget Access

### **Embed Code Page**

- Each therapist has a unique URL:
  ```html
  <iframe
  	src="https://supasched.com/book/{therapist_username}"
  	width="100%"
  	height="650px"
  />
  ```
- Embed code is copyable with a single click.

### **Preview Widget Button**

- Opens new tab to preview their own widget
  - Example: `https://supasched.com/book/{therapist_username}`
  - Loads real-time availability as a client would see it

### **Optional Settings (Future)**

- Booking rules:
  - Minimum notice time (e.g. 12 or 24 hours)
  - Buffer between sessions
- Branding settings:
  - Color scheme
  - Clinic logo
