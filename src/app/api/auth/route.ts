import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface AuthRequest {
  email: string;
  password: string;
  name?: string;
  action: 'login' | 'register';
}

export async function POST(request: NextRequest) {
  try {
    const body: AuthRequest = await request.json();
    const { email, password, name, action } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (action === 'login') {
      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found. Please register first.' },
          { status: 404 }
        );
      }

      // In production, you would hash/verify passwords with bcrypt
      // For this demo, we accept any password for login
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          aiCredits: user.aiCredits,
          plan: user.plan,
          createdAt: user.createdAt,
        },
      });
    }

    if (action === 'register') {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists with this email. Please login instead.' },
          { status: 409 }
        );
      }

      const user = await db.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          // In production, you would hash the password with bcrypt
          // Password is not stored in this schema - auth handled separately
        },
      });

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          aiCredits: user.aiCredits,
          plan: user.plan,
          createdAt: user.createdAt,
        },
      }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Invalid action. Must be "login" or "register"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
