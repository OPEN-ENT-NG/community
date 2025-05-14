import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  type Opt,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Community } from "@app/community/entities/community.entity";
import { Folder } from "@app/folder/entities/folder.entity";
import { User } from "@app/common/entities/user.entity";

@Entity({ schema: "community" })
export class Resource {
  @PrimaryKey()
  id!: bigint;

  @Enum({ items: () => ResourceType })
  type!: ResourceType;

  @Property({ length: 1024 })
  url!: string;

  @Property()
  title!: string;

  @Property()
  addedDate!: Date;

  @Property({ type: "boolean" })
  openInNewTab: boolean & Opt = false;

  @Property({ length: 128, nullable: true })
  appName?: string;

  @ManyToOne({ entity: () => User })
  author!: User;

  @ManyToOne({ entity: () => Community, index: "idx_resource_community_id" })
  community!: Community;

  @ManyToMany({
    entity: () => Folder,
    joinColumn: "resource_id",
    inverseJoinColumn: "folder_id",
  })
  folder = new Collection<Folder>(this);
}

export enum ResourceType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  SOUND = "SOUND",
  ENT = "ENT",
  EXTERNAL_LINK = "EXTERNAL_LINK",
}
