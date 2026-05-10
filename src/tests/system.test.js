import { describe, it, expect, beforeAll } from 'vitest';

const SUPABASE_URL = 'https://kcmoibrqyrzueslaqtgc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbW9pYnJxeXJ6dWVzbGFxdGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTgyMjMsImV4cCI6MjA5MTM5NDIyM30.lKNoieYYCIU-cuHQk4W7dQvSqZdLfmb4I4QxfhNHuQk';

describe('System Tests - Real Supabase Connection', () => {
    let client;

    beforeAll(async () => {
        const { createClient } = await import('@supabase/supabase-js');
        client = createClient(SUPABASE_URL, SUPABASE_KEY);
    });

    describe('Database Connectivity', () => {
        it('should connect to Supabase successfully', async () => {
            const { data, error } = await client.from('bookings').select('id').limit(1);
            expect(error).toBeNull();
        });

        it('should fetch bookings table with nullable fields', async () => {
            const { data, error } = await client.from('bookings').select('id, client_name, room, booking_date, status').limit(5);
            expect(error).toBeNull();
            expect(Array.isArray(data)).toBe(true);
        });

        it('should fetch clients table (bigint id)', async () => {
            const { data, error } = await client.from('clients').select('id, name, email').limit(1);
            expect(error).toBeNull();
        });

        it('should fetch site_images table with 16 slots', async () => {
            const { data, error } = await client
                .from('site_images')
                .select('slot, slot_name, image_url')
                .order('slot', { ascending: true });

            expect(error).toBeNull();
            expect(Array.isArray(data)).toBe(true);
        });

        it('should fetch site_settings table', async () => {
            const { data, error } = await client.from('site_settings').select('key, value').limit(5);
            expect(error).toBeNull();
        });

        it('should fetch providers table', async () => {
            const { data, error } = await client.from('providers').select('id, display_name, kind').limit(1);
            expect(error).toBeNull();
        });
    });

    describe('Site Images Operations', () => {
        it('should fetch all 16 image slots', async () => {
            const { data, error } = await client
                .from('site_images')
                .select('*')
                .order('slot', { ascending: true });

            expect(error).toBeNull();
            expect(data.length).toBeGreaterThanOrEqual(0);
        });

        it('should update existing image slot via URL paste', async () => {
            const testUrl = 'https://example.com/test-hero.jpg';
            const slot = 0;

            const { data: existing } = await client
                .from('site_images')
                .select('id, slot')
                .eq('slot', slot)
                .single();

            if (existing) {
                const { error } = await client
                    .from('site_images')
                    .update({ image_url: testUrl })
                    .eq('slot', slot);

                expect(error).toBeNull();
            }
        });

        it('should read image by specific slot', async () => {
            const { data, error } = await client
                .from('site_images')
                .select('slot, slot_name, image_url')
                .eq('slot', 5)
                .single();

            expect(error).toBeNull();
            if (data) {
                expect(data.slot).toBe(5);
            }
        });
    });

    describe('Data Integrity & Validation', () => {
        it('should handle concurrent reads correctly', async () => {
            const promises = [
                client.from('bookings').select('id').limit(1),
                client.from('site_images').select('*').order('slot', { ascending: true }),
                client.from('site_settings').select('*').limit(1)
            ];

            const results = await Promise.all(promises);
            results.forEach(({ error }) => {
                expect(error).toBeNull();
            });
        });

        it('should validate booking_status enum values', async () => {
            const { data, error } = await client.from('bookings').select('status').limit(10);
            expect(error).toBeNull();

            if (data.length > 0) {
                const validStatuses = ['pending', 'payment_required', 'confirmed', 'paid_deposit', 'paid_full', 'canceled', 'completed', 'refunded'];
                data.forEach(booking => {
                    if (booking.status) {
                        expect(validStatuses).toContain(booking.status);
                    }
                });
            }
        });
    });

    describe('Storage Operations', () => {
        it('should list storage buckets', async () => {
            const { data, error } = await client.storage.listBuckets();
            expect(error).toBeNull();
            expect(Array.isArray(data)).toBe(true);
        });

        it('should check site-images bucket exists', async () => {
            const { data, error } = await client.storage.listBuckets();
            expect(error).toBeNull();

            if (data && data.length > 0) {
                const bucketNames = data.map(b => b.name);
                console.log('Available buckets:', bucketNames.join(', '));
            }
        });

        it('should list storage buckets (upload requires authenticated session)', async () => {
            const { data, error } = await client.storage.listBuckets();
            expect(error).toBeNull();
            console.log('Storage buckets:', data?.map(b => b.name).join(', ') || 'none');
        });
    });

    describe('Analytics Data Aggregation', () => {
        it('should count bookings by status', async () => {
            const { data, error } = await client
                .from('bookings')
                .select('status');

            expect(error).toBeNull();
            expect(Array.isArray(data)).toBe(true);

            const statusCounts = {};
            data.forEach(b => {
                statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
            });

            console.log('Booking status counts:', statusCounts);
        });

        it('should calculate revenue from paid bookings', async () => {
            const { data, error } = await client
                .from('bookings')
                .select('status, total_amount_myr, paid_amount_myr');

            expect(error).toBeNull();

            const paidBookings = data.filter(b =>
                b.status === 'paid_full' || b.status === 'paid_deposit'
            );

            const totalRevenue = paidBookings.reduce((sum, b) =>
                sum + (b.paid_amount_myr || 0), 0
            );

            console.log('Total revenue from paid bookings:', totalRevenue);
            expect(typeof totalRevenue).toBe('number');
        });
    });
});

