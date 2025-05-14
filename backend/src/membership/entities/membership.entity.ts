import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Community } from "@app/community/entities/community.entity";
import { User } from "@app/common/entities/user.entity";

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

  @ManyToOne(() => Community, {
    deleteRule: "cascade",
    joinColumn: "community_id",
  })
  community!: Community;

  @ManyToOne(() => User, { joinColumn: "user_id" })
  user!: User;

  @ManyToOne({ entity: () => User, nullable: true })
  inviter?: User;
}

export enum MembershipRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}
