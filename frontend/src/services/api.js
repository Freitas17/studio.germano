const API_URL = import.meta.env.VITE_API_URL || "";

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      (data && data.errors && data.errors.join(" ")) ||
      "Nao foi possivel conectar com o servidor.";
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  return data;
}

export const getServices = () => request("/api/services");

export const getConfig = () => request("/api/config");

export const createAppointment = (payload) =>
  request("/api/appointments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const getAvailability = (data, duracaoMin) =>
  request(
    `/api/availability?data=${encodeURIComponent(data)}&duracao_min=${encodeURIComponent(
      duracaoMin
    )}`
  );

export const imageUrl = (file) => `${API_URL}/static/images/${file}`;
