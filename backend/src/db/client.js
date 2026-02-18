import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { env } from '../config/env.js';

fs.mkdirSync(path.dirname(env.dbPath), { recursive: true });

const db = new Database(env.dbPath);
db.pragma('journal_mode = WAL');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS form_submissions (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      employee_id TEXT NOT NULL,
      department TEXT NOT NULL,
      issue_date TEXT NOT NULL,
      verify_token TEXT NOT NULL UNIQUE,
      pdf_path TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

export default db;
