import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.userId,
        username: decoded.username,
        full_name: decoded.fullName,
        role: decoded.role
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid token' },
      { status: 401 }
    );
  }
}
