import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

/**
 * GET /api/user
 * Query params:
 *   - userId=<id>             look up by id
 *   - userIdByEmail=<email>   look up by email
 *   - userIdByUsername=<name> look up by username
 *
 * If no query is provided, the current NextAuth session user is returned.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('userIdByEmail');
    const username = searchParams.get('userIdByUsername');

    let user = null;

    // 1. Explicit lookup by id / email / username
    if (email) {
      user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { _count: { select: { projects: true } } },
      });
    } else if (username) {
      user = await db.user.findUnique({
        where: { username },
        include: { _count: { select: { projects: true } } },
      });
      // Try case-insensitive fallback for username (SQLite is case-sensitive)
      if (!user) {
        user = await db.user.findUnique({
          where: { username: username.toLowerCase() },
          include: { _count: { select: { projects: true } } },
        });
      }
    } else if (userId) {
      user = await db.user.findUnique({
        where: { id: userId },
        include: { _count: { select: { projects: true } } },
      });
    }

         // 2. Fall back to the NextAuth session user
    if (!user) {
      const session = await getServerSession(authOptions)
      if (session?.user?.email) {
        user = await db.user.findUnique({
          where: { email: session.user.email },
          include: { _count: { select: { projects: true } } },
        })
      }
    }

    // 3. No user found — return 200 with null instead of 404 so the frontend
    //    never sees a "Failed to load resource" error. The dashboard handles
    //    `user: null` gracefully (shows cached/empty state).
    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
        plan: user.plan,
        aiCredits: user.aiCredits,
        provider: user.provider,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        projectCount: user._count?.projects ?? 0,
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
    const { userId, ...updates } = body;

    // Resolve target user: explicit userId, or current session user
    let targetUserId = userId;
    if (!targetUserId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 },
        );
      }
      const sessionUser = await db.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      if (!sessionUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 },
        );
      }
      targetUserId = sessionUser.id;
    }

    const existing = await db.user.findUnique({
      where: { id: targetUserId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    // Build update data from allowed fields
    const allowedFields = ['name', 'email', 'username', 'avatarUrl', 'plan', 'aiCredits'];
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

    // Normalize email if present
    if (updateData.email) {
      updateData.email = String(updateData.email).toLowerCase();
    }

    const user = await db.user.update({
      where: { id: targetUserId },
      data: updateData,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
        plan: user.plan,
        aiCredits: user.aiCredits,
        provider: user.provider,
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
