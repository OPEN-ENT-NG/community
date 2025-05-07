import { Migration } from "@mikro-orm/migrations";
import * as fs from "fs";
import * as path from "path";

export async function executeScript(
  self: Migration,
  script: string,
): Promise<void> {
  try {
    const sqlScript = fs.readFileSync(
      path.join(process.cwd(), "sql", script),
      "utf8",
    );
    await self.execute(sqlScript);
  } catch (error) {
    console.error(`Error while migrating ${script}:`, error);
    throw error;
  }
}
