const BACKEND_URL = "http://localhost:5000"; // Update for production

export async function getMotivation(mood: string) {
  const res = await fetch(`${BACKEND_URL}/api/motivate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mood }),
  });
  return await res.json(); // { message: "..." }
}

export async function getStudyPlan(available_time: number, subjects: string[]) {
  const res = await fetch(`${BACKEND_URL}/api/study-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ available_time, subjects }),
  });
  return await res.json(); // { plan: [...] }
}
