import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { WastewaterFacility } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM pengelolaan_air_limbah 
      WHERE nama::text LIKE $1 OR kelurahan_desa::text LIKE $2 OR lembaga_pengelola::text LIKE $3
      ORDER BY created_at DESC
      LIMIT $4 OFFSET $5
    `;
    
    const searchTerm = `%${search}%`;
    const facilities = await executeQuery(query, [searchTerm, searchTerm, searchTerm, limit, offset]);

    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) as total FROM pengelolaan_air_limbah 
      WHERE nama::text LIKE $1 OR kelurahan_desa::text LIKE $2 OR lembaga_pengelola::text LIKE $3
    `;
    const countResult = await executeQuery(countQuery, [searchTerm, searchTerm, searchTerm]) as any[];
    const total = countResult[0].total;

    return NextResponse.json({
      success: true,
      data: facilities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch facilities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: WastewaterFacility = await request.json();
    
    const query = `
      INSERT INTO pengelolaan_air_limbah (
        nama, kelurahan_desa, kapasitas_desain, kapasitas_terpasang,
        tahun_dibangun_rehabilitasi, kondisi_status_operasional,
        lembaga_pengelola, pengecekan_effluent, latitude, longitude,
        alamat_lengkap, keterangan
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
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
      body.keterangan || null
    ];

    const result = await executeQuery(query, values) as any[];
    
    return NextResponse.json({
      success: true,
      message: 'Facility created successfully',
      data: { id: result[0].id, ...body }
    });
  } catch (error) {
    console.error('Error creating facility:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create facility' },
      { status: 500 }
    );
  }
}
