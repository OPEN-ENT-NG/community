import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Community } from "@app/community/entities/community.entity";
import { Users } from "@app/common/entities/users.entity";

@Entity({ schema: "community" })
export class Announcement {
  @PrimaryKey()
  id!: bigint;

  @Property({ type: "text" })
  content!: string;

  @Property()
  publicationDate!: Date;

  @Property({ nullable: true })
  modificationDate?: Date;

  @ManyToOne({ entity: () => Users })
  author!: Users;

  @ManyToOne({ entity: () => Community })
  community!: Community;
}
