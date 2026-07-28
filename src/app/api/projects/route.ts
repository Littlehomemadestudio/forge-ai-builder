import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/projects - List all projects for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';

    // Verify user exists first; if not, return empty list instead of 500
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

// POST /api/projects - Create a new project
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
      userId = 'demo-user',
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'name is required' },
        { status: 400 },
      );
    }

    // Verify user exists; auto-create if not found (demo flow)
    let user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          id: userId,
          email: `${userId}@forge.ai`,
          name: userId,
          plan: 'free',
          aiCredits: 100,
        },
      });
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
