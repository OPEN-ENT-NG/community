import * as fs from "fs";
import * as path from "path";

/**
 *
 * @param directory - The directory containing the entity files
 * @description This function renames entity files in the specified directory
 *              by appending ".entity" to the file names and updating their imports.
 *              It also converts the file names to kebab-case.
 * @example
 * // Rename entity files in the "src/entities" directory
 * renameEntityFiles("src/entities");
 * @returns {void}
 * @throws {Error} If the directory does not exist or if there is an error during renaming
 */
export function renameEntityFiles(directory: string): void {
  // Check if the directory exists
  const files = fs.readdirSync(directory);
  // Check if the directory is empty
  files.forEach((file) => {
    // Check if the file is a TypeScript file and does not already contain ".entity."
    if (file.endsWith(".ts") && !file.includes(".entity.")) {
      // Check if the file name is in camelCase
      const kebabName = file
        .replace(/\.ts$/, "")
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .toLowerCase();
      // Build the new file name
      const newFileName = `${kebabName}.entity.ts`;
      const oldPath = path.join(directory, file);
      const newPath = path.join(directory, newFileName);
      // Rename the file
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${file} -> ${newFileName}`);
      // Update the imports in the file
      let content = fs.readFileSync(newPath, "utf8");

      files.forEach((otherFile) => {
        // Check if the other file is a TypeScript file and is not the same file
        if (otherFile.endsWith(".ts") && otherFile !== file) {
          // Replace the import statement in the current file
          const otherName = otherFile.replace(/\.ts$/, "");
          const otherKebabName = otherName
            .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
            .toLowerCase();
          // Replace the import statement in the current file
          content = content.replace(
            new RegExp(`from ['"]\\.\\/${otherName}['"]`, "g"),
            `from './${otherKebabName}.entity'`,
          );
        }
      });
      // Write the updated content back to the file
      fs.writeFileSync(newPath, content, "utf8");
    }
  });
}
