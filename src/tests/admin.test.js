import { describe, it, expect } from 'vitest';
import { validateAdminLogin } from './utils.js';

describe('Admin Authentication', () => {
    describe('validateAdminLogin', () => {
        it('should return true for valid admin credentials', () => {
            expect(validateAdminLogin('admin@leish.my', 'leish788')).toBe(true);
            expect(validateAdminLogin('dash@leish.my', 'leish788')).toBe(true);
        });

        it('should return false for invalid email', () => {
            expect(validateAdminLogin('wrong@email.com', 'leish788')).toBe(false);
            expect(validateAdminLogin('', 'leish788')).toBe(false);
            expect(validateAdminLogin('admin@other.com', 'leish788')).toBe(false);
        });

        it('should return false for invalid password', () => {
            expect(validateAdminLogin('admin@leish.my', 'wrongpass')).toBe(false);
            expect(validateAdminLogin('dash@leish.my', '')).toBe(false);
            expect(validateAdminLogin('admin@leish.my', 'Leish788')).toBe(false);
        });

        it('should return false for both email and password wrong', () => {
            expect(validateAdminLogin('wrong@email.com', 'wrongpass')).toBe(false);
        });
    });
});