// src/entities/member.entity.ts
import { Entity, PrimaryKey, Property, ManyToMany, Collection } from '@mikro-orm/core';
import { Community } from './community.entity'; // Import the Community entity
import { CommunityMember } from './community-member.entity';
import { Exclude } from 'class-transformer';

@Entity({ tableName: 'member', schema: 'community' })
export class Member {
  @PrimaryKey()
  id!: number; // Auto-incremented primary key

  @Property({ length: 36 }) // UUIDs are typically 36 characters long
  ent_id!: string; // String field for external ID

  @Property({ default: 'now()' })
  createdAt: Date = new Date(); // Automatically set the creation date

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date; // Automatically update on changes

  @Exclude()
  @ManyToMany({
    entity: () => Community,
    mappedBy: 'members', 
    pivotEntity: () => CommunityMember,
  })
  communities = new Collection<Community>(this);
}