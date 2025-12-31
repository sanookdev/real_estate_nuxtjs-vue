// Cache the data to avoid redundant requests
let cachedData = null;

// Fetch data from local static file (client-side only)
export const fetchAddressData = async () => {
    // Only run on client side
    if (typeof window === 'undefined') {
        return [];
    }

    if (cachedData) return cachedData;

    try {
        // Using native fetch for better SSR compatibility
        const response = await fetch('/data/thai_address.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        cachedData = await response.json();
        return cachedData;
    } catch (error) {
        console.error('Failed to fetch address data:', error);
        return [];
    }
};

export const getProvinces = async () => {
    const data = await fetchAddressData();
    if (!data || data.length === 0) return [];
    // Sort provinces alphabetically
    return data.map(p => p.name_th).sort((a, b) => a.localeCompare(b, 'th'));
};

export const getDistricts = async (provinceName) => {
    const data = await fetchAddressData();
    if (!data || data.length === 0) return [];

    const province = data.find(p => p.name_th === provinceName);
    if (!province) return [];

    // Return district names
    return province.districts.map(a => a.name_th).sort((a, b) => a.localeCompare(b, 'th'));
};

export const getSubdistricts = async (provinceName, districtName) => {
    const data = await fetchAddressData();
    if (!data || data.length === 0) return [];

    const province = data.find(p => p.name_th === provinceName);
    if (!province) return [];

    const district = province.districts.find(a => a.name_th === districtName);
    if (!district) return [];

    // Return sub_district names
    return district.sub_districts.map(t => t.name_th).sort((a, b) => a.localeCompare(b, 'th'));
};

export const getPostalCode = async (provinceName, districtName, subdistrictName) => {
    const data = await fetchAddressData();
    if (!data || data.length === 0) return '';

    const province = data.find(p => p.name_th === provinceName);
    if (!province) return '';

    const district = province.districts.find(a => a.name_th === districtName);
    if (!district) return '';

    const subdistrict = district.sub_districts.find(t => t.name_th === subdistrictName);
    return subdistrict ? subdistrict.zip_code.toString() : '';
};

