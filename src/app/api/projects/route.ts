import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

// GET all projects for current user
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const includeShared = searchParams.get("includeShared") === "true";

    const where: any = {};

    if (status) {
      where.status = status;
    }

    // Get user's own projects
    const ownProjects = await prisma.project.findMany({
      where: {
        ...where,
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            pages: true,
            photos: true,
            versions: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    let sharedProjects: any[] = [];

    if (includeShared) {
      // Get projects shared with user
      const collaborations = await prisma.projectCollaborator.findMany({
        where: {
          userId: user.id,
          acceptedAt: { not: null },
        },
        include: {
          project: {
            include: {
              _count: {
                select: {
                  pages: true,
                  photos: true,
                  versions: true,
                },
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      sharedProjects = collaborations.map((c) => ({
        ...c.project,
        collaboratorRole: c.role,
      }));
    }

    return NextResponse.json({
      ownProjects,
      sharedProjects,
    });
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST create new project
export async function POST(req: Request) {
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

    const body = await req.json();
    const { title, description, theme, coverImage } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        theme: theme || "quiet-luxe",
        coverImage,
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            pages: true,
            photos: true,
          },
        },
      },
    });

    // Create initial version
    await prisma.projectVersion.create({
      data: {
        projectId: project.id,
        userId: user.id,
        versionNum: 1,
        title: "Initial version",
        description: "Project created",
        snapshot: JSON.stringify({
          project: {
            title: project.title,
            description: project.description,
            theme: project.theme,
          },
          pages: [],
          photos: [],
        }),
      },
    });

    return NextResponse.json(
      {
        message: "Project created successfully",
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
