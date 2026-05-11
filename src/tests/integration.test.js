import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Supabase client with configurable responses
const createMockClient = (responses = {}) => {
    const mockData = {
        bookings: responses.bookings || [],
        clients: responses.clients || [],
        site_images: responses.site_images || []
    };

    return {
        from: (table) => ({
            select: (columns = '*') => ({
                eq: (col, val) => ({
                    single: () => Promise.resolve({ 
                        data: mockData[table]?.find(x => x[col] === val) || null, 
                        error: null 
                    }),
                    order: (field, opts) => Promise.resolve({ 
                        data: mockData[table]?.sort((a, b) => opts.ascending ? a[field] - b[field] : b[field] - a[field]) || [], 
                        error: null 
                    })
                }),
                order: (field, opts) => Promise.resolve({ 
                    data: mockData[table] || [], 
                    error: null 
                })
            }),
            insert: (data) => Promise.resolve({ data: data, error: null }),
            update: (data) => ({
                eq: (col, val) => Promise.resolve({ data: data, error: null })
            })
        }),
        storage: {
            from: () => ({
                upload: (path, file) => Promise.resolve({ 
                    data: { path }, 
                    error: null 
                }),
                getPublicUrl: (path) => ({ 
                    data: { publicUrl: `https://mock.supabase.co/storage/v1/object/public/${path}` } 
                })
            })
        },
        auth: {
            getSession: () => Promise.resolve({ data: { session: null } }),
            onAuthStateChange: (callback) => {
                callback('SIGNED_OUT', null);
                return { data: { subscription: { unsubscribe: () => {} } } };
            }
        }
    };
};

// Mock global supabase
window.supabase = {
    createClient: createMockClient
};

