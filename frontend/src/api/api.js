const BASE_URL = "http://localhost:6969/api/v1";

const request = async (endpoint, options = {}) => {
  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  if (res.status === 401 && !endpoint.includes("/auth/")) {
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (refreshRes.ok) {
        const retryRes = await fetch(`${BASE_URL}${endpoint}`, config);
        const retryData = await retryRes.json();
        if (!retryRes.ok) throw { status: retryRes.status, ...retryData };
        return retryData;
      }
    } catch {
      // refresh failed
    }
  }

  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
};

export const api = {
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),

  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),

  logout: () =>
    request("/auth/logout", { method: "POST" }),

  getMe: () =>
    request("/me"),

  getFlights: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") query.append(k, v);
    });
    return request(`/flight?${query.toString()}`);
  },

  createFlight: (data) =>
    request("/flight", { method: "POST", body: data }),

  updateFlight: (id, data) =>
    request(`/flight/${id}`, { method: "PUT", body: data }),

  deleteFlight: (id) =>
    request(`/flight/${id}`, { method: "DELETE" }),
};
