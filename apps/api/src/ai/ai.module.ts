import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AI_PROVIDER } from './providers/ai-provider.interface';
import { MockAiProvider } from './providers/mock-ai.provider';
import { OpenAiProvider } from './providers/openai.provider';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    MockAiProvider,
    {
      provide: AI_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const provider = configService.get<string>('AI_PROVIDER') ?? 'mock';
        const apiKey = configService.get<string>('OPENAI_API_KEY');

        if (provider === 'openai' && apiKey) {
          return new OpenAiProvider(configService);
        }

        return new MockAiProvider();
      },
    },
  ],
})
export class AiModule {}
