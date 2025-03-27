import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { CommunityMember } from './community-member.entity';
import { Member } from './member.entity';

@Entity({ tableName: 'community', schema: 'community' })
export class Community {
  @PrimaryKey()
  id!: number; // Auto-incremented primary key

  @Property({ length: 100 })
  title!: string; // String with max length of 100

  @Property({ length: 1000 })
  description!: string; // String with max length of 1000

  @Property({ default: 'now()' })
  createdAt: Date = new Date(); // Automatically set the creation date

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date; // Automatically update on changes

  @ManyToMany({
    entity: () => Member,
    pivotEntity: () => CommunityMember,
    joinColumn: 'community_id',
    inverseJoinColumn: 'member_id',
  })
  members = new Collection<Member>(this)
}