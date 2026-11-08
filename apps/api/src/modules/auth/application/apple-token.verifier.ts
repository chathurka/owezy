export interface AppleIdentityClaims {
  sub: string;
  email?: string;
  emailVerified: boolean;
}

export abstract class AppleTokenVerifier {
  abstract verify(identityToken: string): Promise<AppleIdentityClaims>;
}
