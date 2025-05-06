import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Community } from "@app/community/entities/community.entity";
import { Users } from "@app/common/entities/users.entity";

@Entity({ tableName: "invitation" })
export class Invitation {
  @PrimaryKey()
  id!: bigint;

  @Property()
  invitationDate!: Date;

  @Property({ nullable: true })
  modificationDate?: Date;

  @Enum(() => InvitationStatus)
  status!: InvitationStatus;

  @ManyToOne(() => Community)
  community!: Community;

  @ManyToOne(() => Users)
  user!: Users;

  @ManyToOne(() => Users)
  inviter!: Users;
}

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
