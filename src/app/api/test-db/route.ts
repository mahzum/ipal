import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Log environment variables (without exposing sensitive data)
    const dbUrl = process.env.DATABASE_URL;
    const postgresUrl = process.env.POSTGRES_URL;
    
    console.log('DATABASE_URL exists:', !!dbUrl);
    console.log('POSTGRES_URL exists:', !!postgresUrl);
    
    if (!dbUrl && !postgresUrl) {
      return NextResponse.json({
        success: false,
        error: 'No database connection string found',
        env: {
          DATABASE_URL: !!dbUrl,
          POSTGRES_URL: !!postgresUrl
        }
      });
    }

    // Test connection with detailed error info
    const connectionString = dbUrl || postgresUrl;
    
    // Parse connection string to show non-sensitive parts
    let parsedUrl;
    try {
      if (connectionString) {
        parsedUrl = new URL(connectionString);
        console.log('Connection host:', parsedUrl.hostname);
        console.log('Connection port:', parsedUrl.port);
        console.log('Connection database:', parsedUrl.pathname);
      }
    } catch (e) {
      console.log('Failed to parse connection string:', e);
    }

    const pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      max: 1,
      connectionTimeoutMillis: 10000,
    });

    // Test simple query
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    client.release();
    await pool.end();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        current_time: result.rows[0].current_time,
        pg_version: result.rows[0].pg_version,
        connection_info: {
          host: parsedUrl?.hostname,
          port: parsedUrl?.port,
          database: parsedUrl?.pathname
        }
      }
    });

  } catch (error: any) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      severity: error.severity
    }, { status: 500 });
  }
}
