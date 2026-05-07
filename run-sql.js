const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://kcmoibrqyrzueslaqtgc.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucGlla2llZHludmVjaGF3aGh3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA2NDYzNSwiZXhwIjoyMDkwNjQwNjM1fQ.8m2J0PdMUG43l-jnYbQ7VoyHUqdzdfJyY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL(filePath) {
  console.log(`\nRunning ${filePath}...`);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  // Supabase doesn't allow direct SQL execution via REST API
  // We need to use the pgadmin or SQL editor
  console.log('SQL file content:');
  console.log(sql);
  console.log('\n---');
  console.log(`To run this SQL, go to: ${supabaseUrl.replace('.supabase.co', '')}/project/kcmoibrqyrzueslaqtgc/sql`);
}

async function checkTables() {
  console.log('\nChecking existing tables...\n');
  
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .limit(1);
  
  console.log('bookings table:', bookingsError ? `Error: ${bookingsError.message}` : '✅ EXISTS');
  
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('*')
    .limit(1);
  
  console.log('users table:', usersError ? `Error: ${usersError.message}` : '✅ EXISTS');
  
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('*')
    .limit(1);
  
  console.log('reviews table:', reviewsError ? `❌ MISSING - needs SQL` : '✅ EXISTS');
  
  const { data: pushSubs, error: pushSubsError } = await supabase
    .from('push_subscriptions')
    .select('*')
    .limit(1);
  
  console.log('push_subscriptions table:', pushSubsError ? `❌ MISSING - needs SQL` : '✅ EXISTS');
  
  const { data: images, error: imagesError } = await supabase
    .from('images')
    .select('*')
    .limit(1);
  
  console.log('images table:', imagesError ? `Error: ${imagesError.message}` : '✅ EXISTS');
  
  const { data: settings, error: settingsError } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1);
  
  console.log('site_settings table:', settingsError ? `Error: ${settingsError.message}` : '✅ EXISTS');
}

checkTables().then(() => {
  console.log('\n\n=== SQL Scripts to Run ===');
  runSQL('reviews-schema.sql');
  runSQL('push-subscription-schema.sql');
  console.log('\n\n=== Note ===');
  console.log('The SQL scripts need to be run manually in Supabase SQL Editor:');
  console.log('https://app.supabase.com/project/kcmoibrqyrzueslaqtgc/sql');
});
