import { Body, Controller, Post } from '@nestjs/common';

import { AiService } from './ai.service';
import { AuditDto } from './dto/audit.dto';
import { GeneratePrNoteDto } from './dto/generate-pr-note.dto';
import { RecommendComponentDto } from './dto/recommend-component.dto';
import { SetupGuidanceDto } from './dto/setup-guidance.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('recommend-component')
  recommendComponent(@Body() dto: RecommendComponentDto) {
    return this.aiService.recommendComponent(dto);
  }

  @Post('audit')
  audit(@Body() dto: AuditDto) {
    return this.aiService.audit(dto);
  }

  @Post('setup-guidance')
  setupGuidance(@Body() dto: SetupGuidanceDto) {
    return this.aiService.setupGuidance(dto);
  }

  @Post('generate-pr-note')
  generatePrNote(@Body() dto: GeneratePrNoteDto) {
    return this.aiService.generatePrNote(dto);
  }
}
