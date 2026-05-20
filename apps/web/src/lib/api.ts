const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result;
}
export async function loginUser(data: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  return result;
}
export async function addBuilderSkill(data: {
  userId: string;
  skillName: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/talent/skills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add skill");
  }

  return result;
}

export async function getBuilderSkills(userId: string) {
  const response = await fetch(`${API_BASE_URL}/api/talent/skills/${userId}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load skills");
  }

  return result;
}
export async function saveUserProfile(data: {
  userId: string;
  headline: string;
  location: string;
  availability: string;
  buildingNow: string;
  story: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/users/profiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to save profile");
  }

  return result;
}

export async function getUserProfile(userId: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/profiles/${userId}`, {
    cache: "no-store",
  });

  if (response.status === 204) return null;

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load profile");
  }

  return result;
}
