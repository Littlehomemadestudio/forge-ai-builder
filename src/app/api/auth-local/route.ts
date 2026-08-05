import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

/**
 * POST /api/auth-local
 * Body: { action: 'register' | 'login', ... }
 *
 * A local endpoint for seeding/verifying users in the database BEFORE calling
 * NextAuth's signIn('credentials'). It intentionally lives OUTSIDE the
 * `/api/auth/*` namespace so it never conflicts with NextAuth's catch-all
 * route (`/api/auth/[...nextauth]`), which must own every `/api/auth/*` path
 * (session, csrf, providers, callback, …).
 */
interface RegisterRequest {
  name: string;
  email: string;
  username?: string;
  password: string;
}

interface LoginRequest {
  identifier: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body as { action?: 'register' | 'login' };

    if (action === 'register') {
      return await handleRegister(body as RegisterRequest);
    }

    if (action === 'login') {
      return await handleLogin(body as LoginRequest);
    }

    return NextResponse.json(
      { error: 'Invalid action. Must be "register" or "login".' },
      { status: 400 },
    );
  } catch (error) {
    console.error('Local auth route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 },
    );
  }
}

async function handleRegister({ name, email, username, password }: RegisterRequest) {
  // ── Validation ──────────────────────────────────────────────────────────
  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (!email || !email.trim()) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters long' },
      { status: 400 },
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingByEmail = await db.user.findUnique({ where: { email: normalizedEmail } });
  if (existingByEmail) {
    return NextResponse.json(
      { error: 'An account with this email already exists. Please sign in instead.' },
      { status: 409 },
    );
  }

  const trimmedUsername = username?.trim() || undefined;
  if (trimmedUsername) {
    const existingByUsername = await db.user.findUnique({ where: { username: trimmedUsername } });
    if (existingByUsername) {
      return NextResponse.json(
        { error: 'This username is already taken. Please choose another.' },
        { status: 409 },
      );
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      email: normalizedEmail,
      username: trimmedUsername || null,
      name: name.trim(),
      passwordHash,
      plan: 'free',
      aiCredits: 100,
      provider: 'credentials',
    },
  });

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatarUrl: user.avatarUrl,
        aiCredits: user.aiCredits,
        plan: user.plan,
        provider: user.provider,
        createdAt: user.createdAt,
      },
    },
    { status: 201 },
  );
}

async function handleLogin({ identifier, password }: LoginRequest) {
  if (!identifier || !password) {
    return NextResponse.json(
      { error: 'Email/username and password are required' },
      { status: 400 },
    );
  }

  let user = null;
  const trimmed = identifier.trim();
  const lower = trimmed.toLowerCase();

  if (lower.includes('@')) {
    user = await db.user.findUnique({ where: { email: lower } });
  } else {
    user = await db.user.findUnique({ where: { username: trimmed } });
    if (!user) {
      user = await db.user.findUnique({ where: { username: lower } });
    }
  }

  if (!user) {
    return NextResponse.json(
      { error: 'No account found with that email or username. Please sign up first.' },
      { status: 404 },
    );
  }

  if (!user.passwordHash) {
    return NextResponse.json(
      { error: 'This account was created with Google. Please use "Continue with Google" to sign in.' },
      { status: 400 },
    );
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    return NextResponse.json(
      { error: 'Incorrect password. Please try again.' },
      { status: 401 },
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      aiCredits: user.aiCredits,
      plan: user.plan,
      provider: user.provider,
      createdAt: user.createdAt,
    },
  });
}
