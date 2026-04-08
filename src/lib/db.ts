import { Pool, PoolClient } from 'pg';

// PostgreSQL connection configuration for Supabase
const dbConfig = {
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Allow self-signed certificates for production
  } : false,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // Increased timeout for build environment
};

let pool: Pool;

export function getConnection(): Pool {
  if (!pool) {
    pool = new Pool(dbConfig);
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }
  return pool;
}

export async function executeQuery(query: string, params: any[] = []) {
  // Only skip database operations during actual build time (not runtime)
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn('Database operations skipped during Next.js build phase');
    return [];
  }

  // Check if we have a valid connection string
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    console.warn('No database connection string available');
    return [];
  }

  const connection = getConnection();
  let client: PoolClient | null = null;
  
  try {
    client = await connection.connect();
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    
    // Only during build phase, return empty result instead of throwing
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      console.warn('Database query failed during build, returning empty result');
      return [];
    }
    
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export async function executeQueryWithClient<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  // Only skip database operations during actual build time (not runtime)
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    console.warn('Database operations skipped during Next.js build phase');
    return null as T;
  }

  const connection = getConnection();
  const client = await connection.connect();
  
  try {
    return await callback(client);
  } finally {
    client.release();
  }
}

// Helper function to convert MySQL-style queries to PostgreSQL
export function convertMySQLQuery(query: string): string {
  // Convert MySQL LIMIT with OFFSET to PostgreSQL syntax
  query = query.replace(/LIMIT\s+(\d+)\s+OFFSET\s+(\d+)/gi, 'LIMIT $1 OFFSET $2');
  
  // Convert MySQL backticks to PostgreSQL double quotes
  query = query.replace(/`/g, '"');
  
  // Convert MySQL NOW() to PostgreSQL NOW()
  query = query.replace(/\bNOW\(\)/gi, 'NOW()');
  
  // Convert MySQL IFNULL to PostgreSQL COALESCE
  query = query.replace(/\bIFNULL\(/gi, 'COALESCE(');
  
  return query;
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const result = await executeQuery('SELECT NOW() as current_time');
    console.log('Database connected successfully:', result[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

export default getConnection;
