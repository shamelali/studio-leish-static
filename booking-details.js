// ── Room Details State ────────────────────────────────
// roomNumber: 'A' or 'B' for Makeup Station
// roomDetails: { classType, paxCount, refreshments, specialRequest } for Classroom
//              { usageType, eventType, eventPax, specialRequest } for Creative Studio

// ── Station Selection ────────────────────────────────
document.querySelectorAll('.station-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.station-btn').forEach(b => {
            b.style.borderColor = 'var(--border)';
            b.querySelector('div:nth-child(1)').style.color = 'var(--text-muted)';
            b.querySelector('div:nth-child(1)').textContent = '⚫';
        });
        this.style.borderColor = 'var(--success)';
        this.querySelector('div:nth-child(1)').style.color = 'var(--success)';
        this.querySelector('div:nth-child(1)').textContent = '🟢';
        booking.roomNumber = this.dataset.station;
    });
});

// ── Real-time Availability Check ────────────────────────────────
let availabilityCache = {};

async function checkStationAvailability() {
    if (!supabaseClient || !booking.room || booking.room.name !== 'Makeup Station') return;
    
    const { data, error } = await supabaseClient
        .from('bookings')
        .select('date, start_time, end_time, room_number')
        .eq('room', 'Makeup Station')
        .gte('date', new Date().toISOString().split('T')[0])
        .neq('status', 'cancelled');
    
    if (error) { console.warn('Availability check failed:', error); return; }
    
    availabilityCache = {};
    data.forEach(b => {
        if (!availabilityCache[b.date]) availabilityCache[b.date] = { 'A': true, 'B': true };
        if (b.room_number) availabilityCache[b.date][b.room_number] = false;
    });
    
    updateStationButtons();
}

function updateStationButtons() {
    const date = booking.date;
    if (!date || !availabilityCache[date]) {
        document.getElementById('station-a-status').textContent = 'Available';
        document.getElementById('station-a').style.borderColor = 'var(--success)';
        document.getElementById('station-b-status').textContent = 'Check availability above';
        document.getElementById('station-b').style.borderColor = 'var(--border)';
        return;
    }
    
    ['A', 'B'].forEach(station => {
        const isAvailable = availabilityCache[date][station];
        const btn = document.getElementById(`station-${station.toLowerCase()}`);
        const status = document.getElementById(`station-${station.toLowerCase()}-status`);
        
        if (isAvailable) {
            btn.style.borderColor = 'var(--success)';
            status.textContent = 'Available 🟢';
            status.style.color = 'var(--success)';
        } else {
            btn.style.borderColor = 'var(--accent)';
            status.textContent = 'Booked 🔴';
            status.style.color = 'var(--accent)';
        }
    });
}

// Subscribe to real-time changes
if (supabaseClient) {
    supabaseClient
        .channel('booking-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, 
            () => checkStationAvailability())
        .subscribe();
}

// ── Class Type Logic ────────────────────────────────
document.getElementById('class-type').addEventListener('change', function() {
    const paxGroup = document.getElementById('pax-group');
    paxGroup.style.display = this.value === 'group' ? 'block' : 'none';
    if (this.value === 'group') {
        const select = document.getElementById('class-pax');
        if (select.options.length <= 1) {
            for (let i = 2; i <= 15; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = i;
                select.appendChild(opt);
            }
        }
    }
});

// ── Usage Type Logic ────────────────────────────────
document.getElementById('usage-type').addEventListener('change', function() {
    const eventDetails = document.getElementById('event-details');
    eventDetails.style.display = (this.value === 'Small Event') ? 'block' : 'none';
    
    if (this.value === 'Small Event') {
        const select = document.getElementById('event-pax');
        if (select.options.length <= 1) {
            for (let i = 1; i <= 10; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.textContent = i;
                select.appendChild(opt);
            }
        }
    }
    
    // If Content Creation or Photoshoot, skip to Add-ons
    if (this.value === 'Content Creation' || this.value === 'Photoshoot') {
        booking.roomDetails = { usageType: this.value };
        setTimeout(() => goToStep(4), 100);
    }
});

// ── Word Count Logic ────────────────────────────────
function updateWordCount(elementId, maxWords, countId) {
    const text = document.getElementById(elementId).value;
    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const countEl = document.getElementById(countId);
    countEl.textContent = `${wordCount}/${maxWords} words`;
    countEl.style.color = wordCount > maxWords ? 'var(--accent)' : 'var(--text-muted)';
}

document.getElementById('class-refreshments').addEventListener('input', () => updateWordCount('class-refreshments', 120, 'refreshments-count'));
document.getElementById('class-special-request').addEventListener('input', () => updateWordCount('class-special-request', 1200, 'special-request-count'));
document.getElementById('creative-special-request').addEventListener('input', () => updateWordCount('creative-special-request', 150, 'creative-request-count'));

