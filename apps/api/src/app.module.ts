import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { GroupsModule } from './modules/groups/groups.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [CoreModule, AuthModule, UsersModule, GroupsModule],
})
export class AppModule {}
