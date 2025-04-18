import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Community } from "@app/community/entities/community.entity";
import { Users } from "@app/common/entities/users.entity";

@Entity({ schema: "community" })
export class Invitation {
  @PrimaryKey()
  id!: bigint;

  @Property()
  invitationDate!: Date;

  @Property({ nullable: true })
  modificationDate?: Date;

  @Enum({ items: () => InvitationStatus })
  status!: InvitationStatus;

  @ManyToOne({ entity: () => Community, index: "idx_invitation_community_id" })
  community!: Community;

  @ManyToOne({ entity: () => Users, index: "idx_invitation_user_id" })
  user!: Users;
}

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
