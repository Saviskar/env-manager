import pg from 'pg';
import { encrypt, decrypt } from './cryptoService.js';

const { Pool } = pg;

// DB CONNECTION:
// Uses pg connection pool for better performance and scalability.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Creates a new project entry.
 * @param {string} name - User-friendly project name.
 * @param {string[]} environments - Array of env names (e.g. ['development', 'production']).
 */
export async function createProject(name, environments) {
  const res = await pool.query(
    'INSERT INTO projects (name, environments) VALUES ($1, $2) RETURNING *',
    [name, environments]
  );
  return res.rows[0];
}

export async function getProject(id) {
  const res = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
  return res.rows[0];
}

/**
 * Pushes a new version of the environment file.
 * This function handles versioning automatically:
 * 1. Starts a transaction.
 * 2. Finds the current max version for this project/environment.
 * 3. Increments version by 1.
 * 4. Encrypts and saves the new content.
 * 5. Commits.
 */
export async function pushEnv(projectId, environment, rawContent) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // VERSION CHECK: Find the latest version number to increment it
        const versionRes = await client.query(
            'SELECT MAX(version) as max_ver FROM env_versions WHERE project_id = $1 AND environment = $2',
            [projectId, environment]
        );
        const nextVersion = (versionRes.rows[0].max_ver || 0) + 1;

        // ENCRYPTION: Never store raw env content in the DB
        const encrypted = encrypt(rawContent);

        const res = await client.query(
            'INSERT INTO env_versions (project_id, environment, encrypted_content, version) VALUES ($1, $2, $3, $4) RETURNING *',
            [projectId, environment, encrypted, nextVersion]
        );

        await client.query('COMMIT');
        return res.rows[0];
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

/**
 * Retrieves the latest environment config.
 * 1. Fetches the row with the highest version number.
 * 2. Decrypts the content before returning.
 */
export async function pullEnv(projectId, environment) {
    const res = await pool.query(
        'SELECT * FROM env_versions WHERE project_id = $1 AND environment = $2 ORDER BY version DESC LIMIT 1',
        [projectId, environment]
    );
    
    if (res.rows.length === 0) {
        return null;
    }

    const record = res.rows[0];
    // DECRYPTION: The service layer handles decryption transparently 
    // so the controller/router just sees the plain string.
    const decrypted = decrypt(record.encrypted_content);
    return { ...record, envContent: decrypted };
}
