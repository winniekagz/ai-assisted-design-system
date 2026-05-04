import { NextResponse } from 'next/server';

import { getRecommendation, recommendationRequestSchema } from '@winniekagendo/componentiq-ai';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = recommendationRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid recommendation request', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await getRecommendation(parsed.data);
  return NextResponse.json(result);
}
