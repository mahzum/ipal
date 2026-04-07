import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const query = 'SELECT id, username, email, full_name, role, is_active, last_login, created_at, updated_at FROM users WHERE id = ?';
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
        username = ?, email = ?, full_name = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
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
          username = ?, email = ?, password_hash = ?, full_name = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
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

    const result = await executeQuery(query, values) as any;
    
    if (result.affectedRows === 0) {
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
    const query = 'DELETE FROM users WHERE id = ? AND id != 1'; // Protect admin user
    const result = await executeQuery(query, [id]) as any;
    
    if (result.affectedRows === 0) {
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
