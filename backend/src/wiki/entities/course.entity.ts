import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity({ schema: "community" })
export class Course {
  @PrimaryKey()
  id!: string;
}
