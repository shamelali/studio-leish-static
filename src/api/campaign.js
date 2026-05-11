module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  
  const { name, subject, htmlContent, textContent, senderName, senderEmail, templateId } = req.body;

  if (!name || !subject) {
    return res.status(400).json({ error: 'Missing required fields: name, subject' });
  }

  try {
    // Option 1: Create from template
    if (templateId) {
      const response = await fetch('https://api.brevo.com/v3/emailCampaigns', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY
        },
        body: JSON.stringify({
          name: name,
          subject: subject,
sender: { 
            name: senderName || 'Studio Leish', 
            email: senderEmail || 'shamelali@gmail.com' 
          },
          type: 'template',
          templateId: parseInt(templateId)
        })
      });
      
      const data = await response.json();
      return res.status(response.ok ? 200 : response.status).json(response.ok ? { success: true, data } : { error: data });
    }

    // Option 2: Create draft campaign (no recipients needed yet)
    const response = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        name: name,
        subject: subject,
sender: { 
            name: senderName || 'Studio Leish', 
            email: senderEmail || 'hello@leish.my' 
          },
          type: 'classic',
          htmlContent: htmlContent || '<p>Content will be added later</p>',
          textContent: textContent || '',
          _footer: "<br><p>This email was sent from Studio Leish.</p>"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'Failed', details: data });
    }

    return res.status(200).json({ success: true, campaign: data, message: 'Campaign created. Add recipients in Brevo dashboard to send.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};