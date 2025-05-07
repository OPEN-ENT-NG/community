import { Migration } from "@mikro-orm/migrations";
import { executeScript } from "./utils/helpers";

export class Migration02 extends Migration {
  async up(): Promise<void> {
    await executeScript(this, "02-users.sql");
  }

  async down(): Promise<void> {
    await executeScript(this, "02-rollback.sql");
  }
}
