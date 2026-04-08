import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { User } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, username, email, full_name, role, is_active, last_login, created_at, updated_at 
      FROM users 
      WHERE username::text LIKE $1 OR email::text LIKE $2 OR full_name::text LIKE $3
      ORDER BY created_at DESC
      LIMIT $4 OFFSET $5
    `;
    
    const searchTerm = `%${search}%`;
    const users = await executeQuery(query, [searchTerm, searchTerm, searchTerm, limit, offset]);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total FROM users 
      WHERE username::text LIKE $1 OR email::text LIKE $2 OR full_name::text LIKE $3
    `;
    const countResult = await executeQuery(countQuery, [searchTerm, searchTerm, searchTerm]) as any[];
    const total = countResult[0].total;

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: User = await request.json();
    
    // Hash password
    const hashedPassword = await bcrypt.hash(body.password || 'default123', 10);
    
    const query = `
      INSERT INTO users (username, email, password_hash, full_name, role, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      body.username,
      body.email,
      hashedPassword,
      body.full_name,
      body.role || 'operator',
      body.is_active !== undefined ? body.is_active : true
    ];

    const result = await executeQuery(query, values) as any[];
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: { id: result[0].id, ...body, password_hash: undefined }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}
