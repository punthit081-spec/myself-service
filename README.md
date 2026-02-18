# Fillable PDF Web App (Node.js + Express + SQLite)

โปรเจคตัวอย่างสำหรับ:
- รับข้อมูลจากหน้าเว็บ
- เติมข้อมูลลง PDF form field อัตโนมัติ
- สร้าง QR code ลงใน PDF
- Generate และ Download PDF
- Verify เอกสารผ่าน token + ดึงข้อมูลจาก SQLite

## 1) Folder Structure

```bash
myself-service/
├─ backend/
│  ├─ src/
│  │  ├─ config/env.js
│  │  ├─ db/client.js
│  │  ├─ routes/form.routes.js
│  │  ├─ services/pdf.service.js
│  │  ├─ services/submission.service.js
│  │  ├─ utils/validation.js
│  │  └─ server.js
│  ├─ templates/
│  │  ├─ fillable-form.pdf   # ใส่ไฟล์จริงของคุณ
│  │  └─ README.md
│  ├─ data/                  # sqlite db จะถูกสร้างอัตโนมัติ
│  ├─ generated/             # pdf ที่ generate แล้ว
│  ├─ .env.example
│  └─ package.json
├─ frontend/
│  ├─ index.html
│  ├─ verify.html
│  ├─ src/
│  │  ├─ config.js
│  │  ├─ main.js
│  │  ├─ verify.js
│  │  └─ styles.css
│  ├─ .env.example
│  └─ package.json
├─ package.json
└─ README.md
```

---

## 2) โค้ดครบทุกไฟล์

ไฟล์ทั้งหมดอยู่ใน repository นี้แล้ว พร้อมใช้งานได้ทันที โดยจุดที่ต้องใส่เองมีแค่:
- `backend/templates/fillable-form.pdf`

> หมายเหตุ: ชื่อ field ใน PDF ควรตรงกับ mapping ใน `backend/src/services/pdf.service.js`

Default mapping:
- `full_name`
- `email`
- `employee_id`
- `department`
- `issue_date`

---

## 3) วิธีติดตั้งและรันโปรเจค

### Prerequisites
- Node.js 20+
- npm 10+

### Install

```bash
npm install
npm run install:all
```

### Setup env

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### เพิ่มไฟล์ PDF template

วางไฟล์ PDF แบบ fillable form ที่ path:

```bash
backend/templates/fillable-form.pdf
```

### Run (frontend + backend พร้อมกัน)

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

### วิธีใช้งาน
1. เข้า `http://localhost:5173`
2. กรอกฟอร์ม
3. กดปุ่ม `Generate & Download PDF`
4. ระบบจะบันทึกข้อมูลลง SQLite, สร้าง PDF และดาวน์โหลดให้
5. ใน PDF จะมี QR code สำหรับ verify

---

## 4) วิธี Deploy

## Option A: Railway (แนะนำสำหรับ backend + sqlite ง่ายสุด)

### Deploy Backend
1. Push โปรเจคขึ้น GitHub
2. สร้าง Railway Project → Deploy from GitHub
3. เลือก service ที่ root เป็น `backend`
4. ตั้งค่า Environment Variables:
   - `PORT=4000`
   - `BASE_URL=https://<your-backend>.up.railway.app`
   - `FRONTEND_URL=https://<your-frontend-domain>`
   - `DB_PATH=backend/data/app.db`
   - `PDF_TEMPLATE_PATH=backend/templates/fillable-form.pdf`
   - `OUTPUT_DIR=backend/generated`
5. อัปโหลด/commit ไฟล์ `fillable-form.pdf` ไปใน repo

### Deploy Frontend
1. ใช้ Vercel/Netlify/Railway static deploy
2. ตั้ง `VITE_API_BASE_URL` ให้ชี้ไป backend Railway URL

---

## Option B: Vercel

แนะนำแยก deploy เป็น 2 โปรเจค:

### Frontend บน Vercel
- Framework Preset: Vite
- Root Directory: `frontend`
- Env: `VITE_API_BASE_URL=https://<backend-url>`

### Backend
- สามารถ deploy backend บน Railway/Render แล้วให้ frontend เรียก API
- ถ้าจะ deploy backend บน Vercel serverless โดยตรง ต้องระวังว่า sqlite local file มีข้อจำกัดด้าน persistence (เหมาะแค่ demo)

---

## Libraries ที่ใช้ตาม requirement
- Backend: `Node.js`, `Express`
- PDF form: `pdf-lib`
- QR code: `qrcode`
- Database: `better-sqlite3` (SQLite)
- Frontend: Vite + Vanilla JS (แยก folder ชัดเจน)