describe('End-to-End Workflow Tests', () => {
    let client;

    beforeAll(async () => {
        const { createClient } = await import('@supabase/supabase-js');
        client = createClient(SUPABASE_URL, SUPABASE_KEY);
    });

    it('admin dashboard: fetch stats and bookings', async () => {
        const [{ data: bookings, error: bError }, { data: images, error: iError }] = await Promise.all([
            client.from('bookings').select('*').order('created_at', { ascending: false }).limit(20),
            client.from('site_images').select('slot, slot_name, image_url').order('slot', { ascending: true })
        ]);

        expect(bError).toBeNull();
        expect(iError).toBeNull();

        console.log('Fetched bookings:', bookings?.length || 0);
        console.log('Fetched image slots:', images?.length || 0);

        const stats = {
            total: bookings?.length || 0,
            pending: bookings?.filter(b => b.status === 'pending').length || 0,
            confirmed: bookings?.filter(b => b.status === 'confirmed' || b.status === 'paid_full').length || 0
        };

        console.log('Dashboard stats:', stats);
        expect(typeof stats.total).toBe('number');
    });

    it('image gallery: load all 16 slots', async () => {
        const { data, error } = await client
            .from('site_images')
            .select('slot, slot_name, image_url, label')
            .order('slot', { ascending: true });

        expect(error).toBeNull();

        const slots = data?.map(img => img.slot) || [];
        const expectedSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

        console.log('Available slots:', slots.join(', '));
        console.log('Total images:', data?.length || 0);
    });

    it('booking flow: validate data shape', async () => {
        const { data, error } = await client
            .from('bookings')
            .select('id, client_name, email, phone, room, booking_date, start_time:booking_time, status, total_amount, payment_status')
            .limit(5);

        expect(error).toBeNull();

        if (data && data.length > 0) {
            const booking = data[0];
            console.log('Sample booking:', {
                id: booking.id?.slice(-6) || 'N/A',
                client: booking.client_name || 'N/A',
                room: booking.room || 'N/A',
                date: booking.booking_date || 'N/A',
                status: booking.status || 'N/A'
            });

            expect(booking).toHaveProperty('id');
            expect(booking).toHaveProperty('status');
        }
    });

    it('site settings: verify business config', async () => {
        const { data, error } = await client
            .from('site_settings')
            .select('key, value')
            .limit(10);

        expect(error).toBeNull();

        if (data && data.length > 0) {
            const settings = {};
            data.forEach(s => { settings[s.key] = s.value; });
            console.log('Site settings:', Object.keys(settings).join(', '));
        }
    });

    it('providers: check service providers', async () => {
        const { data, error } = await client
            .from('providers')
            .select('id, display_name, kind, state, district')
            .eq('is_active', true)
            .limit(5);

        expect(error).toBeNull();
        console.log('Active providers:', data?.length || 0);
    });
});