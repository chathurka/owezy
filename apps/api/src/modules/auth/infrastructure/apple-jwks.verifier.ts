import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jose from 'jose';
import {
  AppleIdentityClaims,
  AppleTokenVerifier,
} from '../application/apple-token.verifier';

const APPLE_ISSUER = 'https://appleid.apple.com';
const APPLE_JWKS_URI = 'https://appleid.apple.com/auth/keys';

@Injectable()
export class AppleJwksVerifier extends AppleTokenVerifier {
  private readonly jwks = jose.createRemoteJWKSet(new URL(APPLE_JWKS_URI));

  constructor(private readonly config: ConfigService) {
    super();
  }

  async verify(identityToken: string): Promise<AppleIdentityClaims> {
    const audiences = this.config.get<string[]>('apple.clientIds') ?? [];
    if (audiences.length === 0) {
      throw this.invalidToken();
    }

    try {
      const { payload } = await jose.jwtVerify(identityToken, this.jwks, {
        issuer: APPLE_ISSUER,
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
      code: 'INVALID_APPLE_TOKEN',
      message: 'Apple identity token is invalid',
    });
  }
}
