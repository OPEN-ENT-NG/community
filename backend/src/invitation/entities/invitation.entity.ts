import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Community } from "@app/community/entities/community.entity";
import { User } from "@app/common/entities/user.entity";

@Entity({ schema: "community", tableName: "invitation" })
export class Invitation {
  @PrimaryKey()
  id!: bigint;

  @Property()
  invitationDate!: Date;

  @Property({ nullable: true })
  modificationDate?: Date;

  @Enum(() => InvitationStatus)
  status!: InvitationStatus;

  @ManyToOne(() => Community, {
    deleteRule: "cascade",
    joinColumn: "community_id",
  })
  community!: Community;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => User)
  inviter!: User;
}

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
