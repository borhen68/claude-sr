import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

// GET all collaborators
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const collaborators = await prisma.projectCollaborator.findMany({
      where: { projectId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        invitedAt: "desc",
      },
    });

    return NextResponse.json({ collaborators });
  } catch (error) {
    console.error("Collaborators fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collaborators" },
      { status: 500 }
    );
  }
}

// POST add collaborator
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Only owner can add collaborators
    if (project.userId !== user.id) {
      return NextResponse.json(
        { error: "Only the owner can add collaborators" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const validRoles = ["viewer", "editor", "admin"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Find user to invite
    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already collaborator
    const existing = await prisma.projectCollaborator.findUnique({
      where: {
        projectId_userId: {
          projectId: params.id,
          userId: invitedUser.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User is already a collaborator" },
        { status: 400 }
      );
    }

    const collaborator = await prisma.projectCollaborator.create({
      data: {
        projectId: params.id,
        userId: invitedUser.id,
        role: role || "viewer",
        acceptedAt: new Date(), // Auto-accept for now
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Collaborator added successfully",
        collaborator,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add collaborator error:", error);
    return NextResponse.json(
      { error: "Failed to add collaborator" },
      { status: 500 }
    );
  }
}

// PATCH update collaborator role
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Only owner can update roles
    if (project.userId !== user.id) {
      return NextResponse.json(
        { error: "Only the owner can update collaborator roles" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { collaboratorId, role } = body;

    const validRoles = ["viewer", "editor", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const collaborator = await prisma.projectCollaborator.update({
      where: { id: collaboratorId },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Collaborator role updated successfully",
      collaborator,
    });
  } catch (error) {
    console.error("Update collaborator error:", error);
    return NextResponse.json(
      { error: "Failed to update collaborator" },
      { status: 500 }
    );
  }
}

// DELETE remove collaborator
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const collaboratorId = searchParams.get("collaboratorId");

    if (!collaboratorId) {
      return NextResponse.json(
        { error: "Collaborator ID is required" },
        { status: 400 }
      );
    }

    const collaborator = await prisma.projectCollaborator.findUnique({
      where: { id: collaboratorId },
      include: {
        project: true,
      },
    });

    if (!collaborator) {
      return NextResponse.json(
        { error: "Collaborator not found" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Only owner can remove collaborators
    if (collaborator.project.userId !== user.id) {
      return NextResponse.json(
        { error: "Only the owner can remove collaborators" },
        { status: 403 }
      );
    }

    await prisma.projectCollaborator.delete({
      where: { id: collaboratorId },
    });

    return NextResponse.json({
      message: "Collaborator removed successfully",
    });
  } catch (error) {
    console.error("Remove collaborator error:", error);
    return NextResponse.json(
      { error: "Failed to remove collaborator" },
      { status: 500 }
    );
  }
}
