import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const query = 'SELECT id, username, email, full_name, role, is_active, last_login, created_at, updated_at FROM users WHERE id = $1';
    const result = await executeQuery(query, [id]) as any[];
    
    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    let query = `
      UPDATE users SET
        username = $1, email = $2, full_name = $3, role = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
    `;
    
    let values = [
      body.username,
      body.email,
      body.full_name,
      body.role,
      body.is_active,
      id
    ];

    // If password is provided, hash it and update
    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      query = `
        UPDATE users SET
          username = $1, email = $2, password_hash = $3, full_name = $4, role = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
      `;
      values = [
        body.username,
        body.email,
        hashedPassword,
        body.full_name,
        body.role,
        body.is_active,
        id
      ];
    }

    const result = await executeQuery(query, values) as any[];
    
    // For UPDATE operations, check if user exists by running a SELECT
    const checkQuery = 'SELECT id FROM users WHERE id = $1';
    const checkResult = await executeQuery(checkQuery, [id]) as any[];
    
    if (checkResult.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const query = 'DELETE FROM users WHERE id = $1 AND id != 1'; // Protect admin user
    const result = await executeQuery(query, [id]) as any[];
    
    // For DELETE operations, check if user was deleted by trying to select it again
    const checkQuery = 'SELECT id FROM users WHERE id = $1';
    const checkResult = await executeQuery(checkQuery, [id]) as any[];
    
    if (checkResult.length > 0) {
      return NextResponse.json(
        { success: false, message: 'User not found or cannot delete admin user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
