import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function resolveUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  return user?.id ?? null;
}

// GET /api/projects/[id] - Get a single project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = await resolveUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in to view this project.' },
        { status: 401 },
      );
    }

    const project = await db.project.findFirst({
      where: { id, userId },
      include: {
        pages: true,
        deployments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Project GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// PATCH /api/projects/[id] - Update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const userId = await resolveUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in to update this project.' },
        { status: 401 },
      );
    }

    // Verify project exists
    const existing = await db.project.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 },
      );
    }

    // Build update data from allowed fields
    const allowedFields = [
      'name',
      'description',
      'prompt',
      'thumbnail',
      'status',
      'theme',
      'industry',
      'framework',
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Optionally update the home page's HTML/CSS/JS if provided.
    // This is how the builder persists generated page content alongside
    // the project metadata, so re-opening the project from the dashboard
    // brings back the actual generated site.
    if (body.pageHtml !== undefined || body.pageCss !== undefined || body.pageJs !== undefined || body.pageName !== undefined) {
      // Find the project's home page (route "/") — create if missing
      let homePage = await db.page.findFirst({
        where: { projectId: id, route: '/' },
      });
      if (!homePage) {
        homePage = await db.page.create({
          data: {
            name: body.pageName || 'Home',
            route: '/',
            html: body.pageHtml || null,
            css: body.pageCss || null,
            js: body.pageJs || null,
            projectId: id,
          },
        });
      } else {
        const pageUpdate: Record<string, unknown> = {};
        if (body.pageName !== undefined) pageUpdate.name = body.pageName;
        if (body.pageHtml !== undefined) pageUpdate.html = body.pageHtml;
        if (body.pageCss !== undefined) pageUpdate.css = body.pageCss;
        if (body.pageJs !== undefined) pageUpdate.js = body.pageJs;
        if (Object.keys(pageUpdate).length > 0) {
          await db.page.update({
            where: { id: homePage.id },
            data: pageUpdate,
          });
        }
      }
    }

    if (Object.keys(updateData).length === 0 && body.pageHtml === undefined && body.pageCss === undefined && body.pageJs === undefined && body.pageName === undefined) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 },
      );
    }

    let project;
    if (Object.keys(updateData).length > 0) {
      project = await db.project.update({
        where: { id },
        data: updateData,
        include: { pages: true },
      });
    } else {
      project = await db.project.findUnique({
        where: { id },
        include: { pages: true },
      });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Project PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// DELETE /api/projects/[id] - Delete a project by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const userId = await resolveUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in to delete this project.' },
        { status: 401 },
      );
    }

    const existing = await db.project.findFirst({
      where: { id, userId },
    });

    if (!existing) {
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
    console.error('Project DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
