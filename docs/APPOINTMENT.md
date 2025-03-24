# Appointment Management

## Overview

The Appointment Management feature allows therapists to manually create, edit, or delete client appointments. Appointments are time-bound and tied to a specific therapist and client. They are validated against therapist availability, time-off, and existing appointments. This feature also enables clients to view their upcoming appointments and request changes (covered in a separate client-facing spec).

## Database Schema

### **appointments**

| Column         | Type      | Description                                                |
| -------------- | --------- | ---------------------------------------------------------- |
| `id`           | UUID (PK) | Unique identifier                                          |
| `therapist_id` | UUID (FK) | Linked therapist                                           |
| `client_id`    | UUID (FK) | Linked client (optional for MVP if added manually)         |
| `start_time`   | TIMESTAMP | Start time of the appointment                              |
| `end_time`     | TIMESTAMP | End time of the appointment                                |
| `status`       | STRING    | Status: `confirmed`, `pending`, `cancelled`, `rescheduled` |
| `notes`        | TEXT      | Optional session or internal notes                         |
| `created_at`   | TIMESTAMP | Auto-generated creation timestamp                          |
| `updated_at`   | TIMESTAMP | Auto-generated update timestamp                            |

## API Endpoints

### **Create Appointment**

**`POST /api/appointments`**

- Request: `{ therapist_id, start_time, end_time, client_id (optional), notes (optional) }`
- Validates:
  - Time is within availability
  - Time does not overlap with time-off or existing appointments
- Response: `{ success: true, appointment_id }`

### **Update Appointment**

**`PUT /api/appointments/:id`**

- Request: `{ start_time, end_time, status, notes }`
- Same validations as creation
- Response: `{ success: true }`

### **Delete Appointment**

**`DELETE /api/appointments/:id`**

- Soft-deletes or removes the appointment
- Response: `{ success: true }`

### **Get Appointments for Therapist**

**`GET /api/appointments?therapist_id={id}`**

- Response: `{ appointments: [...] }`

## UI/UX Breakdown

### **Therapist Dashboard - Appointment Management**

- Appointments appear as blocks in both Weekly and Monthly Calendar views.
- Therapists can:

  - Click `+ Add Appointment` button to open the **Appointment Modal**
  - Click any time slot directly in calendar to prefill time in the modal
  - Click existing appointment to open **Edit/Delete modal**

- **Conflict Handling:**

  - UI checks availability and time-off before submitting.
  - Backend performs final validation.
  - If conflict: Modal shows warning and disables submission.
  - Therapists may override for edge cases by checking a confirmation box (e.g., emergency session).

- **Recurring Appointment Support**: Not in MVP. All appointments are one-time.

- **Visual Priority:**
  - Appointments are rendered above availability and time-off blocks.
  - Show status (e.g., pending = dotted border, cancelled = strikethrough, confirmed = solid).

## Reusable Components & Logic

- **Appointment Modal**: Shared form for creating/editing. Reuses time & date pickers.
- **Conflict Checker**: Ensures time doesn’t overlap with other blocks.
- **Appointment Renderer**: Draws appointment blocks in calendar.
- **Status Badge**: Displays appointment status visually.
- **Validation Schema**: Shared form validation rules.
