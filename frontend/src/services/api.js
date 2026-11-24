export const API_URL =
    process.env.NODE_ENV === "production"
        ? "https://learning-management-system-s2mc.onrender.com"
        : "http://127.0.0.1:8000";

export default API_URL;