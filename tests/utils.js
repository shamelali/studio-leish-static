// Utility functions extracted for testing
// These mirror the logic in admin.html

const VALID_ADMINS = ['admin@leish.my', 'dash@leish.my'];
const VALID_PASS = 'leish788';

function validateAdminLogin(email, password) {
    return VALID_ADMINS.includes(email) && password === VALID_PASS;
}

function filterBookingsBySearch(bookings, searchTerm, statusFilter, paymentFilter) {
    return bookings.filter(b => {
        const matchSearch = !searchTerm || 
            (b.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.client_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (b.id || '').includes(searchTerm);
        const matchStatus = !statusFilter || b.status === statusFilter;
        const matchPayment = !paymentFilter || b.payment_status === paymentFilter;
        return matchSearch && matchStatus && matchPayment;
    });
}

function calculateStats(bookings) {
    return {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        revenue: bookings.filter(b => b.payment_status === 'paid')
            .reduce((sum, b) => sum + (b.total_amount || 0), 0)
    };
}

function formatBookingDate(dateStr) {
    if (!dateStr) return '-';
    return dateStr;
}

function generateAccessCode(bookingId) {
    if (!bookingId) return '------';
    return bookingId.slice(-6).toUpperCase();
}

function isToday(dateStr) {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
}

function isSameMonth(date, year, month) {
    return date.getFullYear() === year && date.getMonth() === month;
}

// Export for testing
export {
    validateAdminLogin,
    filterBookingsBySearch,
    calculateStats,
    formatBookingDate,
    generateAccessCode,
    isToday,
    isSameMonth
};