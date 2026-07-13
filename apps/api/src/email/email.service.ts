import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type InviteEmailInput = {
  to: string;
  inviteLink: string;
  organizationName: string;
  invitedByName?: string | null;
  invitedByEmail: string;
  role: string;
};

export type EmailDeliveryResult = {
  status: 'sent' | 'not_configured';
  provider: 'resend' | 'development';
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendOrganizationInvite(input: InviteEmailInput): Promise<EmailDeliveryResult> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('EMAIL_FROM');

    if (!apiKey || !from) {
      this.logger.warn(
        `Email provider is not configured. Invite for ${input.to}: ${input.inviteLink}`
      );
      return { status: 'not_configured', provider: 'development' };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: `Join ${input.organizationName} on ComponentIQ`,
        html: this.renderInviteEmail(input),
        text: this.renderInviteText(input),
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      this.logger.error(`Invite email failed for ${input.to}: ${message}`);
      throw new InternalServerErrorException('Invite email could not be sent');
    }

    return { status: 'sent', provider: 'resend' };
  }

  private renderInviteEmail(input: InviteEmailInput) {
    const inviter = escapeHtml(input.invitedByName ?? input.invitedByEmail);
    const organizationName = escapeHtml(input.organizationName);
    const role = escapeHtml(input.role);
    const to = escapeHtml(input.to);
    const inviteLink = escapeHtml(input.inviteLink);

    return `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h1 style="font-size: 20px; margin: 0 0 12px;">You have been invited to ComponentIQ</h1>
        <p style="margin: 0 0 16px;">
          ${inviter} invited you to join <strong>${organizationName}</strong> as ${role}.
        </p>
        <p style="margin: 0 0 20px;">
          Accept the invite to collaborate on design-system components, guardrails, and AI workflows.
        </p>
        <a href="${inviteLink}" style="display: inline-block; padding: 10px 16px; border-radius: 8px; background: #8D493A; color: #FDFAF9; text-decoration: none;">
          Accept invite
        </a>
        <p style="margin: 20px 0 0; font-size: 12px; color: #6B7280;">
          This invite can only be accepted by ${to}.
        </p>
      </div>
    `;
  }

  private renderInviteText(input: InviteEmailInput) {
    const inviter = input.invitedByName ?? input.invitedByEmail;

    return [
      `You have been invited to ComponentIQ.`,
      `${inviter} invited you to join ${input.organizationName} as ${input.role}.`,
      `Accept invite: ${input.inviteLink}`,
      `This invite can only be accepted by ${input.to}.`,
    ].join('\n\n');
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
