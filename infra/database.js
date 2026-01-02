import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};

function getSSLValues() {
  // AWS RDS with CA certificate
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
      rejectUnauthorized: true,
    };
  }

  // Check if connecting to local database
  const isLocal =
    process.env.POSTGRES_HOST === "localhost" ||
    process.env.POSTGRES_HOST === "127.0.0.1";

  // Local: no SSL needed
  // Remote (Neon, etc.): SSL with relaxed validation
  return isLocal ? false : { rejectUnauthorized: false };
}
