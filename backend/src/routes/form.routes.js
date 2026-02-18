import express from 'express';
import path from 'path';
import { nanoid } from 'nanoid';
import { env } from '../config/env.js';
import { generatePdf } from '../services/pdf.service.js';
import { saveSubmission, findSubmissionByToken } from '../services/submission.service.js';
import { validatePayload } from '../utils/validation.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const errors = validatePayload(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const id = nanoid(12);
  const verifyToken = nanoid(24);
  const createdAt = new Date().toISOString();

  const payload = {
    id,
    fullName: req.body.fullName.trim(),
    email: req.body.email.trim(),
    employeeId: req.body.employeeId.trim(),
    department: req.body.department.trim(),
    issueDate: req.body.issueDate,
    verifyToken,
    createdAt
  };

  const verifyUrl = `${env.frontendUrl}/verify.html?token=${verifyToken}`;

  try {
    const pdfPath = await generatePdf({ submission: payload, verifyUrl });

    saveSubmission({
      id,
      full_name: payload.fullName,
      email: payload.email,
      employee_id: payload.employeeId,
      department: payload.department,
      issue_date: payload.issueDate,
      verify_token: verifyToken,
      pdf_path: pdfPath,
      created_at: createdAt
    });

    return res.status(201).json({
      id,
      verifyToken,
      verifyUrl,
      downloadUrl: `${env.baseUrl}/api/forms/download/${id}`
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get('/download/:id', (req, res) => {
  const filePath = path.join(env.outputDir, `${req.params.id}.pdf`);
  return res.download(filePath, `generated-${req.params.id}.pdf`);
});

router.get('/verify/:token', (req, res) => {
  const record = findSubmissionByToken(req.params.token);

  if (!record) {
    return res.status(404).json({ message: 'Document not found or invalid token.' });
  }

  return res.json({
    status: 'valid',
    data: record
  });
});

export default router;
