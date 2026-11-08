import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GroupsService } from './application/groups.service';
import { GroupRepository } from './domain/group.repository';
import { GroupInvitationOrmEntity } from './infrastructure/group-invitation.orm-entity';
import { GroupMemberOrmEntity } from './infrastructure/group-member.orm-entity';
import { GroupOrmEntity } from './infrastructure/group.orm-entity';
import { GroupRepositoryImpl } from './infrastructure/group.repository.impl';
import { GroupsController } from './presentation/groups.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupOrmEntity,
      GroupMemberOrmEntity,
      GroupInvitationOrmEntity,
    ]),
    AuthModule,
  ],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    { provide: GroupRepository, useClass: GroupRepositoryImpl },
  ],
  exports: [GroupsService],
})
export class GroupsModule {}
