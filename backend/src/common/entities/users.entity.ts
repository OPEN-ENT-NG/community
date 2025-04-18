import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity({ schema: "community" })
export class Users {
  @PrimaryKey()
  id!: bigint;
}
