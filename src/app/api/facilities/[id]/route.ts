import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { WastewaterFacility } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const query = 'SELECT * FROM pengelolaan_air_limbah WHERE id = ?';
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
        nama = ?, kelurahan_desa = ?, kapasitas_desain = ?, kapasitas_terpasang = ?,
        tahun_dibangun_rehabilitasi = ?, kondisi_status_operasional = ?,
        lembaga_pengelola = ?, pengecekan_effluent = ?, latitude = ?, longitude = ?,
        alamat_lengkap = ?, keterangan = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
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

    const result = await executeQuery(query, values) as any;
    
    if (result.affectedRows === 0) {
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
    const query = 'DELETE FROM pengelolaan_air_limbah WHERE id = ?';
    const result = await executeQuery(query, [id]) as any;
    
    if (result.affectedRows === 0) {
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
