import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { EntNatsServiceClient } from "@edifice.io/edifice-ent-client";
import { Logger } from "nestjs-pino";

/**
 * Service responsible for all directory integration operations
 */
@Injectable()
export class DirectoryIntegrationService {
  constructor(
    private readonly entServiceClient: EntNatsServiceClient,
    private readonly logger: Logger,
  ) {}

  /**
   * Generate an external ID for directory integration with proper prefix
   * @param entityType Type of entity (COMMUNITY, etc.)
   * @param entityId The entity ID
   * @returns Formatted external ID string
   */
  public generateExternalId(
    entityType: string,
    entityId: number | bigint,
  ): string {
    return `${entityType}_${entityId}`;
  }

  /**
   * Create a new directory group
   * @param externalId The external ID for the group
   * @param name The name of the group
   * @returns ID of the created group
   */
  public async createGroup(externalId: string, name: string): Promise<string> {
    try {
      // Call the NATS service to create a group in the directory
      const response = await this.entServiceClient.directoryGroupManualCreate({
        externalId,
        name,
      });

      if (!response.id) {
        throw new Error("directory.group.create.error");
      }

      this.logger.log(`Directory group created successfully: ${externalId}`);
      return response.id;
    } catch (error) {
      this.logger.error(`Error creating directory group ${externalId}:`, error);
      throw new InternalServerErrorException("directory.group.create.error");
    }
  }

  /**
   * Update an existing directory group
   * @param externalId The external ID of the group to update
   * @param name The new name for the group
   */
  public async updateGroup(externalId: string, name: string): Promise<void> {
    try {
      // Call the NATS service to update the group in the directory
      await this.entServiceClient.directoryGroupManualUpdate({
        externalId,
        name,
      });

      this.logger.log(`Directory group updated successfully: ${externalId}`);
    } catch (error) {
      this.logger.error(`Error updating directory group ${externalId}:`, error);
      throw new InternalServerErrorException("directory.group.update.error");
    }
  }

  /**
   * Delete a directory group
   * @param externalId The external ID of the group to delete
   * @param suppressErrors If true, errors will be logged but not thrown
   */
  public async deleteGroup(
    externalId: string,
    suppressErrors: boolean = false,
  ): Promise<void> {
    try {
      // Call the NATS service to delete the group from directory
      await this.entServiceClient.directoryGroupManualDelete({
        externalId,
      });

      this.logger.log(`Directory group deleted successfully: ${externalId}`);
    } catch (error) {
      this.logger.error(`Error deleting directory group ${externalId}:`, error);
      if (!suppressErrors) {
        throw new InternalServerErrorException("directory.group.delete.error");
      }
    }
  }
}
