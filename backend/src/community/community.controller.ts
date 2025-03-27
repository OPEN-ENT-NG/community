import { Controller } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { RequestLogger } from "src/logger/request-logger.service";

@Controller("/api/community")
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly logger: RequestLogger,
  ) {}
}
