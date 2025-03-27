import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController as CommunityController } from './community.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { Community } from './entities/community.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CommunityMember } from './entities/community-member.entity';
import { CommunityInvitation } from './entities/community-invitation.entity';
import { Member } from './entities/member.entity';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    LoggerModule,
    EventsModule,
    MikroOrmModule.forFeature([Community, CommunityMember, CommunityInvitation, Member])],
  providers: [CommunityService],
  controllers: [CommunityController],
})
export class CommunityModule {}
