// API: Google OAuth - Redirects to Supabase's built-in OAuth
// This endpoint is kept for backward compatibility
// New flow uses client-side supabase.auth.signInWithOAuth() directly

module.exports = async (req, res) => {
  const { redirect } = req.query;
  const redirectUrl = redirect ? decodeURIComponent(redirect) : 'user-dashboard.html';

  // Redirect to the user page which handles OAuth properly
  return res.redirect(`/user.html?redirect=${encodeURIComponent(redirectUrl)}`);
};
