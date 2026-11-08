import { User } from './user.entity';

export interface CreateUserInput {
  email: string;
  passwordHash: string | null;
  fullName: string;
  role: 'user';
  emailVerified: boolean;
  defaultCurrency: string;
}

export interface CreateEmailVerificationTokenInput {
  tokenHash: string;
  expiresAt: Date;
}

export interface CreateAppleUserInput {
  email: string;
  fullName: string;
  emailVerified: boolean;
  defaultCurrency: string;
  appleSubject: string;
}

export abstract class UserRepository {
  abstract findActiveByEmail(email: string): Promise<User | null>;

  abstract findActiveById(userId: string): Promise<User | null>;

  abstract findActiveByAppleSubject(appleSubject: string): Promise<User | null>;

  abstract findAppleSubjectByUserId(userId: string): Promise<string | null>;

  abstract createUserWithVerificationToken(
    user: CreateUserInput,
    token: CreateEmailVerificationTokenInput,
  ): Promise<User>;

  abstract createAppleUser(input: CreateAppleUserInput): Promise<User>;

  abstract linkAppleIdentity(
    userId: string,
    appleSubject: string,
    email: string | null,
  ): Promise<void>;

  /**
   * Consume a verification token matching tokenHash if it is valid (not expired,
   * not already consumed). Returns the user if consumed, null if no matching valid token.
   */
  abstract consumeVerificationToken(
    tokenHash: string,
  ): Promise<{ userId: string; email: string } | null>;

  /**
   * Create a new verification token for the given user, retiring old ones.
   * Returns the new plain token (caller is responsible for sending it).
   */
  abstract rotateVerificationToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void>;

  /**
   * Find the most recent unconsumed verification token created_at for an active,
   * unverified user by email. Returns null if no such user/token exists.
   */
  abstract findLatestVerificationTokenCreatedAt(
    email: string,
  ): Promise<{ userId: string; createdAt: Date } | null>;

  /**
   * Mark a user's email as verified.
   */
  abstract markEmailVerified(userId: string): Promise<{ email: string }>;

  // ── Password reset ───────────────────────────────────────────────────────

  /**
   * Create a new password reset token for the given user.
   */
  abstract createPasswordResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void>;

  /**
   * Find the most recent password reset token created_at for an active user by email.
   * Returns null if no active user found (non-enumerating).
   */
  abstract findLatestPasswordResetTokenCreatedAt(
    email: string,
  ): Promise<{ userId: string; createdAt: Date } | null>;

  /**
   * Consume a password reset token matching tokenHash if valid (not expired, not consumed).
   * Returns the userId if consumed, null if not found/invalid.
   */
  abstract consumePasswordResetToken(
    tokenHash: string,
  ): Promise<{ userId: string } | null>;

  /**
   * Update the password hash for a user and bump password_changed_at.
   */
  abstract updatePasswordHash(
    userId: string,
    passwordHash: string,
  ): Promise<void>;

  abstract countActiveAdmins(): Promise<number>;

  abstract createAdminUser(input: {
    email: string;
    passwordHash: string;
    fullName: string;
  }): Promise<User>;

  abstract updateMfaSecret(
    userId: string,
    secret: string,
    enabled: boolean,
  ): Promise<void>;
}
