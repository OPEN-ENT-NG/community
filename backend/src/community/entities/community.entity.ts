import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "community", schema: "community" })
export class Community {
  @PrimaryKey()
  id!: number; // Auto-incremented primary key

  @Property({ length: 100 })
  title!: string; // String with max length of 100

  @Property({ length: 1000 })
  description!: string; // String with max length of 1000

  @Property({ default: "now()" })
  createdAt: Date = new Date(); // Automatically set the creation date

  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date; // Automatically update on changes
}
