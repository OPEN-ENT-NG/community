import { Migration } from "@mikro-orm/migrations";
import { executeScript } from "./utils/helpers";

export class Migration01 extends Migration {
  async up(): Promise<void> {
    await executeScript(this, "01-init.sql");
  }

  async down(): Promise<void> {
    await executeScript(this, "01-rollback.sql");
  }
}
