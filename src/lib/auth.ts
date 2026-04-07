import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    return {
      id: decoded.userId,
      username: decoded.username,
      fullName: decoded.fullName,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
