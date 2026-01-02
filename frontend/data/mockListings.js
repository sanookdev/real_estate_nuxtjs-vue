// Mock Listings Data for Demo Mode
export const mockListings = [
    {
        id: 1,
        title: 'คอนโด Luxury ใกล้ BTS อโศก',
        type: 'Condo',
        price: 5500000,
        province: 'กรุงเทพมหานคร',
        district: 'วัฒนา',
        subdistrict: 'คลองเตยเหนือ',
        address: 'ซอยสุขุมวิท 21',
        description: 'คอนโดหรูใจกลางเมือง ใกล้ BTS อโศก เพียง 200 เมตร พร้อมสิ่งอำนวยความสะดวกครบครัน สระว่ายน้ำ ฟิตเนส ห้องซาวน่า รปภ. 24 ชม. วิวเมืองสวยงาม ตกแต่งพร้อมอยู่',
        bedrooms: 2,
        bathrooms: 2,
        area: 65,
        area_unit: 'ตร.ม.',
        images: ['demo/condo1.jpg', 'demo/condo2.jpg'],
        status: 'active',
        property_condition: 'new',
        is_pinned: true,
        user_id: 1,
        username: 'DemoUser',
        created_at: '2026-01-01T10:00:00Z',
        updated_at: '2026-01-01T10:00:00Z'
    },
    {
        id: 2,
        title: 'บ้านเดี่ยว 2 ชั้น โครงการหรู รังสิต',
        type: 'House',
        price: 8900000,
        province: 'ปทุมธานี',
        district: 'ธัญบุรี',
        subdistrict: 'ประชาธิปัตย์',
        address: 'หมู่บ้านพฤกษา',
        description: 'บ้านเดี่ยว 2 ชั้น สไตล์โมเดิร์น พื้นที่ใช้สอยกว้างขวาง 4 ห้องนอน 3 ห้องน้ำ ที่จอดรถ 2 คัน สวนหน้าบ้าน ครัวไทย ใกล้ Future Park รังสิต',
        bedrooms: 4,
        bathrooms: 3,
        area: 180,
        area_unit: 'ตร.ว.',
        images: ['demo/house1.jpg', 'demo/house2.jpg'],
        status: 'active',
        property_condition: 'secondhand',
        is_pinned: true,
        user_id: 1,
        username: 'DemoUser',
        created_at: '2025-12-28T14:30:00Z',
        updated_at: '2025-12-28T14:30:00Z'
    },
    {
        id: 3,
        title: 'ที่ดินเปล่า ติดถนนใหญ่ ชลบุรี',
        type: 'Land',
        price: 15000000,
        province: 'ชลบุรี',
        district: 'บางละมุง',
        subdistrict: 'หนองปรือ',
        address: 'ถนนสุขุมวิท',
        description: 'ที่ดินเปล่า ทำเลทอง ติดถนนสุขุมวิท หน้ากว้าง 40 เมตร เหมาะสำหรับทำธุรกิจ โรงแรม รีสอร์ท หรือหมู่บ้านจัดสรร',
        bedrooms: 0,
        bathrooms: 0,
        area: 5,
        area_unit: 'ไร่',
        images: ['demo/land1.jpg'],
        status: 'active',
        property_condition: 'new',
        is_pinned: false,
        user_id: 2,
        username: 'PropertyPro',
        created_at: '2025-12-25T09:00:00Z',
        updated_at: '2025-12-25T09:00:00Z'
    },
    {
        id: 4,
        title: 'อาคารพาณิชย์ 4 ชั้น ย่านสีลม',
        type: 'Commercial',
        price: 35000000,
        province: 'กรุงเทพมหานคร',
        district: 'บางรัก',
        subdistrict: 'สีลม',
        address: 'ถนนสีลม',
        description: 'อาคารพาณิชย์ 4 ชั้น ทำเลเยี่ยม ย่านธุรกิจสีลม เหมาะทำออฟฟิศ ร้านค้า หรือให้เช่า ใกล้ BTS ศาลาแดง และ MRT สีลม',
        bedrooms: 0,
        bathrooms: 4,
        area: 320,
        area_unit: 'ตร.ม.',
        images: ['demo/commercial1.jpg'],
        status: 'active',
        property_condition: 'secondhand',
        is_pinned: true,
        user_id: 2,
        username: 'PropertyPro',
        created_at: '2025-12-20T11:00:00Z',
        updated_at: '2025-12-20T11:00:00Z'
    },
    {
        id: 5,
        title: 'คอนโด วิวทะเล พัทยา',
        type: 'Condo',
        price: 3200000,
        province: 'ชลบุรี',
        district: 'บางละมุง',
        subdistrict: 'นาเกลือ',
        address: 'ถนนพัทยา-นาเกลือ',
        description: 'คอนโดวิวทะเลสวยงาม หาดพัทยา ห้องกว้าง ตกแต่งสไตล์รีสอร์ท พร้อมเฟอร์นิเจอร์ครบ สระว่ายน้ำ infinity pool',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        area_unit: 'ตร.ม.',
        images: ['demo/condo3.jpg'],
        status: 'active',
        property_condition: 'new',
        is_pinned: false,
        user_id: 1,
        username: 'DemoUser',
        created_at: '2025-12-18T16:00:00Z',
        updated_at: '2025-12-18T16:00:00Z'
    },
    {
        id: 6,
        title: 'บ้านเดี่ยว สไตล์นอร์ดิก เชียงใหม่',
        type: 'House',
        price: 6500000,
        province: 'เชียงใหม่',
        district: 'เมืองเชียงใหม่',
        subdistrict: 'สุเทพ',
        address: 'ซอยสุเทพ',
        description: 'บ้านเดี่ยวสไตล์นอร์ดิก บรรยากาศร่มรื่น ใกล้ดอยสุเทพ อากาศเย็นสบายตลอดปี 3 ห้องนอน 2 ห้องน้ำ สวนสวย',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        area_unit: 'ตร.ว.',
        images: ['demo/house3.jpg'],
        status: 'active',
        property_condition: 'new',
        is_pinned: true,
        user_id: 3,
        username: 'ChiangmaiHome',
        created_at: '2025-12-15T08:00:00Z',
        updated_at: '2025-12-15T08:00:00Z'
    },
    {
        id: 7,
        title: 'คอนโด ใกล้สถานี MRT ลาดพร้าว',
        type: 'Condo',
        price: 2800000,
        province: 'กรุงเทพมหานคร',
        district: 'จตุจักร',
        subdistrict: 'ลาดยาว',
        address: 'ถนนพหลโยธิน',
        description: 'คอนโดทำเลดี ใกล้ MRT ลาดพร้าว และ Central ลาดพร้าว เดินทางสะดวก ห้องมุม วิวสวย',
        bedrooms: 1,
        bathrooms: 1,
        area: 35,
        area_unit: 'ตร.ม.',
        images: ['demo/condo4.jpg'],
        status: 'active',
        property_condition: 'secondhand',
        is_pinned: false,
        user_id: 1,
        username: 'DemoUser',
        created_at: '2025-12-10T12:00:00Z',
        updated_at: '2025-12-10T12:00:00Z'
    },
    {
        id: 8,
        title: 'ที่ดินสวยงาม ภูเก็ต ใกล้หาด',
        type: 'Land',
        price: 25000000,
        province: 'ภูเก็ต',
        district: 'ถลาง',
        subdistrict: 'เชิงทะเล',
        address: 'ถนนศรีสุนทร',
        description: 'ที่ดินทำเลทอง ใกล้หาดบางเทา เพียง 500 เมตร เหมาะสร้าง Pool Villa หรือรีสอร์ท บรรยากาศดี',
        bedrooms: 0,
        bathrooms: 0,
        area: 2,
        area_unit: 'ไร่',
        images: ['demo/land2.jpg'],
        status: 'active',
        property_condition: 'new',
        is_pinned: false,
        user_id: 2,
        username: 'PropertyPro',
        created_at: '2025-12-05T10:00:00Z',
        updated_at: '2025-12-05T10:00:00Z'
    }
]

// Helper to get pinned listings
export const getPinnedListings = () => mockListings.filter(l => l.is_pinned)

// Helper to get listing by ID
export const getListingById = (id) => mockListings.find(l => l.id === parseInt(id))

// Helper to filter listings
export const filterListings = ({ type, province, priceRange }) => {
    return mockListings.filter(listing => {
        if (type && listing.type !== type) return false
        if (province && listing.province !== province) return false
        if (priceRange) {
            const price = listing.price
            switch (priceRange) {
                case 'under_1m': if (price >= 1000000) return false; break
                case '1m_3m': if (price < 1000000 || price > 3000000) return false; break
                case '3m_5m': if (price < 3000000 || price > 5000000) return false; break
                case '5m_10m': if (price < 5000000 || price > 10000000) return false; break
                case 'above_10m': if (price <= 10000000) return false; break
            }
        }
        return true
    })
}
