import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

// GET all versions for a project
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
        collaborators: true,
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

    const versions = await prisma.projectVersion.findMany({
      where: { projectId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        versionNum: "desc",
      },
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("Versions fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch versions" },
      { status: 500 }
    );
  }
}

// POST create new version
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
      include: {
        pages: true,
        photos: true,
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
    const { title, description } = body;

    // Get latest version number
    const latestVersion = await prisma.projectVersion.findFirst({
      where: { projectId: params.id },
      orderBy: { versionNum: "desc" },
    });

    const nextVersionNum = (latestVersion?.versionNum || 0) + 1;

    // Create snapshot
    const snapshot = {
      project: {
        title: project.title,
        description: project.description,
        theme: project.theme,
        colorPalette: project.colorPalette,
        coverImage: project.coverImage,
      },
      pages: project.pages,
      photos: project.photos,
      timestamp: new Date().toISOString(),
    };

    const version = await prisma.projectVersion.create({
      data: {
        projectId: params.id,
        userId: user.id,
        versionNum: nextVersionNum,
        title: title || `Version ${nextVersionNum}`,
        description: description || `Saved on ${new Date().toLocaleString()}`,
        snapshot: JSON.stringify(snapshot),
      },
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

    return NextResponse.json(
      {
        message: "Version created successfully",
        version,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Version creation error:", error);
    return NextResponse.json(
      { error: "Failed to create version" },
      { status: 500 }
    );
  }
}
