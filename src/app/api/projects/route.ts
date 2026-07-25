import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface CreateProjectRequest {
  name: string;
  description?: string;
  prompt?: string;
  framework?: string;
  userId: string;
  html?: string;
  css?: string;
}

interface DeleteProjectRequest {
  id: string;
}

// GET /api/projects - List all projects for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const projects = await db.project.findMany({
      where: { userId },
      include: {
        pages: true,
        versions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body: CreateProjectRequest = await request.json();
    const { name, description, prompt, framework, userId, html, css } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { error: 'name and userId are required' },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const project = await db.project.create({
      data: {
        name,
        description: description || '',
        prompt: prompt || '',
        framework: framework || 'html',
        userId,
        status: 'draft',
      },
    });

    // If HTML content was provided, create a default page
    if (html) {
      await db.page.create({
        data: {
          name: 'Home',
          route: '/',
          html: html,
          css: css || '',
          js: '',
          projectId: project.id,
        },
      });
    } else {
      // Create a blank default page
      await db.page.create({
        data: {
          name: 'Home',
          route: '/',
          html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My Website</title>\n</head>\n<body>\n  <h1>Welcome to your new website</h1>\n</body>\n</html>',
          css: '',
          js: '',
          projectId: project.id,
        },
      });
    }

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
      { status: 500 }
    );
  }
}

// DELETE /api/projects - Delete a project by id
export async function DELETE(request: NextRequest) {
  try {
    const body: DeleteProjectRequest = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Project id is required' },
        { status: 400 }
      );
    }

    // Check if project exists
    const existingProject = await db.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete the project (cascade deletes pages, versions, components, deployments)
    await db.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Projects DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