// ── Room Selection (Updated) ────────────────────────────────
document.querySelectorAll('.room-card').forEach(card => {
    card.addEventListener('click', function() {
        document.querySelectorAll('.room-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        booking.room = {
            name: this.querySelector('.room-name').textContent,
            pricePerHour: parseInt(this.dataset.price)
        };
        updateSummaryBar();
        
        // Show appropriate Step 2 details
        const roomName = booking.room.name;
        document.getElementById('makeup-station-details').style.display = 'none';
        document.getElementById('classroom-details').style.display = 'none';
        document.getElementById('creative-details').style.display = 'none';
        
        if (roomName === 'Makeup Station') {
            document.getElementById('makeup-station-details').style.display = 'block';
            document.getElementById('step2-subtitle').textContent = 'Select your station';
            checkStationAvailability();
        } else if (roomName === 'Classroom') {
            document.getElementById('classroom-details').style.display = 'block';
            document.getElementById('step2-subtitle').textContent = 'Tell us about your class';
        } else if (roomName === 'Creative Studio') {
            document.getElementById('creative-details').style.display = 'block';
            document.getElementById('step2-subtitle').textContent = 'How will you use this studio?';
        }
    });
});

// ── Step Navigation (Updated) ────────────────────────────────
function handleStep2Next() {
    const roomName = booking.room?.name;
    
    if (roomName === 'Makeup Station' && !booking.roomNumber) {
        alert('Please select a station (A or B)');
        return false;
    }
    
    if (roomName === 'Classroom') {
        const classType = document.getElementById('class-type').value;
        if (!classType) { alert('Please select class type'); return false; }
        
        booking.roomDetails = {
            classType,
            paxCount: classType === 'group' ? document.getElementById('class-pax').value : null,
            refreshments: document.getElementById('class-refreshments').value,
            specialRequest: document.getElementById('class-special-request').value
        };
    }
    
    if (roomName === 'Creative Studio') {
        const usageType = document.getElementById('usage-type').value;
        if (!usageType) { alert('Please select usage type'); return false; }
        
        if (usageType === 'Small Event') {
            booking.roomDetails = {
                usageType,
                eventType: document.getElementById('event-type').value,
                eventPax: document.getElementById('event-pax').value,
                specialRequest: document.getElementById('creative-special-request').value
            };
        } else {
            booking.roomDetails = { usageType };
            // Skip to Add-ons (Step 4)
            goToStep(4);
            return true;
        }
    }
    
    goToStep(3);
    return true;
}

// Update button event listeners
document.getElementById('step1-next').removeEventListener('click', handleNext);
document.getElementById('step1-next').addEventListener('click', () => {
    if (!validateStep(1)) return;
    goToStep(2);
});

document.getElementById('step2-next').addEventListener('click', () => {
    if (!validateStep(2)) return;
    handleStep2Next();
});

// ── Validate Step 2 ────────────────────────────────
function validateStep2() {
    const roomName = booking.room?.name;
    
    if (roomName === 'Makeup Station' && !booking.roomNumber) {
        alert('Please select a station (A or B)');
        return false;
    }
    
    if (roomName === 'Classroom') {
        if (!document.getElementById('class-type').value) {
            alert('Please select class type');
            return false;
        }
    }
    
    if (roomName === 'Creative Studio') {
        if (!document.getElementById('usage-type').value) {
            alert('Please select usage type');
            return false;
        }
    }
    
    return true;
}

// ── Validate Step (Updated) ────────────────────────────────
const originalValidateStep = validateStep;
// Override validateStep to handle Step 2
// Actually, let's just replace the validateStep function

// ── Go to Step (Updated) ────────────────────────────────
const originalGoToStep = goToStep;
// We need to update goToStep to handle Step 6 for confirmation

// ── Build Confirm Summary (Updated) ────────────────────────────────
const originalBuildConfirmSummary = buildConfirmSummary;

function buildConfirmSummaryUpdated() {
    const timeStr = timeMode === 'single'
        ? `${booking.startTime} (1 hr)`
        : `${booking.startTime} – ${booking.endTime}`;
    
    document.getElementById('cf-room').textContent     = `${booking.room?.name}${booking.roomNumber ? ` (Station ${booking.roomNumber})` : ''}`;
    document.getElementById('cf-date').textContent     = booking.date || '-';
    document.getElementById('cf-time').textContent     = timeStr;
    document.getElementById('cf-duration').textContent = `${booking.durationHours} hr${booking.durationHours !== 1 ? 's' : ''}`;
    document.getElementById('cf-addons').textContent   = booking.addons.length ? booking.addons.map(a => `${a.name} (MYR ${a.price})`).join(', ') : 'None';
    document.getElementById('cf-client').textContent   = booking.client?.name || '-';
    document.getElementById('cf-total').textContent    = `MYR ${calculateTotal()}`;
    
    // Add room details to confirmation
    const cfSummary = document.querySelector('.confirmation-summary');
    // Remove existing room details if any
    const oldDetails = document.getElementById('cf-room-details');
    if (oldDetails) oldDetails.remove();
    
    if (booking.roomDetails) {
        const detailsDiv = document.createElement('div');
        detailsDiv.id = 'cf-room-details';
        
        if (booking.room?.name === 'Classroom') {
            detailsDiv.innerHTML = `
                <div class="summary-item"><span class="summary-label">Class Type</span><span class="summary-value">${booking.roomDetails.classType}</span></div>
                ${booking.roomDetails.paxCount ? `<div class="summary-item"><span class="summary-label">Pax</span><span class="summary-value">${booking.roomDetails.paxCount}</span></div>` : ''}
            `;
        } else if (booking.room?.name === 'Creative Studio' && booking.roomDetails.usageType) {
            detailsDiv.innerHTML = `<div class="summary-item"><span class="summary-label">Usage</span><span class="summary-value">${booking.roomDetails.usageType}</span></div>`;
            if (booking.roomDetails.eventType) {
                detailsDiv.innerHTML += `<div class="summary-item"><span class="summary-label">Event Type</span><span class="summary-value">${booking.roomDetails.eventType}</span></div>`;
            }
        }
        
        cfSummary.insertBefore(detailsDiv, cfSummary.lastElementChild);
    }
}

