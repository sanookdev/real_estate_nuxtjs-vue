// Mock Ads Data for Demo Mode
export const mockAds = [
    {
        id: 1,
        position: 'banner-top',
        image: 'demo/ad_banner.jpg',
        link: 'https://example.com/promo1',
        active: true
    },
    {
        id: 2,
        position: 'bento-1',
        image: 'demo/ad_bento1.jpg',
        link: 'https://example.com/promo2',
        active: true
    },
    {
        id: 3,
        position: 'bento-2',
        image: 'demo/ad_bento2.jpg',
        link: 'https://example.com/promo3',
        active: true
    },
    {
        id: 4,
        position: 'bento-3',
        image: 'demo/ad_bento3.jpg',
        link: 'https://example.com/promo4',
        active: true
    },
    {
        id: 5,
        position: 'bento-4',
        image: 'demo/ad_bento4.jpg',
        link: 'https://example.com/promo5',
        active: true
    }
]

// Helper to get active ads
export const getActiveAds = () => mockAds.filter(ad => ad.active)

// Helper to get ads by position
export const getAdByPosition = (position) => mockAds.find(ad => ad.position === position && ad.active)

// Helper to get ads organized by position
export const getAdsObject = () => {
    const activeAds = getActiveAds()
    return {
        banner_top: activeAds.find(a => a.position === 'banner-top'),
        bento_1: activeAds.find(a => a.position === 'bento-1'),
        bento_2: activeAds.find(a => a.position === 'bento-2'),
        bento_3: activeAds.find(a => a.position === 'bento-3'),
        bento_4: activeAds.find(a => a.position === 'bento-4')
    }
}
