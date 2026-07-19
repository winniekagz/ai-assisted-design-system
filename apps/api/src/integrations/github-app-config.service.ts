import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { ApiEnv } from '../config/env';

export type GithubAppConfig = {
  appId: string;
  clientId: string;
  privateKey: string;
  installationUrl: string;
  callbackUrl: string;
};

@Injectable()
export class GithubAppConfigService {
  constructor(private readonly configService: ConfigService<ApiEnv, true>) {}

  getConfig(): GithubAppConfig {
    const appId = this.configService.get('GITHUB_APP_ID', { infer: true });
    const clientId = this.configService.get('GITHUB_APP_CLIENT_ID', {
      infer: true,
    });
    const privateKey = this.configService.get('GITHUB_APP_PRIVATE_KEY', {
      infer: true,
    });
    const installationUrl = this.configService.get('GITHUB_APP_INSTALLATION_URL', {
      infer: true,
    });
    const callbackUrl = this.configService.get('GITHUB_APP_CALLBACK_URL', {
      infer: true,
    });

    if (!appId || !clientId || !privateKey || !installationUrl || !callbackUrl) {
      throw new ServiceUnavailableException('GitHub App connection is not configured');
    }

    return { appId, clientId, privateKey, installationUrl, callbackUrl };
  }
}
