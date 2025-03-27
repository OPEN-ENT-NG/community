import { Module } from "@nestjs/common";
import { RequestLogger } from "./request-logger.service";

@Module({
  providers: [RequestLogger],
  exports: [RequestLogger],
})
export class LoggerModule {}
