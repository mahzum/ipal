import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { WastewaterFacility } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const query = 'SELECT * FROM pengelolaan_air_limbah WHERE id = $1';
    const result = await executeQuery(query, [id]) as any[];
    
    if (result.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Facility not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Error fetching facility:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch facility' },
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
    const body: WastewaterFacility = await request.json();
    
    const query = `
      UPDATE pengelolaan_air_limbah SET
        nama = $1, kelurahan_desa = $2, kapasitas_desain = $3, kapasitas_terpasang = $4,
        tahun_dibangun_rehabilitasi = $5, kondisi_status_operasional = $6,
        lembaga_pengelola = $7, pengecekan_effluent = $8, latitude = $9, longitude = $10,
        alamat_lengkap = $11, keterangan = $12, updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
    `;

    const values = [
      body.nama,
      body.kelurahan_desa,
      body.kapasitas_desain,
      body.kapasitas_terpasang,
      body.tahun_dibangun_rehabilitasi || null,
      body.kondisi_status_operasional,
      body.lembaga_pengelola,
      body.pengecekan_effluent,
      body.latitude || null,
      body.longitude || null,
      body.alamat_lengkap || null,
      body.keterangan || null,
      id
    ];

    const result = await executeQuery(query, values) as any[];
    
    // For UPDATE operations, check if any rows were affected by running a SELECT
    const checkQuery = 'SELECT id FROM pengelolaan_air_limbah WHERE id = $1';
    const checkResult = await executeQuery(checkQuery, [id]) as any[];
    
    if (checkResult.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Facility not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Facility updated successfully'
    });
  } catch (error) {
    console.error('Error updating facility:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update facility' },
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
    const query = 'DELETE FROM pengelolaan_air_limbah WHERE id = $1';
    const result = await executeQuery(query, [id]) as any[];
    
    // For DELETE operations, check if facility was deleted by trying to select it again
    const checkQuery = 'SELECT id FROM pengelolaan_air_limbah WHERE id = $1';
    const checkResult = await executeQuery(checkQuery, [id]) as any[];
    
    if (checkResult.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Facility not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Facility deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting facility:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete facility' },
      { status: 500 }
    );
  }
}
