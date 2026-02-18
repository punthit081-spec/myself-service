import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const rootDir = path.resolve(process.cwd(), 'backend');

export const env = {
  port: Number(process.env.PORT || 4000),
  baseUrl: process.env.BASE_URL || 'http://localhost:4000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  dbPath: process.env.DB_PATH || path.join(rootDir, 'data', 'app.db'),
  templatePath:
    process.env.PDF_TEMPLATE_PATH || path.join(rootDir, 'templates', 'fillable-form.pdf'),
  outputDir: process.env.OUTPUT_DIR || path.join(rootDir, 'generated')
};
