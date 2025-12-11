# envmng - Git for .env

**envmng** is a command-line tool that syncs your `.env` files to a secure cloud vault, allowing you to share secrets across your team without committing them to Git.

## Architecture

*   **CLI (`/cli`)**: Node.js CLI tool built with Commander and Inquirer. syncs local `.env` files to the backend.
*   **Backend (`/backend`)**: Express API with PostgreSQL database. Handles project management and secret storage with AES-256 encryption.

## Prerequisites

*   Node.js (v18+)
*   PostgreSQL (or Supabase)

## Setup

### Backend

1.  Navigate to `/backend`:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your database:
    *   Create a Postgres database.
    *   Run the schema in `db/schema.sql`.
4.  Configure `.env` in `/backend`:
    ```env
    PORT=3000
    DATABASE_URL=postgres://user:pass@localhost:5432/dbname
    ENCRYPTION_KEY=your_32_byte_hex_key_here # Optional, random if omitted (for dev)
    ```
5.  Start the server:
    ```bash
    npm run dev
    ```

### CLI

1.  Navigate to `/cli`:
    ```bash
    cd cli
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Link the command globally:
    ```bash
    npm link
    ```
    Now you can run `envmng` from anywhere!

## Usage

### 1. Login
Configure the CLI to point to your backend.

```bash
envmng login
```
*   Enter your API URL (e.g., `http://localhost:3000`)
*   Enter a dummy token (for MVP).

### 2. Initialize a Project
Go to your project folder (where your `.env` lives).

```bash
envmng init
```
*   This creates a `.envmng.json` file linking your local folder to a remote project.

### 3. Push Secrets
Send your local `.env` file to the vault.

```bash
envmng push development
# or
envmng push production
```

### 4. Pull Secrets
Fetch secrets from the vault and write them to your local `.env`.

```bash
envmng pull development
```

## Security

*   Secrets are encrypted using AES-256-CBC before storage.
*   The backend generates a random IV for each encryption.
*   **Production Note**: In a real-world scenario, ensure `ENCRYPTION_KEY` is securely managed and HTTPS is used.

## .gitignore
Ensure you ignore `.env` files but commit `.envmng.json`.

```gitignore
.env
.env.*
!.envmng.json
```
