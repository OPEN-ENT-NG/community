import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Topic } from "@app/topic/entities/topic.entity";
import { User } from "@app/common/entities/user.entity";

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

  @ManyToOne({ entity: () => User })
  author!: User;

  @ManyToOne({ entity: () => Topic, index: "idx_topic_message_topic_id" })
  topic!: Topic;
}
