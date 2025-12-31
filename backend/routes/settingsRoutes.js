const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const sendEmail = require('../services/emailService');

router.get('/', authMiddleware, roleMiddleware(['superadmin']), settingsController.getSettings);
router.put('/', authMiddleware, roleMiddleware(['superadmin']), settingsController.updateSettings);

// Test email endpoint
router.post('/test-email', authMiddleware, roleMiddleware(['superadmin']), async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'กรุณาระบุอีเมล' });
        }

        const testHtml = `
            <div style="font-family: 'Kanit', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #15803d 0%, #166534 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">🎉 ทดสอบส่งอีเมลสำเร็จ!</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                        สวัสดีครับ,
                    </p>
                    <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
                        ถ้าคุณได้รับอีเมลนี้ แสดงว่าการตั้งค่า SMTP ของคุณทำงานได้ถูกต้องแล้ว!
                    </p>
                    <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #166534;">
                        <h3 style="margin-top: 0; color: #374151;">รายละเอียดการทดสอบ:</h3>
                        <ul style="color: #6b7280; line-height: 1.8;">
                            <li>เวลาส่ง: ${new Date().toLocaleString('th-TH')}</li>
                            <li>ส่งถึง: ${email}</li>
                        </ul>
                    </div>
                    <p style="color: #4b5563; line-height: 1.6;">
                        ตอนนี้ระบบพร้อมส่งอีเมลแจ้งเตือนให้ผู้ใช้แล้วครับ
                    </p>
                </div>
                <div style="background: #1f2937; padding: 20px; text-align: center;">
                    <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                        © ${new Date().getFullYear()} AssetSale - ระบบจัดการอสังหาริมทรัพย์
                    </p>
                </div>
            </div>
        `;

        await sendEmail(
            email,
            '[AssetSale] ทดสอบส่งอีเมล - การตั้งค่า SMTP ถูกต้อง',
            'ทดสอบส่งอีเมลสำเร็จ! การตั้งค่า SMTP ทำงานได้ถูกต้อง',
            testHtml
        );

        res.json({ message: 'ส่งอีเมลทดสอบเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('Test email error:', error);
        res.status(500).json({ message: 'ส่งอีเมลไม่สำเร็จ: ' + error.message });
    }
});

module.exports = router;
