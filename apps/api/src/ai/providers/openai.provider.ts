import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import {
  AiProvider,
  AiProviderRequest,
  AiProviderResult,
} from './ai-provider.interface';

@Injectable()
export class OpenAiProvider implements AiProvider {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
    });
    this.model =
      this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';
  }

  async completeJson(request: AiProviderRequest): Promise<AiProviderResult> {
    const startedAt = Date.now();
    const completion = await this.client.chat.completions.create({
      model: this.model,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? '{}';

    return {
      model: this.model,
      raw: JSON.parse(content),
      inputTokens: completion.usage?.prompt_tokens,
      outputTokens: completion.usage?.completion_tokens,
      latencyMs: Date.now() - startedAt,
    };
  }
}
