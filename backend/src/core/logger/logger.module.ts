import { Module } from "@nestjs/common";
import { RequestLogger } from "./request-logger.service";
import { Logger } from "nestjs-pino";

@Module({
  providers: [RequestLogger, Logger],
  exports: [RequestLogger, Logger],
})
export class LoggerModule {}
