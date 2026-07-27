import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/user - Get current user info (default demo-user)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';
    const email = searchParams.get('userIdByEmail');

    // Support looking up by email (for post-login user fetch)
    const whereClause = email ? { email } : { id: userId };

    const user = await db.user.findUnique({
      where: whereClause,
      include: {
        _count: {
          select: { projects: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        plan: user.plan,
        aiCredits: user.aiCredits,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        projectCount: user._count.projects,
      },
    });
  } catch (error) {
    console.error('User GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// PATCH /api/user - Update user info
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'demo-user', ...updates } = body;

    // Verify user exists
    const existing = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    // Build update data from allowed fields
    const allowedFields = ['name', 'email', 'avatarUrl', 'plan', 'aiCredits'];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 },
      );
    }

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        plan: user.plan,
        aiCredits: user.aiCredits,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('User PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
