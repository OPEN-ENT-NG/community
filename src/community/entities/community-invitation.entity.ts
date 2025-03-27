import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Community } from './community.entity';
import { Member } from './member.entity';

@Entity({ tableName: 'community_invitation', schema: 'community' })
export class CommunityInvitation {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Community)
  community!: Community;

  @ManyToOne(() => Member)
  member!: Member;

  @Property({name: 'added_at'})
  addedAt: Date = new Date();

  @Property({name: 'accepted_at'})
  joinedAt: Date = new Date();

  @Property({name: 'refused_at'})
  refusedAt: Date = new Date();

  @Property()
  status: 'joined'| 'refused' | 'pending' = 'pending';
}