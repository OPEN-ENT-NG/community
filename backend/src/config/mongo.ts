import { ConfigService } from "@nestjs/config";
import * as mongoose from "mongoose";
export default (configService: ConfigService) => {
  mongoose.set("debug", true);
  return {
    uri: configService.get<string>("db.mongo.url"),
    retryAttempts: 0,
    retryDelay: 10,
  };
};
