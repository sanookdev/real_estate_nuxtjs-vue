# AssetSale Platform

แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ครบวงจร พัฒนาด้วยเทคโนโลยี Modern Web Apps

## 🏗️ Tech Stack

### Frontend
- **Framework:** Nuxt.js 3 / Vue.js 3
- **Styling:** Tailwind CSS
- **State Management:** Pinia
- **Icons:** FontAwesome & Nuxt Icons

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer

---

## � Quick Start (ติดตั้งเครื่องใหม่)

### ขั้นตอนทั้งหมด
```bash
# 1. Clone project
git clone <your-repo-url> asset_sale
cd asset_sale

# 2. Setup Backend
cd backend
npm install
cp .env.example .env      # คัดลอกไฟล์ config ตัวอย่าง
# แก้ไข .env ตามค่าเครื่องใหม่

# 3. Setup Database (สำคัญ!)
node setupDb.js --seed    # สร้างตาราง + ข้อมูลตัวอย่าง

# 4. Setup Frontend
cd ../frontend
npm install

# 5. รัน Development
cd ..
npm run dev               # รันทั้ง Backend + Frontend พร้อมกัน
```

---

## ⚙️ การตั้งค่า .env (สำคัญมาก!)

### Backend `.env` Configuration
```env
# Database
DB_HOST=localhost        # หรือ IP ของ MySQL server
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=asset_sale

# JWT Secret (ใช้สร้าง token - ควรตั้งให้ซับซ้อน)
JWT_SECRET=your_super_secret_key_here_change_this

# SMTP (สำหรับส่งอีเมล - optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### ✅ ใช่! แค่แก้ .env แล้วรัน setupDb.js ก็พอ!

---

## 🗄️ Database Setup (3 วิธี)

### วิธีที่ 1: ใช้ Node.js Script (แนะนำ ✨)
```bash
cd backend

# สร้างตารางอย่างเดียว
node setupDb.js

# สร้างตาราง + ข้อมูลตัวอย่าง (แนะนำสำหรับเครื่องใหม่)
node setupDb.js --seed

# Reset ทุกอย่าง (ล้าง + สร้างใหม่ + seed)
node setupDb.js --reset
```

### วิธีที่ 2: Import SQL ตรง
```bash
# ผ่าน MySQL CLI
mysql -u root -p < backend/database/schema.sql

# หรือ Import ผ่าน phpMyAdmin / MySQL Workbench
# file: backend/database/schema.sql
```

### วิธีที่ 3: Manual (สร้างเอง)
1. สร้าง Database ชื่อ `asset_sale`
2. รัน `node setupDb.js` เพื่อสร้างตาราง

---

## 👤 Default Accounts (หลัง seed)

| Role | Email | Password |
|------|-------|----------|
| **Superadmin** | superadmin@assetsale.com | admin123 |
| **Admin** | admin@assetsale.com | admin123 |
| **User** | user@assetsale.com | user123 |

> ⚠️ **สำคัญ:** เปลี่ยนรหัสผ่านหลังจาก deploy ขึ้น production!

---

## 📂 Database Tables

| Table | Description |
|-------|-------------|
| `users` | ผู้ใช้งาน, role, status |
| `listings` | ประกาศอสังหา (ที่อยู่, สิ่งอำนวยความสะดวก, สถานะ) |
| `favorites` | รายการโปรดของผู้ใช้ |
| `ads` | โฆษณา (banner, bento grid) |
| `settings` | ตั้งค่าเว็บไซต์ |
| `contact_messages` | ข้อความติดต่อจากหน้าเว็บ |

---

## 🏃 Running the App

### Development Mode
```bash
# รันทั้งคู่พร้อมกัน (root directory)
npm run dev

# หรือรันแยก
cd backend && npm start     # Port: 5000
cd frontend && npm run dev  # Port: 3000
```

### Production Build
```bash
# Frontend
cd frontend
npm run build
npm run preview  # หรือใช้ PM2/nginx

# Backend  
cd backend
npm start        # หรือใช้ PM2
```

---

## 📂 Project Structure

```
asset_sale/
├── backend/
│   ├── config/           # Database connection
│   ├── controllers/      # API logic
│   ├── database/         # SQL schema files
│   ├── middleware/       # Auth, upload middleware
│   ├── models/           # Database models
│   ├── routes/           # API endpoints
│   ├── services/         # Email service
│   ├── uploads/          # Uploaded images
│   ├── .env              # Environment config
│   ├── setupDb.js        # Database setup script
│   └── server.js         # Entry point
│
├── frontend/
│   ├── layouts/          # Layout templates
│   ├── pages/            # Page components
│   ├── stores/           # Pinia stores
│   ├── utils/            # Helper functions
│   └── nuxt.config.ts    # Nuxt configuration
│
├── package.json          # Root scripts
└── README.md             # This file
```

---

## ✨ Key Features

- 🔐 **Authentication:** Login/Register with role-based access (User/Admin/Superadmin)
- 🏠 **Listing Management:** CRUD อสังหาริมทรัพย์ พร้อมการอนุมัติ
- ❤️ **Favorites:** บันทึกรายการโปรด
- 📢 **Ads Management:** จัดการโฆษณา bento grid
- ⚙️ **Settings:** ตั้งค่าเว็บไซต์ผ่าน Admin panel
- 🎨 **Modern UI:** Glassmorphism, Parallax effects, Responsive

---

## � Troubleshooting

### ปัญหาที่พบบ่อย

**1. ต่อ Database ไม่ได้**
```bash
# ตรวจสอบ MySQL running
sudo systemctl status mysql

# ตรวจสอบ .env ถูกต้อง
cat backend/.env
```

**2. Port 5000/3000 ถูกใช้งาน**
```bash
# หา process ที่ใช้ port
lsof -i :5000
kill -9 <PID>
```

**3. bcrypt error ตอน install**
```bash
# ติดตั้ง build tools
sudo apt-get install build-essential
npm rebuild bcrypt --build-from-source
```

---

## 📝 License

MIT License - Free to use and modify.

---

## 🤝 Support

หากพบปัญหาหรือต้องการความช่วยเหลือ กรุณาติดต่อทีมพัฒนา
