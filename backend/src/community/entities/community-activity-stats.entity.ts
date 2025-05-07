import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ schema: "community", tableName: "community_activity_stats" })
export class CommunityActivityStats {
  @PrimaryKey()
  communityId!: number;

  @Property({ fieldName: "last_announcement_update_date", nullable: true })
  lastAnnouncementUpdateDate?: Date;

  @Property({ fieldName: "last_resource_update_date", nullable: true })
  lastResourceUpdateDate?: Date;

  @Property({ fieldName: "last_wiki_update_date", nullable: true })
  lastWikiUpdateDate?: Date;

  @Property({ fieldName: "last_discussion_update_date", nullable: true })
  lastDiscussionUpdateDate?: Date;
}
