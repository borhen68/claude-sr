/**
 * Security validation utilities
 */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    errors.push(`Password must not exceed ${PASSWORD_MAX_LENGTH} characters`);
  }

  // Optional: Add more password requirements
  // if (!/[A-Z]/.test(password)) {
  //   errors.push("Password must contain at least one uppercase letter");
  // }
  // if (!/[a-z]/.test(password)) {
  //   errors.push("Password must contain at least one lowercase letter");
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push("Password must contain at least one number");
  // }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}

export function sanitizeInput(input: string): string {
  // Remove potential XSS vectors
  return input
    .replace(/[<>]/g, "")
    .trim();
}

export function validateProjectTitle(title: string): {
  valid: boolean;
  error?: string;
} {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: "Title is required" };
  }

  if (title.length < 3) {
    return { valid: false, error: "Title must be at least 3 characters" };
  }

  if (title.length > 200) {
    return { valid: false, error: "Title must not exceed 200 characters" };
  }

  return { valid: true };
}

export function validateRole(role: string): boolean {
  const validRoles = ["viewer", "editor", "admin"];
  return validRoles.includes(role);
}

export function validateOrderStatus(status: string): boolean {
  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  return validStatuses.includes(status);
}

export function validateProjectStatus(status: string): boolean {
  const validStatuses = ["draft", "published", "archived"];
  return validStatuses.includes(status);
}
