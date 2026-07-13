import { redirectToSignIn } from './redirects';

type GetToken = () => Promise<string | null>;

export async function requireClerkSessionToken(getToken: GetToken) {
  const clerkSessionToken = (await getToken())?.trim();

  if (!clerkSessionToken) {
    redirectToSignIn();
    throw new Error('Your sign-in session is not ready. Please try again.');
  }

  return clerkSessionToken;
}
