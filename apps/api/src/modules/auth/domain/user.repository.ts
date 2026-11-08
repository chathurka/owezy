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
}
