import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

// GET single project
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
      include: {
        pages: {
          orderBy: { order: "asc" },
        },
        photos: {
          orderBy: { createdAt: "desc" },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            versions: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check access rights
    const isOwner = project.userId === user.id;
    const isCollaborator = project.collaborators.some(
      (c) => c.userId === user.id && c.acceptedAt
    );

    if (!isOwner && !isCollaborator && !project.isPublic) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Project fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PATCH update project
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
      include: {
        collaborators: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const isOwner = project.userId === user.id;
    const canEdit = project.collaborators.some(
      (c) => c.userId === user.id && 
      (c.role === "editor" || c.role === "admin") &&
      c.acceptedAt
    );

    if (!isOwner && !canEdit) {
      return NextResponse.json(
        { error: "Permission denied" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      theme,
      colorPalette,
      status,
      coverImage,
      isPublic,
    } = body;

    const updateData: any = {
      lastSavedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (theme !== undefined) updateData.theme = theme;
    if (colorPalette !== undefined) updateData.colorPalette = colorPalette;
    if (status !== undefined) updateData.status = status;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (isPublic !== undefined && isOwner) updateData.isPublic = isPublic;

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: {
            pages: true,
            photos: true,
            versions: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Project update error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE project
export async function DELETE(
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

    // Only owner can delete
    if (project.userId !== user.id) {
      return NextResponse.json(
        { error: "Only the owner can delete this project" },
        { status: 403 }
      );
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Project deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
