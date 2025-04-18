import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Community } from "@app/community/entities/community.entity";
import { Users } from "@app/common/entities/users.entity";

@Entity({ schema: "community" })
export class Membership {
  @PrimaryKey()
  id!: bigint;

  @Property()
  joinDate!: Date;

  @Enum({ items: () => MembershipRole })
  role!: MembershipRole;

  @Property({ nullable: true })
  lastVisitAnnouncementsDate?: Date;

  @Property({ nullable: true })
  lastVisitResourcesDate?: Date;

  @Property({ nullable: true })
  lastVisitWikiDate?: Date;

  @Property({ nullable: true })
  lastVisitDiscussionsDate?: Date;

  @ManyToOne({ entity: () => Community, index: "idx_membership_community_id" })
  community!: Community;

  @ManyToOne({ entity: () => Users, index: "idx_membership_user_id" })
  user!: Users;

  @ManyToOne({ entity: () => Users, nullable: true })
  inviter?: Users;
}

export enum MembershipRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}
