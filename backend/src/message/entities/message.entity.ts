import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Community } from "@app/community/entities/community.entity";
import { User } from "@app/common/entities/user.entity";

@Entity({ schema: "community" })
export class Message {
  @PrimaryKey()
  id!: bigint;

  @Property({ type: "text" })
  content!: string;

  @Property()
  publicationDate!: Date;

  @ManyToOne({ entity: () => User })
  author!: User;

  @ManyToOne({ entity: () => Community })
  community!: Community;
}
