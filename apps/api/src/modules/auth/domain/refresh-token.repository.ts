export abstract class RefreshTokenRepository {
  /**
   * Store a new refresh token hash for a user.
   */
  abstract store(userId: string, tokenHash: string, expiresAt: Date): Promise<void>;

  /**
   * Find a valid (unrevoked, unexpired, not soft-deleted) token by hash.
   * Returns the token id and userId if found.
   */
  abstract findValid(
    tokenHash: string,
  ): Promise<{ id: string; userId: string } | null>;

  /**
   * Revoke a token by its id (set revoked_at).
   */
  abstract revoke(id: string): Promise<void>;

  /**
   * Revoke by token hash — used in logout when we have the raw hash.
   */
  abstract revokeByHash(tokenHash: string): Promise<void>;
}
