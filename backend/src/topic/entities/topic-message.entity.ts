import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Topic } from "@app/topic/entities/topic.entity";
import { Users } from "@app/common/entities/users.entity";

@Entity({ schema: "community" })
export class TopicMessage {
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

  @ManyToOne({ entity: () => Topic, index: "idx_topic_message_topic_id" })
  topic!: Topic;
}
