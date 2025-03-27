import {
  EntityManager,
  MikroORM,
  EntityRepository,
  Transactional,
  LoadStrategy,
} from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { RequestLogger } from 'src/logger/request-logger.service';
import { SearchCommunityRequestDto } from './dtos/search-community-request.dto';
import { CommunityDto } from './dtos/community.dto';
import { CreateCommunityRequestDto } from './dtos/create-community-request.dto';
import { Community } from './entities/community.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { plainToInstance } from 'class-transformer';
import { Member } from './entities/member.entity';
import { ENTUserSession } from 'src/common/session.types';
import { MemberDto } from './dtos/member.dto';
import { EventsService } from 'src/events/events.service';
import { EventBuilder } from 'src/events/events.builder';

@Injectable()
export class CommunityService {
  constructor(
    private readonly logger: RequestLogger,
    private readonly eventsService: EventsService,
    private readonly em: EntityManager,
    @InjectRepository(Community)
    private readonly communityRepository: EntityRepository<Community>,
    @InjectRepository(Member)
    private readonly memberRepository: EntityRepository<Member>,
  ) {}

  @Transactional()
  async search(
    searchDto: SearchCommunityRequestDto,
  ): Promise<{ data: CommunityDto[]; total: number }> {
    const { id, ids, members, size, page, fields } = searchDto;
    const withMembers = fields?.includes('members');
    // Create a query builder for the Community entity
    const qb = this.em.createQueryBuilder(Community, 'c');

    // Filter by single ID
    if (id) {
      qb.andWhere({ id });
    }
    // Filter by multiple IDs
    if (ids && ids.length > 0) {
      qb.andWhere({ id: { $in: ids } });
    }
    // Filter by members
    if (members && members.length > 0) {
      // Join the members table
      qb.join('c.members', 'm');

      // Group by community ID and filter by the number of matching members
      qb.andWhere({ 'm.ent_id': { $in: members } });
      qb.groupBy('c.id');
      qb.having('COUNT(m.id) = ?', [members.length]);
    }
    // Apply pagination
    qb.limit(size).offset((page - 1) * size);

    const [results, total] = await qb.getResultAndCount();
    if (withMembers) {
      await this.em.populate(results, ['members']);
    }
    const dtos = results.map((r) => {
      const dto = plainToInstance(CommunityDto, r, {
        excludeExtraneousValues: true,
      });
      if (withMembers) {
        const membersDto = plainToInstance(MemberDto, r.members.getItems(), {
          excludeExtraneousValues: true,
        });
        dto.members = membersDto;
      }
      return dto;
    });
    return {
      data: dtos,
      total,
    };
  }

  @Transactional()
  async create(
    request: CreateCommunityRequestDto,
    session: ENTUserSession,
  ): Promise<CommunityDto> {
    const member = await this.em.findOne(Member, { ent_id: session.userId });
    let organizer: Member;
    if (member) {
      organizer = member;
    } else {
      organizer = new Member();
      organizer.ent_id = session.userId;
      organizer.createdAt = new Date();
      this.em.insert(Member, organizer);
    }
    const newCommunity = new Community();
    newCommunity.title = request.title;
    newCommunity.description = request.description;
    newCommunity.createdAt = new Date();
    newCommunity.updatedAt = new Date();
    newCommunity.members.add(organizer);
    await this.em.persistAndFlush(newCommunity);
    const dto = plainToInstance(CommunityDto, newCommunity, {
      excludeExtraneousValues: true,
    });
    this.eventsService.sendEvent(new EventBuilder().withType('community.creation').withPayload(dto).build());
    return dto;
  }
}
