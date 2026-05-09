import { describe, it, expect } from 'vitest';
import { filterBookingsBySearch, calculateStats } from './utils.js';

describe('Supabase Data Operations', () => {
    const mockBookings = [
        { id: 'abc123', client_name: 'John Doe', client_email: 'john@test.com', status: 'pending', payment_status: 'pending', total_amount: 80, room: 'Makeup Studio', booking_date: '2026-05-10' },
        { id: 'def456', client_name: 'Jane Smith', client_email: 'jane@test.com', status: 'confirmed', payment_status: 'paid', total_amount: 120, room: 'Content Creation Room', booking_date: '2026-05-11' },
        { id: 'ghi789', client_name: 'Bob Wilson', client_email: 'bob@test.com', status: 'cancelled', payment_status: 'pending', total_amount: 60, room: 'Classroom', booking_date: '2026-05-12' },
        { id: 'jkl012', client_name: 'Alice Chen', client_email: 'alice@test.com', status: 'pending', payment_status: 'paid', total_amount: 100, room: 'Makeup Studio', booking_date: '2026-05-13' }
    ];

    describe('filterBookingsBySearch', () => {
        it('should return all bookings when no filters applied', () => {
            const result = filterBookingsBySearch(mockBookings, '', '', '');
            expect(result).toHaveLength(4);
        });

        it('should filter by search term (client name)', () => {
            const result = filterBookingsBySearch(mockBookings, 'john', '', '');
            expect(result).toHaveLength(1);
            expect(result[0].client_name).toBe('John Doe');
        });

        it('should filter by search term (client email)', () => {
            const result = filterBookingsBySearch(mockBookings, 'jane@test.com', '', '');
            expect(result).toHaveLength(1);
            expect(result[0].client_email).toBe('jane@test.com');
        });

        it('should filter by search term (booking ID)', () => {
            const result = filterBookingsBySearch(mockBookings, 'abc123', '', '');
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('abc123');
        });

        it('should filter by status', () => {
            const result = filterBookingsBySearch(mockBookings, '', 'pending', '');
            expect(result).toHaveLength(2);
            result.forEach(b => expect(b.status).toBe('pending'));
        });

        it('should filter by payment status', () => {
            const result = filterBookingsBySearch(mockBookings, '', '', 'paid');
            expect(result).toHaveLength(2);
            result.forEach(b => expect(b.payment_status).toBe('paid'));
        });

        it('should combine multiple filters', () => {
            const result = filterBookingsBySearch(mockBookings, '', 'pending', 'paid');
            expect(result).toHaveLength(1);
            expect(result[0].client_name).toBe('Alice Chen');
        });

        it('should return empty array when no matches', () => {
            const result = filterBookingsBySearch(mockBookings, 'nonexistent', '', '');
            expect(result).toHaveLength(0);
        });
    });

    describe('calculateStats', () => {
        it('should calculate total bookings count', () => {
            const stats = calculateStats(mockBookings);
            expect(stats.total).toBe(4);
        });

        it('should count pending bookings', () => {
            const stats = calculateStats(mockBookings);
            expect(stats.pending).toBe(2);
        });

        it('should count confirmed bookings', () => {
            const stats = calculateStats(mockBookings);
            expect(stats.confirmed).toBe(1);
        });

        it('should calculate total revenue from paid bookings', () => {
            const stats = calculateStats(mockBookings);
            expect(stats.revenue).toBe(220); // 120 + 100
        });

        it('should handle empty bookings array', () => {
            const stats = calculateStats([]);
            expect(stats.total).toBe(0);
            expect(stats.pending).toBe(0);
            expect(stats.confirmed).toBe(0);
            expect(stats.revenue).toBe(0);
        });

        it('should handle bookings with missing total_amount', () => {
            const bookingsWithMissing = [
                { status: 'confirmed', payment_status: 'paid' },
                { status: 'pending', payment_status: 'paid', total_amount: 50 }
            ];
            const stats = calculateStats(bookingsWithMissing);
            expect(stats.revenue).toBe(50);
        });
    });
});