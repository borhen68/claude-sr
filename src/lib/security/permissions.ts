/**
 * Permission checking utilities
 */

import { prisma } from "@/lib/prisma";

export async function canAccessProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: {
        where: {
          userId,
          acceptedAt: { not: null },
        },
      },
    },
  });

  if (!project) return false;

  // Owner has access
  if (project.userId === userId) return true;

  // Collaborator has access
  if (project.collaborators.length > 0) return true;

  // Public projects are accessible to all
  if (project.isPublic) return true;

  return false;
}

export async function canEditProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: {
        where: {
          userId,
          acceptedAt: { not: null },
        },
      },
    },
  });

  if (!project) return false;

  // Owner can edit
  if (project.userId === userId) return true;

  // Editor or admin collaborator can edit
  const collaborator = project.collaborators[0];
  if (collaborator && (collaborator.role === "editor" || collaborator.role === "admin")) {
    return true;
  }

  return false;
}

export async function canDeleteProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) return false;

  // Only owner can delete
  return project.userId === userId;
}

export async function canManageCollaborators(
  userId: string,
  projectId: string
): Promise<boolean> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: {
        where: {
          userId,
          acceptedAt: { not: null },
        },
      },
    },
  });

  if (!project) return false;

  // Owner can manage
  if (project.userId === userId) return true;

  // Admin collaborator can manage
  const collaborator = project.collaborators[0];
  if (collaborator && collaborator.role === "admin") {
    return true;
  }

  return false;
}

export async function getProjectRole(
  userId: string,
  projectId: string
): Promise<"owner" | "admin" | "editor" | "viewer" | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: {
        where: {
          userId,
          acceptedAt: { not: null },
        },
      },
    },
  });

  if (!project) return null;

  if (project.userId === userId) return "owner";

  const collaborator = project.collaborators[0];
  if (collaborator) {
    return collaborator.role as "admin" | "editor" | "viewer";
  }

  return project.isPublic ? "viewer" : null;
}
