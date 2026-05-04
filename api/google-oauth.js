// API: Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://studio.leish.my/api/google-oauth';

module.exports = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    // Redirect to Google OAuth
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=openid email profile` +
      `&access_type=offline`;

    return res.redirect(authUrl);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      throw new Error(tokens.error_description || tokens.error);
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const userInfo = await userResponse.json();

    // Redirect to user dashboard with user info as params
    const userParams = Buffer.from(JSON.stringify(userInfo)).toString('base64');
    return res.redirect(`/user-dashboard.html?auth=${userParams}`);

  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(500).json({ error: error.message });
  }
};