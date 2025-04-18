#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import * as JSON5 from "json5";
import { register } from "tsconfig-paths";
import { MikroOrmModuleOptions } from "@mikro-orm/nestjs";
import { renameEntityFiles } from "../utils/entity-naming.utils";
import { GenerateOptions, MikroORM } from "@mikro-orm/core";
import { mikroOrmConfig } from "../config";
import { bold, green, red, yellow, blue, cyan, magenta } from "kleur";

/**
 * Logger utility with emoji support and colored output
 */
const logger = {
  info: (message: string) => console.log(`${blue("ℹ️")} ${message}`),
  success: (message: string) =>
    console.log(`${green("✅")} ${bold(green(message))}`),
  warning: (message: string) =>
    console.log(`${yellow("⚠️")} ${yellow(message)}`),
  error: (message: string) => console.log(`${red("❌")} ${bold(red(message))}`),
  step: (message: string) => console.log(`${cyan("🔄")} ${cyan(message)}`),
  fileOp: (message: string) => console.log(`${magenta("📄")} ${message}`),
  dirOp: (message: string) => console.log(`${yellow("📁")} ${message}`),
  config: (message: string, data?: any) => {
    console.log(`${blue("🔧")} ${blue(message)}`);
    if (data)
      console.log(
        `   ${JSON.stringify(data, null, 2).split("\n").join("\n   ")}`,
      );
  },
  separator: () =>
    console.log(
      bold(
        cyan("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
      ),
    ),
  banner: (title: string) => {
    console.log("\n");
    logger.separator();
    console.log(bold(cyan(`🚀 ${title.toUpperCase()}`)));
    logger.separator();
  },
};

// Register TypeScript path mappings at the beginning of the file
function registerTsConfigPaths() {
  try {
    const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
    logger.step(`Loading TypeScript path mappings from: ${bold(tsconfigPath)}`);

    const tsconfig: {
      compilerOptions: {
        baseUrl?: string;
        paths?: Record<string, string[]>;
      };
    } = JSON5.parse(fs.readFileSync(tsconfigPath, "utf8"));

    register({
      baseUrl: tsconfig.compilerOptions.baseUrl || ".",
      paths: tsconfig.compilerOptions.paths || {},
    });

    logger.success("TypeScript path mappings registered successfully");
  } catch (error) {
    logger.warning("Failed to register TypeScript path mappings");
    logger.error(`${error}`);
    logger.warning("Alias imports might not work correctly");
  }
}

registerTsConfigPaths();

/**
 * Parse command line arguments into a key-value object
 * @param args - Command line arguments array
 * @returns Object containing parsed arguments
 */
function parseArguments(args: string[]): Record<string, string> {
  const result: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith("--")) {
      const parts = arg.substring(2).split("=");
      if (parts.length === 2) {
        result[parts[0]] = parts[1];
      } else if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        result[arg.substring(2)] = args[i + 1];
        i++;
      }
    }
  }

  return result;
}

/**
 * Validate required arguments are present
 * @param args - Parsed arguments object
 * @param required - Array of required argument names
 * @throws Error if any required argument is missing
 */
function validateRequiredArgs(
  args: Record<string, string>,
  required: string[],
): void {
  const missing = required.filter((arg) => !(arg in args));

  if (missing.length > 0) {
    throw new Error(`Missing required arguments: ${missing.join(", ")}`);
  }
}

/**
 * Clean directory by removing all files and optionally the directory itself
 * @param directory - Directory path to clean
 * @param removeDir - Whether to remove the directory after cleaning
 */
function cleanDirectory(directory: string, removeDir = true): void {
  if (!fs.existsSync(directory)) {
    return;
  }

  logger.dirOp(`Cleaning directory: ${bold(directory)}`);

  // Read all files in the directory
  const files = fs.readdirSync(directory);

  // Delete each file
  for (const file of files) {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      // Recursively clean subdirectories
      cleanDirectory(filePath, true);
    } else {
      // Remove file
      fs.unlinkSync(filePath);
    }
  }

  // Remove the directory itself if requested
  if (removeDir) {
    logger.dirOp(`Removing directory: ${bold(directory)}`);
    fs.rmdirSync(directory);
  }
}

/**
 * Main function to generate entities based on command line arguments
 */
