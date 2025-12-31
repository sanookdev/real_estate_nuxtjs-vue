const nodemailer = require('nodemailer');
const SettingsModel = require('../models/settingsModel');
require('dotenv').config();

const sendEmail = async (to, subject, text, html) => {
    try {
        // Load dynamic settings from DB
        const host = await SettingsModel.get('smtp_host') || process.env.SMTP_HOST;
        const port = await SettingsModel.get('smtp_port') || process.env.SMTP_PORT;
        const user = await SettingsModel.get('smtp_user') || process.env.SMTP_USER;
        const pass = await SettingsModel.get('smtp_pass') || process.env.SMTP_PASS;
        const fromEmail = await SettingsModel.get('smtp_from') || user;
        const siteName = await SettingsModel.get('site_name') || 'AssetSale';

        if (!host || !user || !pass) {
            console.warn('SMTP settings incomplete, skipping email.');
            return;
        }

        const transporter = nodemailer.createTransport({
            host: host,
            port: port,
            secure: port === '465', // true for 465, false for other ports
            auth: {
                user: user,
                pass: pass,
            },
        });

        const info = await transporter.sendMail({
            from: `"${siteName}" <${fromEmail}>`, // sender address
            to: to,
            subject: subject,
            text: text,
            html: html,
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        // Don't throw to avoid breaking the request flow, just log
    }
};

module.exports = sendEmail;
