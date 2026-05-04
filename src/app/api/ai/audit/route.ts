import { NextResponse } from 'next/server';

import { getAudit } from '@/ai/server';
import { auditRequestSchema } from '@/ai/schemas/audit.schema';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = auditRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid audit request', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await getAudit(parsed.data);
  return NextResponse.json(result);
}
