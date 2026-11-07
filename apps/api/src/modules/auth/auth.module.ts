import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreAuthModule } from '../../core/auth/core-auth.module';
import { AuthService } from './application/auth.service';
import { EmailPort } from './application/email.port';
import { UserRepository } from './domain/user.repository';
import { EmailVerificationTokenOrmEntity } from './infrastructure/email-verification-token.orm-entity';
import { ResendEmailAdapter } from './infrastructure/resend-email.adapter';
import { UserOrmEntity } from './infrastructure/user.orm-entity';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, EmailVerificationTokenOrmEntity]),
    CoreAuthModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: EmailPort, useClass: ResendEmailAdapter },
  ],
  exports: [AuthService],
})
export class AuthModule {}
