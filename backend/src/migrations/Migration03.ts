import { Migration } from "@mikro-orm/migrations";
import { executeScript } from "./utils/helpers";

/**
 * Migration to add ON DELETE CASCADE constraints
 */
export class Migration03 extends Migration {
  async up(): Promise<void> {
    await executeScript(this, "03-cascade-delete.sql");
  }

  async down(): Promise<void> {
    await executeScript(this, "03-rollback.sql");
  }
}
