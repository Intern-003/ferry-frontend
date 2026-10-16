// src/api/public.api.js
import api from "./axios";

export const publicApi = {
  /* Public */
  health:      () => api.get("/health"),
  locations:   () => api.get("/locations"),
  boats:       (params) => api.get("/boats", { params }),
  charters:      (params) => api.get("/charters", { params }),
  upcomingTrips: (params) => api.get("/trips/upcoming", { params }),
  search:      (params) => api.get("/search", { params }),
  tripSeats:   (tripId) => api.get(`/trips/${tripId}/seats`),
  faqs:        () => api.get("/faqs"),
  reviews:     () => api.get("/reviews"),
  contact:     (payload) => api.post("/contact", payload),

  /* Booking Holds */
  createHold:  (payload) => api.post("/booking-holds", payload),
  getHold:     (ref) => api.get(`/booking-holds/${ref}`),
  releaseHold: (ref) => api.delete(`/booking-holds/${ref}`),

  /* Booking */
  createBooking: (payload, key) =>
    api.post("/bookings", payload, {
      headers: { "Idempotency-Key": key || crypto.randomUUID() },
    }),
  getBooking: (ref) => api.get(`/bookings/${ref}`),
  createCharter: (payload, key) =>
    api.post("/bookings/charter", payload, {
      headers: { "Idempotency-Key": key || crypto.randomUUID() },
    }),

  /* Auth */
  login:    (payload) => api.post("/auth/login", payload),
  register: (payload) => api.post("/auth/register", payload),
  me:       () => api.get("/auth/me"),
  logout:   () => api.post("/auth/logout"),
  myBookings: () => api.get("/me/bookings"),
  cancelMyBooking: (ref) => api.post(`/me/bookings/${ref}/cancel`),
};

export const adminApi = {
  dashboard: () => api.get("/admin/dashboard"),

  /* Users */
  users:       (params) => api.get("/admin/users", { params }),
  approveUser: (id) => api.post(`/admin/users/${id}/approve`),
  rejectUser:  (id) => api.post(`/admin/users/${id}/reject`),

  /* Boats */
  boats:       () => api.get("/admin/boats"),
  createBoat:  (formData) => api.post("/admin/boats", formData),
  updateBoat:  (id, formData) => api.post(`/admin/boats/${id}`, formData),
  deleteBoat:  (id) => api.delete(`/admin/boats/${id}`),
  boatImages:  (id, formData) => api.post(`/admin/boats/${id}/images`, formData),
  deleteBoatImage: (boatId, imgId) =>
    api.delete(`/admin/boats/${boatId}/images/${imgId}`),

  /* Trips */
  trips:       () => api.get("/admin/trips"),
  createTrip:  (payload) => api.post("/admin/trips", payload),
  bulkTrips:   (payload) => api.post("/admin/trips/bulk", payload),
  updateTrip:  (id, payload) => api.patch(`/admin/trips/${id}`, payload),
  deleteTrip:  (id) => api.delete(`/admin/trips/${id}`),
  tripSeats:   (id) => api.get(`/admin/trips/${id}/seats`),

  /* Bookings */
  bookings:       (params) => api.get("/admin/bookings", { params }),
  booking:        (ref) => api.get(`/admin/bookings/${ref}`),
  approveBooking: (ref, notes) => api.post(`/admin/bookings/${ref}/approve`, { notes }),
  rejectBooking:  (ref, notes) => api.post(`/admin/bookings/${ref}/reject`, { notes }),
  markPaid:       (ref) => api.post(`/admin/bookings/${ref}/mark-paid`),
  cancelBooking:  (ref) => api.post(`/admin/bookings/${ref}/cancel`),

  /* Locations */
  locations:      () => api.get("/admin/locations"),
  createLocation: (payload) => api.post("/admin/locations", payload),
  updateLocation: (id, payload) => api.patch(`/admin/locations/${id}`, payload),
  deleteLocation: (id) => api.delete(`/admin/locations/${id}`),

  /* Content */
  faqs:    () => api.get("/admin/faqs"),
  reviews: () => api.get("/admin/reviews"),

  contactMessages: (params) => api.get("/admin/contact-messages", { params }),
  auditLogs:       (params) => api.get("/admin/audit-logs", { params }),
};