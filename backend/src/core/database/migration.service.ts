import { MikroORM } from "@mikro-orm/core";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Service class for managing database migrations
 * Provides methods to run migrations automatically or on-demand
 */
@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    private readonly orm: MikroORM,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Run pending migrations if enabled in configuration
   * @returns {Promise<void>}
   */
  async runMigrations(): Promise<void> {
    // Check if migrations should run based on environment configuration
    const shouldRunMigrations = this.configService.get<boolean>(
      "run_migrations",
      true,
    );

    if (!shouldRunMigrations) {
      this.logger.log("Automatic migrations are disabled. Skipping.");
      return;
    }

    try {
      const migrator = this.orm.getMigrator();
      const pendingMigrations = await migrator.getPendingMigrations();

      if (pendingMigrations.length === 0) {
        this.logger.log("No pending migrations found.");
        return;
      }

      this.logger.log(
        `Running ${pendingMigrations.length} pending migrations...`,
      );

      // Execute all pending migrations
      const migrationsResult = await migrator.up();

      if (migrationsResult.length > 0) {
        const migrationNames = migrationsResult.map((m) => m.name).join(", ");
        this.logger.log(`Successfully executed migrations: ${migrationNames}`);
      } else {
        this.logger.log("No migrations were executed.");
      }
    } catch (error) {
      console.error("Error while running migrations:", error);
      this.logger.error("Failed to run migrations:", error);
      // Throw the error to let the caller decide how to handle it
      throw new Error(`Migration execution failed: ${error}`);
    }
  }

  /**
   * Check database connection and schema status
   * @returns {Promise<boolean>} True if connected and schema exists
   */
  async checkDatabaseStatus(): Promise<boolean> {
    try {
      const connection = this.orm.em.getConnection();
      await connection.execute("SELECT 1");
      this.logger.log("Database connection successful");
      return true;
    } catch (error) {
      this.logger.error("Database connection check failed:", error);
      return false;
    }
  }

  /**
   * Force execution of specific migration by name
   * @param {string} migrationName - Name of migration to run
   * @returns {Promise<void>}
   */
  async runSpecificMigration(migrationName: string): Promise<void> {
    try {
      const migrator = this.orm.getMigrator();
      const migrations = await migrator.getPendingMigrations();

      const targetMigration = migrations.find((m) => m.name === migrationName);

      if (!targetMigration) {
        this.logger.warn(
          `Migration "${migrationName}" not found or already executed`,
        );
        return;
      }

      this.logger.log(`Running specific migration: ${migrationName}`);
      await migrator.up(migrationName);
      this.logger.log(`Migration "${migrationName}" executed successfully`);
    } catch (error) {
      this.logger.error(`Failed to run migration "${migrationName}":`, error);
      throw error;
    }
  }

  /**
   * Revert the last executed migration
   * @returns {Promise<void>}
   */
  async revertLastMigration(): Promise<void> {
    try {
      const migrator = this.orm.getMigrator();
      await migrator.down();
      this.logger.log("Successfully reverted last migration");
    } catch (error) {
      this.logger.error("Failed to revert last migration:", error);
      throw error;
    }
  }
}