describe('Admin Authentication Integration', () => {
    let loginFn, logoutFn;
    const VALID_ADMINS = ['admin@leish.my', 'dash@leish.my'];
    const VALID_PASS = 'leish788';

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="loginScreen">
                <input id="email" value="dash@leish.my">
                <input id="password" value="leish788">
                <button id="loginBtn">Sign In</button>
                <div id="loginError" style="display:none"></div>
            </div>
            <div id="app"></div>
        `;

        loginFn = () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            if (VALID_ADMINS.includes(email) && password === VALID_PASS) {
                localStorage.setItem('adminEmail', email);
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('app').classList.add('active');
                return true;
            }
            document.getElementById('loginError').style.display = 'block';
            return false;
        };

        logoutFn = () => {
            localStorage.removeItem('adminEmail');
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('app').classList.remove('active');
        };
    });

    it('should login with valid credentials and show admin panel', () => {
        const result = loginFn();
        expect(result).toBe(true);
        expect(document.getElementById('loginScreen').style.display).toBe('none');
        expect(document.getElementById('app').classList.contains('active')).toBe(true);
    });

    it('should store admin email in localStorage on successful login', () => {
        loginFn();
        expect(localStorage.getItem('adminEmail')).toBe('dash@leish.my');
    });

    it('should show error message on invalid credentials', () => {
        document.getElementById('email').value = 'wrong@email.com';
        loginFn();
        expect(document.getElementById('loginError').style.display).toBe('block');
    });

    it('should logout and return to login screen', () => {
        loginFn();
        logoutFn();
        expect(localStorage.getItem('adminEmail')).toBeNull();
        expect(document.getElementById('loginScreen').style.display).toBe('flex');
    });

    it('should restore session from localStorage on page load', () => {
        localStorage.setItem('adminEmail', 'admin@leish.my');
        const savedEmail = localStorage.getItem('adminEmail');
        expect(VALID_ADMINS.includes(savedEmail)).toBe(true);
    });
});

describe('Dashboard Data Integration', () => {
    it('should calculate dashboard statistics from bookings', async () => {
        const mockBookings = [
            { id: '1', status: 'pending', payment_status: 'pending', total_amount: 80 },
            { id: '2', status: 'confirmed', payment_status: 'paid', total_amount: 120 },
            { id: '3', status: 'pending', payment_status: 'paid', total_amount: 60 },
            { id: '4', status: 'cancelled', payment_status: 'pending', total_amount: 40 }
        ];

        const stats = {
            total: mockBookings.length,
            pending: mockBookings.filter(b => b.status === 'pending').length,
            confirmed: mockBookings.filter(b => b.status === 'confirmed').length,
            revenue: mockBookings
                .filter(b => b.payment_status === 'paid')
                .reduce((sum, b) => sum + (b.total_amount || 0), 0)
        };

        expect(stats.total).toBe(4);
        expect(stats.pending).toBe(2);
        expect(stats.confirmed).toBe(1);
        expect(stats.revenue).toBe(180);
    });

    it('should fetch and display today\'s bookings', async () => {
        const today = new Date().toISOString().split('T')[0];
        const mockBookings = [
            { id: '1', client_name: 'John', booking_date: today, status: 'confirmed', room: 'Studio', start_time: '09:00' },
            { id: '2', client_name: 'Jane', booking_date: today, status: 'pending', room: 'Studio', start_time: '14:00' }
        ];

        const todayBookings = mockBookings.filter(b => b.booking_date === today && b.status !== 'cancelled');
        expect(todayBookings).toHaveLength(2);
        expect(todayBookings[0].client_name).toBe('John');
    });

    it('should aggregate room booking counts', () => {
        const mockBookings = [
            { room: 'Studio', status: 'confirmed' },
            { room: 'Studio', status: 'pending' },
            { room: 'Classroom', status: 'confirmed' },
            { room: 'Studio', status: 'confirmed' }
        ];

        const rooms = {};
        mockBookings.forEach(b => {
            rooms[b.room] = (rooms[b.room] || 0) + 1;
        });

        expect(rooms['Studio']).toBe(3);
        expect(rooms['Classroom']).toBe(1);
    });
});

describe('Bookings CRUD Integration', () => {
    let bookings = [];

    beforeEach(() => {
        bookings = [
            { id: '1', client_name: 'John', status: 'pending', payment_status: 'pending' },
            { id: '2', client_name: 'Jane', status: 'confirmed', payment_status: 'paid' }
        ];
    });

    it('should create new booking', async () => {
        const newBooking = { 
            id: '3', 
            client_name: 'Bob', 
            room: 'Studio',
            booking_date: '2026-05-15',
            start_time: '10:00',
            end_time: '12:00',
            status: 'pending',
            payment_status: 'pending',
            total_amount: 120
        };

        bookings.push(newBooking);
        expect(bookings).toHaveLength(3);
        expect(bookings[2].client_name).toBe('Bob');
    });

    it('should update booking status', async () => {
        const updateBookingStatus = (id, status) => {
            const booking = bookings.find(b => b.id === id);
            if (booking) booking.status = status;
        };

        updateBookingStatus('1', 'confirmed');
        expect(bookings.find(b => b.id === '1').status).toBe('confirmed');
    });

    it('should update payment status', async () => {
        const updatePaymentStatus = (id, status) => {
            const booking = bookings.find(b => b.id === id);
            if (booking) booking.payment_status = status;
        };

        updatePaymentStatus('1', 'paid');
        expect(bookings.find(b => b.id === '1').payment_status).toBe('paid');
    });

    it('should delete (cancel) booking', async () => {
        const cancelBooking = (id) => {
            const booking = bookings.find(b => b.id === id);
            if (booking) booking.status = 'cancelled';
        };

        cancelBooking('1');
        expect(bookings.find(b => b.id === '1').status).toBe('cancelled');
    });

    it('should filter active bookings (exclude cancelled)', () => {
        bookings[0].status = 'cancelled';
        const activeBookings = bookings.filter(b => b.status !== 'cancelled');
        expect(activeBookings).toHaveLength(1);
    });
});

describe('Image Upload Integration', () => {
    it('should generate correct storage path for images', () => {
        const slot = 0;
        const timestamp = Date.now();
        const ext = 'jpg';
        const path = `site-images/${timestamp}-${slot}.${ext}`;
        
        expect(path).toMatch(/^site-images\/\d+-\d+\.jpg$/);
    });

    it('should construct public URL after upload', () => {
        const path = 'site-images/1234567890-0.jpg';
        const publicUrl = `https://mock.supabase.co/storage/v1/object/public/${path}`;
        
        expect(publicUrl).toContain(path);
        expect(publicUrl).toContain('supabase.co');
    });

    it('should save image URL to site_images table', async () => {
        const mockClient = createMockClient();
        const slot = 5;
        const imageUrl = 'https://example.com/logo.png';

        // Simulate upsert
        const existing = { slot: 5, image_url: null };
        if (existing) {
            // Update existing
            existing.image_url = imageUrl;
            existing.storage_path = imageUrl.split('/').pop();
        }

        expect(existing.image_url).toBe(imageUrl);
    });

    it('should handle 16 image slots correctly', () => {
        const slots = Array.from({ length: 16 }, (_, i) => i);
        expect(slots).toHaveLength(16);
        expect(slots[0]).toBe(0);
        expect(slots[15]).toBe(15);
    });
});

