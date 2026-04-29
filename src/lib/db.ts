import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

let dbInstance: any = null;

export const db = (() => {
  if (!connectionString) {
    return async () => [];
  }
  if (!dbInstance) {
    dbInstance = neon(connectionString);
  }
  return dbInstance;
})();
