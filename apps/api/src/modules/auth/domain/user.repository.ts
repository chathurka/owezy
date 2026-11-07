import { User } from './user.entity';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  fullName: string;
  role: 'user';
  emailVerified: boolean;
  defaultCurrency: string;
}

export interface CreateEmailVerificationTokenInput {
  tokenHash: string;
  expiresAt: Date;
}

export abstract class UserRepository {
  abstract findActiveByEmail(email: string): Promise<User | null>;

  abstract createUserWithVerificationToken(
    user: CreateUserInput,
    token: CreateEmailVerificationTokenInput,
  ): Promise<User>;
}