// ── Confirm Booking (Updated) ────────────────────────────────
const originalConfirmBooking = confirmBooking;

async function confirmBookingUpdated() {
    const btn = document.getElementById('confirm-btn');
    btn.disabled = true;
    btn.innerHTML = 'Processing… <i class="fas fa-spinner fa-spin"></i>';
    
    const bookingId = 'LEISH-' + Date.now().toString().slice(-8);
    const timeStr = timeMode === 'single'
        ? `${booking.startTime} (1 hr)`
        : `${booking.startTime} – ${booking.endTime}`;
    
    const bookingData = {
        booking_id:       bookingId,
        room:             booking.room?.name,
        room_number:       booking.roomNumber,
        room_price_hr:    booking.room?.pricePerHour,
        date:             booking.date,
        start_time:       booking.startTime,
        end_time:         booking.endTime || booking.startTime,
        duration_hours:   booking.durationHours,
        addons:           JSON.stringify(booking.addons),
        client_name:      booking.client?.name,
        client_email:     booking.client?.email,
        client_phone:     booking.client?.phone,
        client_notes:     booking.client?.notes,
        total_amount:     calculateTotal(),
        status:           'pending',
        payment_status:   'pending',
        created_at:       new Date().toISOString()
    };
    
    // Add room details
    if (booking.roomDetails) {
        if (booking.room?.name === 'Classroom') {
            bookingData.class_type = booking.roomDetails.classType;
            bookingData.pax_count = booking.roomDetails.paxCount;
            bookingData.refreshments = booking.roomDetails.refreshments?.substring(0, 120);
            bookingData.special_request_class = booking.roomDetails.specialRequest?.substring(0, 1200);
        } else if (booking.room?.name === 'Creative Studio') {
            bookingData.usage_type = booking.roomDetails.usageType;
            bookingData.event_type = booking.roomDetails.eventType;
            bookingData.event_pax = booking.roomDetails.eventPax;
            bookingData.special_request_creative = booking.roomDetails.specialRequest?.substring(0, 150);
        }
    }
    
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient.from('bookings').insert([bookingData]);
            if (error) console.warn('Supabase:', error.message);
        } catch(e) { console.warn('Supabase:', e.message); }
    }
    
    try {
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: 'Studio Leish <bookings@leish.my>',
                to: [booking.client?.email],
                subject: `Booking Confirmed — ${bookingId}`,
                html: `<h1>Booking Confirmed!</h1><p>Hi ${booking.client?.name},</p>
                    <ul>
                        <li><strong>Booking ID:</strong> ${bookingId}</li>
                        <li><strong>Room:</strong> ${booking.room?.name}${booking.roomNumber ? ` (Station ${booking.roomNumber})` : ''}</li>
                        <li><strong>Date:</strong> ${booking.date}</li>
                        <li><strong>Time:</strong> ${timeStr}</li>
                        <li><strong>Duration:</strong> ${booking.durationHours} hours</li>
                        <li><strong>Total:</strong> MYR ${calculateTotal()}</li>
                    </ul>
                    <p>Thank you for choosing Studio Leish!</p>`
            })
        });
    } catch(e) { console.warn('Email:', e.message); }
    
    try {
        const billRes  = await fetch('/api/billplz-create-bill', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId, amount: calculateTotal(), customerName: booking.client?.name, customerEmail: booking.client?.email })
        });
        const billData = await billRes.json();
        if (billData.bill_url) { window.location.href = billData.bill_url; return; }
    } catch(e) { console.warn('Billplz:', e.message); }
    
    // Show success
    document.querySelector(`#step-${currentStep}`).classList.remove('active');
    document.getElementById('progress-bar').style.display = 'none';
    document.getElementById('booking-id-display').textContent = bookingId;
    document.getElementById('confirm-email').textContent = booking.client?.email;
    document.getElementById('step-success').classList.add('active');
}
