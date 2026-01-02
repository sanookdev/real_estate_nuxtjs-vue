// Mock Settings Data for Demo Mode
export const mockSettings = {
    site_name: 'Real Estate Demo',
    site_logo: 'demo/logo.png',
    site_favicon: 'demo/favicon.png',
    site_description: 'แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ครบวงจร ที่ดิน บ้าน คอนโด อาคารพาณิชย์',
    contact_phone: '065 352 3666',
    contact_email: 'nuk.warat@gmail.com',
    contact_line: 'streetnuk',
    contact_facebook: '#',
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: ''
}

// Helper to get public settings (without sensitive data)
export const getPublicSettings = () => {
    const { smtp_host, smtp_port, smtp_user, smtp_pass, ...publicSettings } = mockSettings
    return publicSettings
}
