import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET() {
  try {
    // Get total facilities count
    const totalFacilitiesQuery = 'SELECT COUNT(*) as total FROM pengelolaan_air_limbah';
    const totalFacilitiesResult = await executeQuery(totalFacilitiesQuery) as any[];
    const totalFacilities = totalFacilitiesResult[0].total;

    // Get active facilities (with optimal status)
    const activeFacilitiesQuery = `
      SELECT COUNT(*) as total FROM pengelolaan_air_limbah 
      WHERE kondisi_status_operasional LIKE '%Optimal%'
    `;
    const activeFacilitiesResult = await executeQuery(activeFacilitiesQuery) as any[];
    const activeFacilities = activeFacilitiesResult[0].total;

    // Get facilities needing effluent check
    const needingCheckQuery = `
      SELECT COUNT(*) as total FROM pengelolaan_air_limbah 
      WHERE pengecekan_effluent = 'Belum dilakukan'
    `;
    const needingCheckResult = await executeQuery(needingCheckQuery) as any[];
    const facilitiesNeedingCheck = needingCheckResult[0].total;

    // Get total capacity
    const totalCapacityQuery = 'SELECT SUM(kapasitas_desain) as total FROM pengelolaan_air_limbah';
    const totalCapacityResult = await executeQuery(totalCapacityQuery) as any[];
    const totalCapacity = totalCapacityResult[0].total || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalFacilities,
        activeFacilities,
        facilitiesNeedingCheck,
        totalCapacity
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
