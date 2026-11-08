export type UserRole = 'user' | 'admin';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string | null,
    public readonly fullName: string,
    public readonly role: UserRole,
    public readonly emailVerified: boolean,
    public readonly defaultCurrency: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
    public readonly mfaEnabled: boolean = false,
    public readonly mfaSecret: string | null = null,
    public readonly phone: string | null = null,
    public readonly paymentHandle: string | null = null,
    public readonly avatarUrl: string | null = null,
    public readonly profileSetupCompletedAt: Date | null = null,
    public readonly preferredLocale: string = 'en',
  ) {}
}
