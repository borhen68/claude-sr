export async function getProjects(includeShared = false) {
  const response = await fetch(
    `/api/projects?includeShared=${includeShared}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function getProject(id: string) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
}

export async function createProject(data: {
  title: string;
  description?: string;
  theme?: string;
  coverImage?: string;
}) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create project");
  }

  return response.json();
}

export async function updateProject(id: string, data: any) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update project");
  }

  return response.json();
}

export async function deleteProject(id: string) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete project");
  }

  return response.json();
}

export async function createVersion(
  projectId: string,
  data: { title?: string; description?: string }
) {
  const response = await fetch(`/api/projects/${projectId}/versions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create version");
  }

  return response.json();
}

export async function getVersions(projectId: string) {
  const response = await fetch(`/api/projects/${projectId}/versions`);

  if (!response.ok) {
    throw new Error("Failed to fetch versions");
  }

  return response.json();
}

export async function addCollaborator(
  projectId: string,
  email: string,
  role: string = "viewer"
) {
  const response = await fetch(`/api/projects/${projectId}/collaborators`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to add collaborator");
  }

  return response.json();
}
