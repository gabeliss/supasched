# Post-MVP Polish Checklist

These are non-essential features and UX improvements that can be added after the MVP is fully functional. They do not require structural changes and can be layered in incrementally.

---

## 🗓️ Calendar & UI Enhancements

- [ ] Add **visual status badges** for appointments (`pending`, `confirmed`, `canceled`)
- [ ] Add **color key legend** for calendar block types (Availability, Time Off, Appointments)
- [ ] Add **hover tooltips** on calendar blocks (e.g., client name, time-off reason)

---

## 💬 User Feedback & Notifications

- [ ] Show **confirmation toasts** after availability/time-off/appointment actions
- [ ] Display **error message** if appointment submission fails (e.g., slot taken)
- [ ] Warn therapist if deleting availability with an overlapping/pending appointment

---

## 📩 Client Booking Form Improvements

- [ ] Add **email input validation** (required + valid format)
- [ ] Allow client to enter an **optional message** when booking
- [ ] Allow therapist to define a **minimum booking notice** (e.g., 12-24 hours in advance)

---

## 🧑‍⚕️ Therapist Controls

- [ ] Allow therapist to set **default session length** (e.g., 50 minutes)
- [ ] Allow setting of **buffer time** between sessions (e.g., 10 mins)
- [ ] Optional: Add basic **branding customization** (color, logo) for booking widget
