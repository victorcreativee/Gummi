import { getAuthToken } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

function getAuthenticatedJsonHeaders(): Record<string, string> {
  const token = getAuthToken();

  if (!token) {
    throw new Error("You must be logged in to do that");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
export type GummiProject = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  neededRoles: string;
  status: string;
  createdAt: string;
};

export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  joinedAt: string;
};
export type ProjectMilestone = {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
};
export type ProofSubmission = {
  id: string;
  userId: string;
  projectId?: string;
  title: string;
  careerCategory: string;
  proofType: string;
  description: string;
  challenge?: string;
  process?: string;
  outcome?: string;
  proofLink?: string;
  mediaUrl?: string;
  toolsUsed?: string;
  status?: string;
  reviewStatus?: string;
  createdAt?: string;
};
export async function createProject(projectData: {
  ownerId: string;
  title: string;
  description: string;
  category: string;
  neededRoles: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    throw new Error("Could not create project");
  }

  return response.json();
}

export async function getProjects(): Promise<GummiProject[]> {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load projects");
  }

  return response.json();
}

export async function getProjectById(projectId: string): Promise<GummiProject> {
  const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load project");
  }

  return response.json();
}

export async function joinProject(data: {
  projectId: string;
  userId: string;
  role: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/projects/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Could not join project");
  }

  return response.json();
}

export async function getProjectMembers(
  projectId: string
): Promise<ProjectMember[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}/members`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Could not load project members");
  }

  return response.json();
}

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
export async function addBuilderSkill(data: { skillName: string }) {
  const response = await fetch(`${API_BASE_URL}/api/talent/skills`, {
    method: "POST",
    headers: getAuthenticatedJsonHeaders(),
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
export type MemberInterest = {
  id: string;
  userId: string;
  interestName: string;
  createdAt?: string;
};
export type OnboardingGoal = "LEARN" | "PROVE" | "COLLABORATE" | "OPPORTUNITY";

export type MemberOnboardingState = {
  id: string;
  userId: string;
  primaryGoal: OnboardingGoal;
  onboardingCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function addMemberInterest(data: {
  interestName: string;
}): Promise<MemberInterest> {
  const response = await fetch(`${API_BASE_URL}/api/talent/interests`, {
    method: "POST",
    headers: getAuthenticatedJsonHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to add interest");
  }

  return result as MemberInterest;
}

export async function getMemberInterests(
  userId: string
): Promise<MemberInterest[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/talent/interests/${userId}`,
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load interests");
  }

  return Array.isArray(result) ? result : [];
}

export async function saveUserProfile(data: {
  headline: string;
  location: string;
  availability: string;
  buildingNow: string;
  story: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/users/profiles`, {
    method: "POST",
    headers: getAuthenticatedJsonHeaders(),
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

export async function createProof(data: {
  userId: string;
  projectId?: string;
  title: string;
  careerCategory: string;
  proofType: string;
  description: string;
  challenge?: string;
  process?: string;
  outcome?: string;
  proofLink?: string;
  mediaUrl?: string;
  toolsUsed?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/proofs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit proof");
  }

  return result;
}

export async function getUserProofs(userId: string) {
  const response = await fetch(`${API_BASE_URL}/api/proofs/user/${userId}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load proofs");
  }

  return result;
}

export async function getProofById(proofId: string) {
  const response = await fetch(`${API_BASE_URL}/api/proofs/${proofId}`, {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load proof");
  }

  return result;
}
export async function getProjectProofs(
  projectId: string
): Promise<ProofSubmission[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/proofs/project/${projectId}`,
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load project contributions");
  }

  return result;
}
export async function createProjectMilestone(data: {
  projectId: string;
  title: string;
  description: string;
}) {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${data.projectId}/milestones`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create milestone");
  }

  return result;
}

export async function getProjectMilestones(
  projectId: string
): Promise<ProjectMilestone[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}/milestones`,
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load milestones");
  }

  return result;
}

export async function saveOnboardingGoal(
  primaryGoal: OnboardingGoal
): Promise<MemberOnboardingState> {
  const response = await fetch(`${API_BASE_URL}/api/users/onboarding/goal`, {
    method: "POST",
    headers: getAuthenticatedJsonHeaders(),
    body: JSON.stringify({
      primaryGoal,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to save your onboarding goal");
  }

  return result as MemberOnboardingState;
}

export async function completeOnboarding(): Promise<MemberOnboardingState> {
  const response = await fetch(
    `${API_BASE_URL}/api/users/onboarding/complete`,
    {
      method: "POST",
      headers: getAuthenticatedJsonHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to complete onboarding");
  }

  return result as MemberOnboardingState;
}

export async function getMyOnboardingState(): Promise<MemberOnboardingState | null> {
  const response = await fetch(`${API_BASE_URL}/api/users/onboarding/me`, {
    headers: getAuthenticatedJsonHeaders(),
    cache: "no-store",
  });

  if (response.status === 204) {
    return null;
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load onboarding state");
  }

  return result as MemberOnboardingState;
}
