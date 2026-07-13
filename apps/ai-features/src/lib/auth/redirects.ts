export function redirectToSignIn() {
  if (typeof window === 'undefined') return;

  const currentUrl = `${window.location.pathname}${window.location.search}`;
  const target = `/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`;

  if (window.location.pathname !== '/sign-in') {
    window.location.assign(target);
  }
}
