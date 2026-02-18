import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';
import { env } from '../config/env.js';

const FIELD_MAPPINGS = {
  fullName: 'full_name',
  email: 'email',
  employeeId: 'employee_id',
  department: 'department',
  issueDate: 'issue_date'
};

export async function generatePdf({ submission, verifyUrl }) {
  if (!fs.existsSync(env.templatePath)) {
    throw new Error(
      `PDF template not found at ${env.templatePath}. Add your fillable PDF file there.`
    );
  }

  fs.mkdirSync(env.outputDir, { recursive: true });

  const templateBytes = fs.readFileSync(env.templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  for (const [payloadKey, pdfFieldName] of Object.entries(FIELD_MAPPINGS)) {
    const value = submission[payloadKey] ?? '';
    try {
      form.getTextField(pdfFieldName).setText(value);
    } catch {
      // Ignore missing fields so template can evolve without runtime crash.
    }
  }

  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 256
  });

  const pngBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  const qrImage = await pdfDoc.embedPng(pngBytes);

  const pages = pdfDoc.getPages();
  const lastPage = pages[pages.length - 1];
  const { width } = lastPage.getSize();

  lastPage.drawImage(qrImage, {
    x: width - 150,
    y: 50,
    width: 100,
    height: 100
  });

  form.flatten();

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(env.outputDir, `${submission.id}.pdf`);
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
}
