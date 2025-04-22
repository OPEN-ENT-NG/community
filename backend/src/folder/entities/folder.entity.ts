import {
  Entity,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Community } from "@app/community/entities/community.entity";
import { Users } from "@app/common/entities/users.entity";

@Entity({ schema: "community" })
export class Folder {
  @PrimaryKey()
  id!: bigint;

  @Property()
  name!: string;

  @Property()
  creationDate!: Date;

  @Property({ nullable: true })
  modificationDate?: Date;

  @Property({ type: "boolean" })
  isRoot: boolean & Opt = false;

  @ManyToOne({ entity: () => Users })
  creator!: Users;

  @ManyToOne({ entity: () => Users, nullable: true })
  modifier?: Users;

  @ManyToOne({
    entity: () => Folder,
    nullable: true,
    index: "idx_folder_parent_id",
  })
  parent?: Folder;

  @ManyToOne({ entity: () => Community, index: "idx_folder_community_id" })
  community!: Community;
}
