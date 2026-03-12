import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();
const BASE_URL = configuredBaseUrl || "";

const api = axios.create({ baseURL: BASE_URL, timeout: 30000 });

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "Request failed";
    return Promise.reject(new Error(message));
  },
);

export async function login(email, password) {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
}

export async function signup(email, password) {
  const res = await api.post("/api/auth/signup", { email, password });
  return res.data;
}

export async function logout() {
  const res = await api.post("/api/auth/logout");
  return res.data;
}

export async function createJob(companyName, userEmail) {
  const res = await api.post("/api/jobs", {
    company_name: companyName,
    user_email: userEmail,
  });
  return res.data;
}

export async function uploadFiles(jobId, formData) {
  const res = await api.post("/api/upload/" + jobId, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
  });
  return res.data;
}

export async function getJobResult(jobId) {
  const res = await api.get("/api/analysis/" + jobId + "/result");
  return res.data;
}

export async function getJobStatus(jobId) {
  const res = await api.get("/api/jobs/" + jobId + "/status");
  return res.data;
}

export async function submitOfficerNotes(jobId, notes, officerId) {
  const res = await api.post("/api/officer/" + jobId + "/notes", {
    notes,
    officer_id: officerId || "anonymous",
  });
  return res.data;
}

export async function getCAM(jobId) {
  const res = await api.get("/api/cam/" + jobId);
  return res.data;
}

export async function regenerateCAM(jobId) {
  const res = await api.post("/api/cam/" + jobId + "/regenerate");
  return res.data;
}

export async function downloadCAM(jobId, format) {
  const res = await api.get(`/api/cam/${jobId}/download/${format}`, {
    responseType: "blob",
    timeout: 60000,
  });
  const mime =
    format === "pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const blob = new Blob([res.data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${jobId}_Credit_Memo.${format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function getCAMPdfBlobUrl(jobId) {
  const res = await api.get(`/api/cam/${jobId}/download/pdf?preview=true`, {
    responseType: "blob",
    timeout: 60000,
  });
  const blob = new Blob([res.data], { type: "application/pdf" });
  return URL.createObjectURL(blob);
}

export async function listJobs() {
  const res = await api.get("/api/jobs");
  return res.data;
}

export function createSSEConnection(jobId, onEvent) {
  const url = BASE_URL
    ? BASE_URL + "/api/analysis/" + jobId + "/stream"
    : "/api/analysis/" + jobId + "/stream";
  const source = new EventSource(url);
  let connected = false;
  let done = false;

  source.onopen = () => {
    connected = true;
  };

  source.onmessage = (e) => {
    try {
      const parsed = JSON.parse(e.data);
      onEvent(parsed);

      // If server sent complete or error, we're done — close cleanly
      if (parsed.type === "complete" || parsed.type === "error") {
        done = true;
        source.close();
      }
    } catch (err) {
      console.error("SSE parse error", err);
    }
  };

  source.onerror = () => {
    source.close();
    // Don't fire error if we already received a terminal event
    if (done) return;

    onEvent({
      type: "error",
      stage: "SSE",
      message: connected
        ? "Connection to pipeline lost. Please try again."
        : "Unable to connect to analysis pipeline. Check that the backend is running.",
      percent: 0,
    });
  };

  return source;
}
