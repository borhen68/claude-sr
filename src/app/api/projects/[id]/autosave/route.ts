import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

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
    const { pages, photos, metadata } = body;

    // Update last saved timestamp
    await prisma.project.update({
      where: { id: params.id },
      data: {
        lastSavedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Autosave successful",
      savedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Autosave error:", error);
    return NextResponse.json(
      { error: "Autosave failed" },
      { status: 500 }
    );
  }
}
