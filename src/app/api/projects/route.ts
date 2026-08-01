import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * Resolve the current authenticated user.
 * Returns null if no user can be identified.
 */
async function resolveUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (user) return user.id;
  }

  return null;
}

// GET /api/projects - List all projects for the authenticated user
export async function GET() {
  try {
    const userId = await resolveUserId();

    // If no authenticated user, return empty list (frontend will redirect to login)
    if (!userId) {
      return NextResponse.json({ projects: [] });
    }

    // Verify user exists; if not, return empty list instead of 500
    const userExists = await db.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      return NextResponse.json({ projects: [] });
    }

    const projects = await db.project.findMany({
      where: { userId },
      include: {
        pages: {
          select: {
            id: true,
            name: true,
            route: true,
          },
        },
        deployments: {
          select: {
            id: true,
            platform: true,
            url: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// POST /api/projects - Create a new project for the authenticated user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      prompt,
      industry,
      theme,
      framework,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 },
      );
    }

    const userId = await resolveUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in to create a project.' },
        { status: 401 },
      );
    }

    // Verify user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    const project = await db.project.create({
      data: {
        name,
        description: description || null,
        prompt: prompt || null,
        industry: industry || null,
        theme: theme || 'light',
        framework: framework || 'nextjs',
        userId,
        status: 'draft',
      },
    });

    // Create a default home page
    await db.page.create({
      data: {
        name: 'Home',
        route: '/',
        html: null,
        css: null,
        js: null,
        projectId: project.id,
      },
    });

    // Fetch the project with its pages
    const projectWithPages = await db.project.findUnique({
      where: { id: project.id },
      include: { pages: true },
    });

    return NextResponse.json({ project: projectWithPages }, { status: 201 });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// DELETE /api/projects - Delete a project by id (body: { id })
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Project id is required' },
        { status: 400 },
      );
    }

    const existingProject = await db.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 },
      );
    }

    const userId = await resolveUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in to delete a project.' },
        { status: 401 },
      );
    }

    if (existingProject.userId !== userId) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 },
      );
    }

    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Projects DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
