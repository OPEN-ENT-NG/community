import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Community } from './community.entity';
import { Member } from './member.entity';

@Entity({ tableName: 'community_member', schema: 'community' })
export class CommunityMember {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Community)
  community!: Community;

  @ManyToOne(() => Member)
  member!: Member;

  @Property()
  addedAt: Date = new Date();

}