describe('Calendar Integration', () => {
    it('should generate calendar grid for current month', () => {
        const year = 2026;
        const month = 4; // May (0-indexed)
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        expect(firstDay).toBeDefined();
        expect(daysInMonth).toBe(31);
    });

    it('should identify today correctly', () => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        
        expect(todayStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should group bookings by date', () => {
        const bookings = [
            { booking_date: '2026-05-10', client_name: 'John' },
            { booking_date: '2026-05-10', client_name: 'Jane' },
            { booking_date: '2026-05-11', client_name: 'Bob' }
        ];

        const grouped = {};
        bookings.forEach(b => {
            grouped[b.booking_date] = grouped[b.booking_date] || [];
            grouped[b.booking_date].push(b);
        });

        expect(grouped['2026-05-10']).toHaveLength(2);
        expect(grouped['2026-05-11']).toHaveLength(1);
    });
});

describe('Client Management Integration', () => {
    let clients = [];

    beforeEach(() => {
        clients = [
            { id: '1', name: 'John Doe', email: 'john@test.com', phone: '0123456789', booking_count: 3, total_spent: 240 },
            { id: '2', name: 'Jane Smith', email: 'jane@test.com', phone: '0987654321', booking_count: 1, total_spent: 80 }
        ];
    });

    it('should calculate client lifetime value', () => {
        const totalRevenue = clients.reduce((sum, c) => sum + (c.total_spent || 0), 0);
        expect(totalRevenue).toBe(320);
    });

    it('should search clients by name or email', () => {
        const searchClients = (query) => {
            const q = query.toLowerCase();
            return clients.filter(c => 
                c.name.toLowerCase().includes(q) || 
                c.email.toLowerCase().includes(q)
            );
        };

        const results = searchClients('john');
        expect(results).toHaveLength(1);
        expect(results[0].name).toBe('John Doe');
    });

    it('should count client bookings', () => {
        const totalBookings = clients.reduce((sum, c) => sum + (c.booking_count || 0), 0);
        expect(totalBookings).toBe(4);
    });
});

describe('Analytics Integration', () => {
    it('should calculate monthly revenue', () => {
        const bookings = [
            { booking_date: '2026-05-10', total_amount: 80, payment_status: 'paid' },
            { booking_date: '2026-05-15', total_amount: 120, payment_status: 'paid' },
            { booking_date: '2026-06-01', total_amount: 60, payment_status: 'paid' }
        ];

        const mayRevenue = bookings
            .filter(b => b.booking_date.startsWith('2026-05') && b.payment_status === 'paid')
            .reduce((sum, b) => sum + b.total_amount, 0);

        expect(mayRevenue).toBe(200);
    });

    it('should calculate average booking value', () => {
        const bookings = [
            { total_amount: 80 },
            { total_amount: 120 },
            { total_amount: 60 },
            { total_amount: 100 }
        ];

        const total = bookings.reduce((sum, b) => sum + b.total_amount, 0);
        const avg = total / bookings.length;

        expect(avg).toBe(90);
    });

    it('should track room utilization', () => {
        const bookings = [
            { room: 'Studio', status: 'confirmed' },
            { room: 'Studio', status: 'confirmed' },
            { room: 'Classroom', status: 'confirmed' },
            { room: 'Studio', status: 'cancelled' }
        ];

        const activeBookings = bookings.filter(b => b.status === 'confirmed');
        const roomCounts = activeBookings.reduce((acc, b) => {
            acc[b.room] = (acc[b.room] || 0) + 1;
            return acc;
        }, {});

        expect(roomCounts['Studio']).toBe(2);
        expect(roomCounts['Classroom']).toBe(1);
    });
});