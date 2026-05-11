import { describe, it, expect } from 'vitest';
import { generateAccessCode, formatBookingDate, isToday } from './utils.js';

describe('Booking Functionality', () => {
    describe('generateAccessCode', () => {
        it('should generate 6-character code from booking ID', () => {
            expect(generateAccessCode('abc123456789')).toBe('456789');
        });

        it('should handle short IDs by returning available characters', () => {
            expect(generateAccessCode('abc')).toBe('ABC');
        });

        it('should return ------ for empty ID', () => {
            expect(generateAccessCode('')).toBe('------');
            expect(generateAccessCode(null)).toBe('------');
            expect(generateAccessCode(undefined)).toBe('------');
        });

        it('should convert to uppercase', () => {
            expect(generateAccessCode('abc123def')).toBe('123DEF');
        });
    });

    describe('formatBookingDate', () => {
        it('should return date string as-is', () => {
            expect(formatBookingDate('2026-05-10')).toBe('2026-05-10');
        });

        it('should return - for empty date', () => {
            expect(formatBookingDate('')).toBe('-');
            expect(formatBookingDate(null)).toBe('-');
            expect(formatBookingDate(undefined)).toBe('-');
        });
    });

    describe('isToday', () => {
        it('should return true for today\'s date', () => {
            const today = new Date().toISOString().split('T')[0];
            expect(isToday(today)).toBe(true);
        });

        it('should return false for other dates', () => {
            expect(isToday('2025-01-01')).toBe(false);
            expect(isToday('2027-12-31')).toBe(false);
        });
    });
});

describe('Calendar Logic', () => {
    const mockBookings = [
        { id: '1', booking_date: '2026-05-10', status: 'confirmed' },
        { id: '2', booking_date: '2026-05-10', status: 'pending' },
        { id: '3', booking_date: '2026-05-11', status: 'confirmed' }
    ];

    it('should count bookings for a specific date', () => {
        const countForDate = (date) => mockBookings.filter(b => 
            b.booking_date === date && b.status !== 'cancelled'
        ).length;
        
        expect(countForDate('2026-05-10')).toBe(2);
        expect(countForDate('2026-05-11')).toBe(1);
        expect(countForDate('2026-05-12')).toBe(0);
    });

    it('should filter out cancelled bookings', () => {
        const cancelledBookings = [...mockBookings, { id: '4', booking_date: '2026-05-10', status: 'cancelled' }];
        const activeBookings = cancelledBookings.filter(b => b.status !== 'cancelled');
        
        expect(activeBookings).toHaveLength(3);
        expect(activeBookings.find(b => b.id === '4')).toBeUndefined();
    });
});