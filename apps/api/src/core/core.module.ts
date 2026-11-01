import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreAuthModule } from './auth/core-auth.module';
import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { typeOrmConfig } from './database/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: envValidationSchema,
      envFilePath: [
        `apps/api/.env`,
        `apps/api/env/.env.${process.env.APP_ENV ?? 'dev'}`,
      ],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    CoreAuthModule,
  ],
  exports: [CoreAuthModule],
})
export class CoreModule {}
