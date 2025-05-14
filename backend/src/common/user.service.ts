import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { Logger } from "nestjs-pino";
import { ENTUserSession } from "@app/core";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: EntityRepository<User>,
    private readonly logger: Logger,
  ) {}

  /**
   * Gets a user from session information
   * @param session Current user session
   * @returns User entity
   */
  async getCurrentUser(session: ENTUserSession): Promise<User> {
    if (!session?.userId) {
      throw new UnauthorizedException("user.session.missing");
    }
    const users = await this.findOrCreateUsersByEntIds([session.userId], {
      [session.userId]: session.username ?? "",
    });
    const user = users.get(session.userId);
    if (!user) {
      throw new NotFoundException("user.not_found");
    }
    return user;
  }

  /**
   * Fetches multiple users by their ENT IDs
   * @param entIds Array of user ENT IDs
   * @returns Map of entId to User entity
   */
  async findUsersByEntIds(entIds: string[]): Promise<Map<string, User>> {
    if (!entIds.length) {
      return new Map();
    }

    const users = await this.usersRepository.find({ entId: { $in: entIds } });
    // Create a map for quick lookups
    const userMap = new Map(users.map((user) => [user.entId, user]));
    // Log missing users
    const missingUserIds = entIds.filter((id) => !userMap.has(id));
    if (missingUserIds.length > 0) {
      this.logger.warn(
        `Some users were not found: ${missingUserIds.join(", ")}`,
      );
    }
    return userMap;
  }

  /**
   * Finds users by their ENT IDs or creates them if they don't exist
   * @param entIds Array of user ENT IDs
   * @param defaultDisplayNames Optional map of display names to use for new users
   * @returns Map of entId to User entity
   */
  async findOrCreateUsersByEntIds(
    entIds: string[],
    defaultDisplayNames: Record<string, string> = {},
  ): Promise<Map<string, User>> {
    if (!entIds.length) {
      return new Map();
    }

    // Find existing users
    const users = await this.usersRepository.find({ entId: { $in: entIds } });
    // Create a map for quick lookups
    const userMap = new Map(users.map((user) => [user.entId, user]));
    // Identify missing users
    const missingEntIds = entIds.filter((id) => !userMap.has(id));
    // If there are missing users, create them
    if (missingEntIds.length > 0) {
      this.logger.log(
        `Creating ${missingEntIds.length} new users from ENT IDs`,
      );

      const newUsers: User[] = [];
      for (const entId of missingEntIds) {
        const newUser = this.usersRepository.create({
          entId,
          displayName: defaultDisplayNames[entId] || ``,
        });
        newUsers.push(newUser);
        userMap.set(entId, newUser);
      }

      // Persist the new users
      await this.usersRepository.upsertMany(newUsers);
      this.logger.log(`Created ${newUsers.length} new users`);
    }

    return userMap;
  }
}
