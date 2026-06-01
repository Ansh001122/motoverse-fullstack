import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export const api = axios.create({ baseURL: `${API_BASE_URL}/api` });
export async function getVehicles(){const r=await api.get("/vehicles");return r.data;}
export async function searchVehicles(keyword){if(!keyword.trim()) return getVehicles(); const r=await api.get(`/vehicles/search?keyword=${encodeURIComponent(keyword)}`); return r.data;}
export async function createBooking(payload){const r=await api.post("/bookings",payload); return r.data;}
export async function getBookings(){const r=await api.get("/bookings"); return r.data;}
export async function getDashboardSummary(){const r=await api.get("/dashboard/summary"); return r.data;}
