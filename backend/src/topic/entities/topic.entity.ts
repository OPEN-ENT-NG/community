import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Community } from "@app/community/entities/community.entity";
import { User } from "@app/common/entities/user.entity";

@Entity({ schema: "community" })
export class Topic {
  @PrimaryKey()
  id!: bigint;

  @Property()
  name!: string;

  @Property()
  creationDate!: Date;

  @Property({ type: "boolean" })
  locked: boolean & Opt = false;

  @Property({ type: "boolean" })
  hidden: boolean & Opt = false;

  @Property({ length: 128, nullable: true })
  theme?: string;

  @ManyToOne({ entity: () => User })
  creator!: User;

  @ManyToOne({ entity: () => Community, index: "idx_topic_community_id" })
  community!: Community;
}
