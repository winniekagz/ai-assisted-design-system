import { NextResponse } from 'next/server';

import { getGovernance } from '@/ai/server';
import { governanceRequestSchema } from '@/ai/schemas/governance.schema';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = governanceRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid governance request', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await getGovernance(parsed.data);
  return NextResponse.json(result);
}
