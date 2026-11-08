export interface GoogleIdentityClaims {
  sub: string;
  email?: string;
  emailVerified: boolean;
}

export abstract class GoogleTokenVerifier {
  abstract verify(idToken: string): Promise<GoogleIdentityClaims>;
}
