// API: Push Notification Subscription
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  // Handle both POST (subscribe) and DELETE (unsubscribe)
  if (req.method === 'POST') {
    try {
      const { subscription, email } = req.body;

      if (!subscription || !subscription.endpoint) {
        return res.status(400).json({ error: 'Invalid subscription object' });
      }

      // Store subscription in database
      const { data, error } = await supabase
        .from('push_subscriptions')
        .upsert([{
          endpoint: subscription.endpoint,
          keys: JSON.stringify(subscription.keys),
          email: email || null,
          created_at: new Date().toISOString()
        }], { onConflict: 'endpoint' })
        .select();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Push subscription saved',
        data: data[0]
      });

    } catch (error) {
      console.error('Error saving push subscription:', error);
      return res.status(500).json({ error: error.message });
    }
  } 
  else if (req.method === 'DELETE') {
    try {
      const { endpoint } = req.body;

      if (!endpoint) {
        return res.status(400).json({ error: 'Missing endpoint' });
      }

      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', endpoint);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Push subscription removed'
      });

    } catch (error) {
      console.error('Error removing push subscription:', error);
      return res.status(500).json({ error: error.message });
    }
  } 
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};