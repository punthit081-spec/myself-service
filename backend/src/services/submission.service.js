import db from '../db/client.js';

const insertStmt = db.prepare(`
  INSERT INTO form_submissions (
    id,
    full_name,
    email,
    employee_id,
    department,
    issue_date,
    verify_token,
    pdf_path,
    created_at
  ) VALUES (
    @id,
    @full_name,
    @email,
    @employee_id,
    @department,
    @issue_date,
    @verify_token,
    @pdf_path,
    @created_at
  )
`);

const findByTokenStmt = db.prepare(`
  SELECT
    id,
    full_name,
    email,
    employee_id,
    department,
    issue_date,
    verify_token,
    created_at
  FROM form_submissions
  WHERE verify_token = ?
`);

export function saveSubmission(payload) {
  insertStmt.run(payload);
}

export function findSubmissionByToken(token) {
  return findByTokenStmt.get(token);
}
