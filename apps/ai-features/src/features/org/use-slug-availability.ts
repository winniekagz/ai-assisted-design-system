'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useMemo, useState } from 'react';

import { apiClient } from '@/lib/api/client';
import { slugifyOrganization } from './utils';

export type SlugStatus = 'idle' | 'invalid' | 'checking' | 'available' | 'taken' | 'unknown';

export interface SlugAvailability {
  status: SlugStatus;
  message: string;
}

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;

/**
 * useSlugAvailability — debounced, live workspace-URL validation so the
 * founder never discovers a clash only on submit.
 *
 * Network availability is best-effort: if the endpoint is missing or errors,
 * status falls back to 'unknown' and NEVER blocks submission — the server
 * stays the source of truth on create.
 *
 * TODO(api): there is no GET /organizations/slug-available endpoint in
 * apps/api yet (only POST /organizations, GET /organizations,
 * GET /organizations/slug/:orgSlug, GET /organizations/:id exist). This
 * calls the suggested shape below and gracefully falls back to 'unknown'
 * until that endpoint ships:
 *   GET /organizations/slug-available?slug=... -> { available: boolean }
 */
async function fetchSlugAvailability(
  slug: string,
  clerkSessionToken: string | null
): Promise<boolean | null> {
  try {
    const data = await apiClient.get<{ available?: boolean }>(
      `/organizations/slug-available?slug=${encodeURIComponent(slug)}`,
      { clerkSessionToken, authRedirect: false }
    );
    return typeof data.available === 'boolean' ? data.available : null;
  } catch {
    return null;
  }
}

export function useSlugAvailability(slug: string): SlugAvailability {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [result, setResult] = useState<SlugAvailability>({ status: 'idle', message: '' });

  const formatValid = useMemo(
    () => slug.length >= 2 && slug === slugifyOrganization(slug) && SLUG_RE.test(slug),
    [slug]
  );

  useEffect(() => {
    if (!isLoaded || !isSignedIn || slug.length === 0) {
      setResult({ status: 'idle', message: '' });
      return;
    }
    if (!formatValid) {
      setResult({
        status: 'invalid',
        message: 'Use lowercase letters, numbers, and hyphens (2–80 characters).',
      });
      return;
    }

    let cancelled = false;
    setResult({ status: 'checking', message: 'Checking availability…' });

    const timer = setTimeout(async () => {
      const clerkSessionToken = await getToken();
      const available = await fetchSlugAvailability(slug, clerkSessionToken);
      if (cancelled) return;
      if (available === null) {
        setResult({ status: 'unknown', message: "We'll confirm this URL when you continue." });
      } else if (available) {
        setResult({ status: 'available', message: 'This URL is available.' });
      } else {
        setResult({ status: 'taken', message: 'That URL is taken. Try another.' });
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [slug, formatValid, getToken, isLoaded, isSignedIn]);

  return result;
}
