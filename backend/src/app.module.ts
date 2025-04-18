import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CoreModule } from "./core";
import { CommunityModule } from "./community/community.module";
import { FolderModule } from "./folder/folder.module";
import { AnnouncementModule } from "./announcement/announcement.module";
import { InvitationModule } from "./invitation/invitation.module";
import { MembershipModule } from "./membership/membership.module";
import { ResourceModule } from "./resource/resource.module";
import { WikiModule } from "./wiki/wiki.module";
import { DiscussionsModule } from "./discussions/discussions.module";

@Module({
  imports: [
    // Centralized core module
    CoreModule,

    // Business modules
    AnnouncementModule,
    CommunityModule,
    DiscussionsModule,
    FolderModule,
    InvitationModule,
    MembershipModule,
    ResourceModule,
    WikiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Use utility method from CoreModule
    CoreModule.configureSessionMiddleware(consumer);
  }
}
