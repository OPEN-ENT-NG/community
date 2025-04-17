import { AppModule } from "./app.module";
import { bootstrapUtils } from "./core";

/**
 * Bootstrap the application
 */
async function bootstrap() {
  try {
    console.log("Starting application...");

    // Create the application with standard settings
    const nestApp = await bootstrapUtils.createApp(AppModule, {
      // Override any default options if needed
      // globalPrefix: "api/v1",
    });

    // Start the server
    await bootstrapUtils.startApp(nestApp);
  } catch (error) {
    console.error("Error during bootstrap:", error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error("Error during bootstrap:", error);
  process.exit(1);
});
