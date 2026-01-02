// Mock Users Data for Demo Mode
export const mockUsers = [
    {
        id: 1,
        username: 'DemoUser',
        email: 'demo@example.com',
        role: 'user',
        status: 'active',
        created_at: '2025-01-01T00:00:00Z'
    },
    {
        id: 2,
        username: 'PropertyPro',
        email: 'property@example.com',
        role: 'user',
        status: 'active',
        created_at: '2025-01-15T00:00:00Z'
    },
    {
        id: 3,
        username: 'ChiangmaiHome',
        email: 'chiangmai@example.com',
        role: 'user',
        status: 'active',
        created_at: '2025-02-01T00:00:00Z'
    },
    {
        id: 99,
        username: 'Admin Demo',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z'
    }
]

// Demo credentials for login
export const demoCredentials = {
    email: 'demo@example.com',
    password: 'demo123'
}

// Helper to authenticate demo user
export const authenticateDemoUser = (email, password) => {
    if (email === demoCredentials.email && password === demoCredentials.password) {
        const user = mockUsers.find(u => u.email === email)
        return {
            success: true,
            user: user,
            token: 'demo-token-12345'
        }
    }
    return {
        success: false,
        message: 'Invalid credentials. Use demo@example.com / demo123'
    }
}

// Helper to get user by ID
export const getUserById = (id) => mockUsers.find(u => u.id === parseInt(id))
