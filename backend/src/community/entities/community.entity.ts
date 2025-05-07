import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  type Opt,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Course } from "@app/wiki/entities/course.entity";
import { Users } from "@app/common/entities/users.entity";
import { Membership } from "@app/membership/entities/membership.entity";

@Entity({ schema: "community" })
export class Community {
  @PrimaryKey({ autoincrement: true })
  id!: bigint;

  @Property({ nullable: true })
  image?: string;

  @Property()
  title!: string;

  @Property()
  creationDate!: Date;

  @Property({ nullable: true })
  updateDate?: Date;

  @Enum({ items: () => CommunityType })
  type!: CommunityType;

  @Property({ nullable: true })
  schoolYearStart?: number;

  @Property({ nullable: true })
  schoolYearEnd?: number;

  @Property({ type: "text", nullable: true })
  welcomeNote?: string;

  @Property({ type: "boolean" })
  discussionEnabled: boolean & Opt = true;

  @Property({ nullable: true })
  archivedDate?: Date;

  @Property({ length: 64, nullable: true })
  secretCode?: string;

  @ManyToOne({ entity: () => Users })
  creator!: Users;

  @ManyToOne({ entity: () => Users, nullable: true })
  modifier?: Users;

  @ManyToOne({ entity: () => Users, nullable: true })
  archiver?: Users;

  @ManyToMany({
    entity: () => Course,
    joinColumn: "community_id",
    inverseJoinColumn: "course_id",
  })
  course = new Collection<Course>(this);

  @OneToMany(() => Membership, (membership) => membership.community)
  memberships = new Collection<Membership>(this);
}

export enum CommunityType {
  CLASS = "CLASS",
  FREE = "FREE",
}
