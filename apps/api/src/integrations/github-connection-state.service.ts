import { BadRequestException, Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';

import type { GithubStatePayload } from './github-integration.types';

const STATE_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class GithubConnectionStateService {
  private readonly consumedStateSignatures = new Set<string>();

  createState({
    organizationId,
    userId,
    returnPath,
    secret,
  }: {
    organizationId: string;
    userId: string;
    returnPath: string;
    secret: string;
  }) {
    const expiresAt = Date.now() + STATE_TTL_MS;
    const state = this.signState(
      {
        organizationId,
        userId,
        returnPath,
        expiresAt,
      },
      secret
    );

    return {
      state,
      expiresAt,
    };
  }

  verifyState(state: string, secret: string): GithubStatePayload {
    const [encodedPayload, signature] = state.split('.');

    if (!encodedPayload || !signature) {
      throw new BadRequestException('GitHub connection state is invalid');
    }

    const expectedSignature = createHmac('sha256', secret)
      .update(encodedPayload)
      .digest('base64url');

    if (!safeEqual(signature, expectedSignature)) {
      throw new BadRequestException('GitHub connection state is invalid');
    }

    if (this.consumedStateSignatures.has(signature)) {
      throw new BadRequestException('GitHub connection state has already been used');
    }

    const payload = parseStatePayload(encodedPayload);

    if (payload.expiresAt < Date.now()) {
      throw new BadRequestException('GitHub connection state has expired');
    }

    this.consumedStateSignatures.add(signature);

    return payload;
  }

  private signState(payload: GithubStatePayload, secret: string) {
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = createHmac('sha256', secret)
      .update(encodedPayload)
      .digest('base64url');

    return `${encodedPayload}.${signature}`;
  }
}

function parseStatePayload(encodedPayload: string): GithubStatePayload {
  const payload = JSON.parse(
    Buffer.from(encodedPayload, 'base64url').toString('utf8')
  ) as GithubStatePayload;

  if (!payload.organizationId || !payload.userId || !payload.returnPath || !payload.expiresAt) {
    throw new BadRequestException('GitHub connection state is invalid');
  }

  return payload;
}

function safeEqual(actual: string, expected: string) {
  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}
