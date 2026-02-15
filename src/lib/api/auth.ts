export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Registration failed");
  }

  return response.json();
}

export async function updateProfile(data: {
  name?: string;
  image?: string;
  currentPassword?: string;
  newPassword?: string;
}) {
  const response = await fetch("/api/user/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Profile update failed");
  }

  return response.json();
}

export async function getProfile() {
  const response = await fetch("/api/user/profile");

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch profile");
  }

  return response.json();
}