async function generateEntities(): Promise<void> {
  logger.banner("Entity Generation Tool");

  // Parse command line arguments
  const args = parseArguments(process.argv.slice(2));

  // Validate required arguments - only schema is truly required
  validateRequiredArgs(args, ["schema"]);

  // Determine paths:
  logger.info(`Schema: ${bold(args.schema)}`);

  // 1. tempDir = where entities are initially generated
  // 2. targetDir = final destination when no mapping is used
  const tempDir = args["temp-dir"] || "./src/temp";
  const targetDir = args.path || "./src/entities";
  const keepTemp = args["keep-temp"] === "true";

  // Clean temporary directory before generation
  if (fs.existsSync(tempDir)) {
    cleanDirectory(tempDir);
  } else {
    fs.mkdirSync(tempDir, { recursive: true });
    logger.dirOp(`Created temporary directory: ${bold(tempDir)}`);
  }

  // Generation path is always the temp directory
  const generationPath = tempDir;

  // Check for mapping configuration
  const mappingConfigPath =
    args["mapping-config"] || "./src/config/entity-mapping.config.json";
  const shouldDistribute = fs.existsSync(mappingConfigPath);

  // Load ORM configuration
  logger.step("Preparing database connection...");
  const config: MikroOrmModuleOptions = mikroOrmConfig;

  // Critical configuration for entity generation
  config.discovery = {
    warnWhenNoEntities: false,
    requireEntitiesArray: false,
    alwaysAnalyseProperties: true,
  };

  // Disable auto-loading of entities
  config.autoLoadEntities = false;
  config.entities = [];
  config.entitiesTs = [];

  // Initialize MikroORM with the loaded config
  const orm = await MikroORM.init(config);
  logger.success("Database connection established");

  try {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(generationPath)) {
      fs.mkdirSync(generationPath, { recursive: true });
      logger.dirOp(`Created directory: ${bold(generationPath)}`);
    }

    logger.step(`Generating entities from schema ${bold(args.schema)}...`);
    const generator = orm.getEntityGenerator();

    const options: GenerateOptions = {
      path: generationPath,
      schema: args.schema,
      save: true,
    };

    const files = await generator.generate(options);
    logger.success(
      `Generated ${bold(String(files.length))} entity files in ${bold(generationPath)}`,
    );

    // Rename the generated files according to conventions
    logger.step(`Renaming entity files to follow NestJS conventions...`);
    renameEntityFiles(generationPath);
    logger.success("Entity files renamed successfully");

    // Distribute files if mapping config is provided/exists
    if (shouldDistribute) {
      logger.step(
        `Distributing entity files to modules using mapping from: ${bold(mappingConfigPath)}`,
      );
      distributeEntityFiles(generationPath, mappingConfigPath);
    } else {
      // If not distributing, move all files from temp to target
      logger.step(
        `Moving entity files from ${bold(generationPath)} to ${bold(targetDir)}`,
      );
      moveFiles(generationPath, targetDir);
      logger.success(`All entity files moved to ${bold(targetDir)}`);
    }

    // Clean up temporary directory after successful processing
    if (!keepTemp) {
      logger.step(`Cleaning up temporary directory: ${bold(generationPath)}`);
      cleanDirectory(generationPath, true);
      logger.success("Temporary files cleaned up");
    } else {
      logger.info(
        `Keeping temporary directory for inspection: ${bold(generationPath)}`,
      );
    }

    logger.separator();
    logger.success("Entity generation completed successfully!");
    logger.separator();
  } catch (error) {
    logger.error("Error generating entities:");
    console.error(error);
    process.exit(1);
  } finally {
    await orm.close();
    logger.info("Database connection closed");
  }
}

/**
 * Move all entity files from source to target directory
 */
function moveFiles(sourceDir: string, targetDir: string): void {
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    logger.dirOp(`Created directory: ${bold(targetDir)}`);
  }

  // Move all entity files
  const files = fs.readdirSync(sourceDir);
  let movedCount = 0;

  files.forEach((file) => {
    if (file.endsWith(".entity.ts")) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      fs.renameSync(sourcePath, targetPath);
      logger.fileOp(`Moved: ${file} → ${targetDir}`);
      movedCount++;
    }
  });

  logger.success(`Moved ${bold(String(movedCount))} entity files`);
}

/**
 * Distribute entity files to appropriate module directories
 */
