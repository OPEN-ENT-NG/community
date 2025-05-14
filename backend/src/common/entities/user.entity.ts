import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ tableName: "user", schema: "community" })
export class User {
  @PrimaryKey()
  id!: bigint;

  @Property({ columnType: "uuid", unique: true })
  @ApiProperty({
    description: "Unique identifier for the user in the ENT system",
  })
  entId!: string;

  @Property({ nullable: true })
  @ApiProperty({ description: "Display name of the user shown in the UI" })
  displayName?: string;
}
