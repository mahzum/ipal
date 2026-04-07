import { Pool, PoolClient } from 'pg';

// PostgreSQL connection configuration for Supabase
const dbConfig = {
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates for development
  },
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
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
  const connection = getConnection();
  let client: PoolClient | null = null;
  
  try {
    client = await pool.connect();
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
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
