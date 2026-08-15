const API_URL = "http://localhost:3000";

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("accessToken");

    const headers = new Headers(options.headers ?? {});

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers
    });

    return response;
}