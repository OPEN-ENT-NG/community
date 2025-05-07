import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ schema: "community", tableName: "community_stats" })
export class CommunityStats {
  @PrimaryKey()
  communityId!: number;

  @Property()
  totalMembers!: number;

  @Property({ fieldName: "accepted_members" })
  acceptedMembers!: number;

  @Property({ fieldName: "total_admins" })
  totalAdmins!: number;

  @Property({ fieldName: "accepted_admins" })
  acceptedAdmins!: number;
}