function distributeEntityFiles(
  sourcePath: string,
  mappingConfigPath: string,
): void {
  try {
    logger.step(`Loading entity mapping from: ${bold(mappingConfigPath)}`);

    // Read and parse the mapping configuration
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const moduleMapping: Record<string, string> = JSON.parse(
      fs.readFileSync(mappingConfigPath, "utf8"),
    );

    logger.config("Entity to module mapping loaded:", moduleMapping);

    // Get all entity files from source directory
    const files = fs.readdirSync(sourcePath);

    // Map to track which modules need to be created
    const modulesToCreate = new Set<string>();

    // First pass: determine which module directories need to be created
    files.forEach((file) => {
      if (!file.endsWith(".entity.ts")) return;

      // Extract base name without extension
      const baseName = file.replace(".entity.ts", "");

      // Find matching module
      let targetModule = "common"; // Default module
      for (const [prefix, module] of Object.entries(moduleMapping)) {
        if (baseName === prefix || baseName.startsWith(`${prefix}-`)) {
          targetModule = module;
          break;
        }
      }

      modulesToCreate.add(targetModule);
    });

    // Create module directories if they don't exist
    modulesToCreate.forEach((module) => {
      const moduleDir = path.join(process.cwd(), `src/${module}/entities`);
      if (!fs.existsSync(moduleDir)) {
        fs.mkdirSync(moduleDir, { recursive: true });
        logger.dirOp(`Created module directory: ${bold(moduleDir)}`);
      }
    });

    // Second pass: move files to appropriate modules and update imports
    let filesMoved = 0;
    files.forEach((file) => {
      if (!file.endsWith(".entity.ts")) return;

      // Extract base name without extension
      const baseName = file.replace(".entity.ts", "");

      // Find target module
      let targetModule = "common"; // Default module
      for (const [prefix, module] of Object.entries(moduleMapping)) {
        if (baseName === prefix || baseName.startsWith(`${prefix}-`)) {
          targetModule = module;
          break;
        }
      }

      const sourceFilePath = path.join(sourcePath, file);
      const targetPath = path.join(
        process.cwd(),
        `src/${targetModule}/entities`,
        file,
      );

      // Read file content
      let content = fs.readFileSync(sourceFilePath, "utf8");

      // Update imports to point to the new locations
      Object.entries(moduleMapping).forEach(([entityPrefix, module]) => {
        const entityRegex = new RegExp(
          `import \\{ (\\w+) \\} from ["'\`]\\.\\/(${entityPrefix}.*?)\\.entity["'\`]`,
          "g",
        );
        content = content.replace(
          entityRegex,
          (match, className, importPath) => {
            return `import { ${className} } from "@app/${module}/entities/${importPath}.entity"`;
          },
        );
      });

      // Write to target directory
      fs.writeFileSync(targetPath, content);
      logger.fileOp(`Moved: ${file} → ${targetModule}/entities/`);
      filesMoved++;

      // Remove from source directory
      fs.unlinkSync(sourceFilePath);
    });

    logger.success(
      `Distributed ${bold(String(filesMoved))} entity files across ${bold(String(modulesToCreate.size))} modules`,
    );
  } catch (error) {
    logger.error("Error distributing entity files:");
    console.error(error);
    throw error;
  }
}

/**
 * Display usage information
 */
function displayUsage(): void {
  console.log(`
Usage: generate-entities --schema <schema-name> [options]

Required arguments:
  --schema        Database schema name to use for entity generation

Optional arguments:
  --path          Target directory when not distributing entities (default: ./src/entities)
  --temp-dir      Temporary directory for initial generation (default: ./src/temp/entities)
  --mapping-config Path to entity-module mapping file (default: ./src/config/entity-mapping.config.json)
  --keep-temp     Keep temporary directory after generation (default: false)

Examples:
  generate-entities --schema community
  generate-entities --schema community --temp-dir ./src/temp --path ./src/entities
  generate-entities --schema community --mapping-config ./src/config/entity-mapping.config.json
  generate-entities --schema community --keep-temp true
`);
}

// Execute script or show usage if no arguments provided
if (process.argv.length <= 2) {
  displayUsage();
} else {
  generateEntities().catch((error) => {
    logger.error("Fatal error occurred during entity generation:");
    console.error(error);
    process.exit(1);
  });
}
