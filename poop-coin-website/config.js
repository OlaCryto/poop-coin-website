// Repository-level config (for developers). Kept in sync with client/server configs.
// This file is not served by Flask static routing, but lives at project root as requested.
export const SITE_NAME = '$OHSHIT';
export const SITE_TAGLINE = "$OHSHIT: The ultimate shitcoin on AVAX. Flush your FUD and join the dump!";
export const PRIMARY_COLOR = '#FFD700';
export const LOGO_PATH = '/static/images/happy_poop.png';

// Also export a default object for convenience
export default { SITE_NAME, SITE_TAGLINE, PRIMARY_COLOR, LOGO_PATH };
