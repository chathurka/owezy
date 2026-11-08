import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jose from 'jose';
import {
  GoogleIdentityClaims,
  GoogleTokenVerifier,
} from '../application/google-token.verifier';

const GOOGLE_ISSUERS = [
  'https://accounts.google.com',
  'accounts.google.com',
];
const GOOGLE_JWKS_URI = 'https://www.googleapis.com/oauth2/v3/certs';

@Injectable()
export class GoogleJwksVerifier extends GoogleTokenVerifier {
  private readonly jwks = jose.createRemoteJWKSet(new URL(GOOGLE_JWKS_URI));

  constructor(private readonly config: ConfigService) {
    super();
  }

  async verify(idToken: string): Promise<GoogleIdentityClaims> {
    const audiences = this.config.get<string[]>('google.clientIds') ?? [];
    if (audiences.length === 0) {
      throw this.invalidToken();
    }

    try {
      const { payload } = await jose.jwtVerify(idToken, this.jwks, {
        issuer: GOOGLE_ISSUERS,
        audience: audiences,
      });

      if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
        throw this.invalidToken();
      }

      const email =
        typeof payload.email === 'string' ? payload.email.trim() : undefined;
      const emailVerified =
        payload.email_verified === true ||
        payload.email_verified === 'true';

      return {
        sub: payload.sub,
        email,
        emailVerified: Boolean(email && emailVerified),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw this.invalidToken();
    }
  }

  private invalidToken(): UnauthorizedException {
    return new UnauthorizedException({
      code: 'INVALID_GOOGLE_TOKEN',
      message: 'Google ID token is invalid',
    });
  }
}
