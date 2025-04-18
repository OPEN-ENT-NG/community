import { Migration } from "@mikro-orm/migrations";
import * as fs from "fs";
import * as path from "path";

export class Migration20240701000000 extends Migration {
  async up(): Promise<void> {
    try {
      const sqlScript = fs.readFileSync(
        path.join(process.cwd(), "sql", "01-init.sql"),
        "utf8",
      );

      await this.execute(sqlScript);
    } catch (error) {
      console.error("Error while migrating 01-init.sql:", error);
      throw error;
    }
  }

  async down(): Promise<void> {
    // Drop schema

    await this.execute("DROP SCHEMA IF EXISTS community CASCADE");
  }
}
