const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5108/api";

export async function fetchTests(category, search) {
  const params = new URLSearchParams();
  if (category && category !== "All") params.append("category", category);
  if (search) params.append("search", search);

  const res = await fetch(`${API_BASE}/tests?${params}`);
  if (!res.ok) throw new Error("Failed to fetch tests");
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/tests/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function fetchHealthConditions() {
  const res = await fetch(`${API_BASE}/health-conditions`);
  if (!res.ok) throw new Error("Failed to fetch health conditions");
  return res.json();
}

export async function fetchHealthConditionBySlug(slug) {
  const res = await fetch(`${API_BASE}/health-conditions/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch health condition");
  return res.json();
}

export async function fetchSampleReports() {
  const res = await fetch(`${API_BASE}/sample-reports`);
  if (!res.ok) throw new Error("Failed to fetch sample reports");
  return res.json();
}

export async function fetchHealthPackages() {
  const res = await fetch(`${API_BASE}/health-packages`);
  if (!res.ok) throw new Error("Failed to fetch health packages");
  return res.json();
}

export async function fetchSampleReportByTestId(testId) {
  const res = await fetch(`${API_BASE}/sample-reports/by-test/${testId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createBooking(data) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json();
}
