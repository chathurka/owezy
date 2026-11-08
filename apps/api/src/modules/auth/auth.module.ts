import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreAuthModule } from '../../core/auth/core-auth.module';
import { AppleTokenVerifier } from './application/apple-token.verifier';
import { AuthService } from './application/auth.service';
import { EmailPort } from './application/email.port';
import { UserRepository } from './domain/user.repository';
import { AppleJwksVerifier } from './infrastructure/apple-jwks.verifier';
import { EmailVerificationTokenOrmEntity } from './infrastructure/email-verification-token.orm-entity';
import { OauthIdentityOrmEntity } from './infrastructure/oauth-identity.orm-entity';
import { PasswordResetTokenOrmEntity } from './infrastructure/password-reset-token.orm-entity';
import { ResendEmailAdapter } from './infrastructure/resend-email.adapter';
import { UserOrmEntity } from './infrastructure/user.orm-entity';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      EmailVerificationTokenOrmEntity,
      OauthIdentityOrmEntity,
      PasswordResetTokenOrmEntity,
    ]),
    CoreAuthModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: EmailPort, useClass: ResendEmailAdapter },
    { provide: AppleTokenVerifier, useClass: AppleJwksVerifier },
  ],
  exports: [AuthService],
})
export class AuthModule {}
