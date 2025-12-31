const express = require('express');
const router = express.Router();
const sendEmail = require('../services/emailService');

// POST /api/contact - Handle contact form submission
router.post('/', async (req, res) => {
    try {
        const { name, surname, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // Subject mapping
        const subjectMap = {
            'buy': 'สนใจซื้ออสังหาริมทรัพย์',
            'sell': 'ต้องการขายอสังหาริมทรัพย์',
            'rent': 'สนใจเช่าอสังหาริมทรัพย์',
            'consult': 'ต้องการคำปรึกษา',
            'other': 'อื่นๆ'
        };

        const subjectText = subjectMap[subject] || subject || 'ติดต่อจากเว็บไซต์';

        // Email content for admin
        const adminEmailHtml = `
            <div style="font-family: 'Kanit', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #15803d 0%, #166534 100%); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">📬 ข้อความใหม่จากเว็บไซต์</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #166534; border-bottom: 2px solid #166534; padding-bottom: 10px;">
                        ${subjectText}
                    </h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; font-weight: bold; color: #374151;">ชื่อ-นามสกุล:</td>
                            <td style="padding: 10px 0; color: #4b5563;">${name} ${surname || ''}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; font-weight: bold; color: #374151;">อีเมล:</td>
                            <td style="padding: 10px 0; color: #4b5563;"><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; font-weight: bold; color: #374151;">โทรศัพท์:</td>
                            <td style="padding: 10px 0; color: #4b5563;">${phone || '-'}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; border-left: 4px solid #166534;">
                        <h3 style="margin-top: 0; color: #374151;">ข้อความ:</h3>
                        <p style="color: #4b5563; line-height: 1.6;">${message}</p>
                    </div>
                </div>
                <div style="background: #1f2937; padding: 20px; text-align: center;">
                    <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                        © ${new Date().getFullYear()} AssetSale - ระบบจัดการอสังหาริมทรัพย์
                    </p>
                </div>
            </div>
        `;

        // Send email to admin
        await sendEmail(
            process.env.SMTP_USER, // Send to admin email
            `[AssetSale] ${subjectText} - จาก ${name}`,
            `ชื่อ: ${name} ${surname}\nอีเมล: ${email}\nโทร: ${phone}\n\nข้อความ:\n${message}`,
            adminEmailHtml
        );

        // Auto-reply to customer
        const customerEmailHtml = `
            <div style="font-family: 'Kanit', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #15803d 0%, #166534 100%); padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0;">🏠 AssetSale</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #166534;">ขอบคุณที่ติดต่อเรา!</h2>
                    <p style="color: #4b5563; line-height: 1.6;">
                        สวัสดีคุณ ${name},
                    </p>
                    <p style="color: #4b5563; line-height: 1.6;">
                        เราได้รับข้อความของคุณเรียบร้อยแล้ว ทีมงานของเราจะตรวจสอบและติดต่อกลับโดยเร็วที่สุด
                        ภายใน 24-48 ชั่วโมงทำการ
                    </p>
                    <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <h3 style="margin-top: 0; color: #374151;">สรุปข้อความของคุณ:</h3>
                        <p style="color: #6b7280; font-style: italic;">"${message.substring(0, 200)}${message.length > 200 ? '...' : ''}"</p>
                    </div>
                    <p style="color: #4b5563; line-height: 1.6;">
                        หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อเราได้ที่:<br>
                        📞 02-123-4567<br>
                        📧 info@assetsale.co.th
                    </p>
                </div>
                <div style="background: #1f2937; padding: 20px; text-align: center;">
                    <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                        © ${new Date().getFullYear()} AssetSale - แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ชั้นนำ
                    </p>
                </div>
            </div>
        `;

        await sendEmail(
            email,
            'ขอบคุณที่ติดต่อ AssetSale - เราได้รับข้อความของคุณแล้ว',
            `ขอบคุณที่ติดต่อเรา!\n\nเราได้รับข้อความของคุณเรียบร้อยแล้ว ทีมงานของเราจะติดต่อกลับโดยเร็วที่สุด`,
            customerEmailHtml
        );

        res.status(200).json({ message: 'ส่งข้อความเรียบร้อยแล้ว' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' });
    }
});

module.exports = router;
