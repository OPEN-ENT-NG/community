import { join } from "path";

/**
 * Returns the path to static assets based on execution mode (development or production)
 * @returns The absolute path to static assets
 */
export function getStaticAssetsPath(): string {
  // Check if we're running in development mode
  const isDevelopmentMode = process.env.DEV === "true";

  // Define path to frontend assets in node_modules (for development)
  const developmentAssetsPath = join(
    process.cwd(),
    "node_modules",
    "@edifice.io",
    "community-frontend",
    "dist",
    "public",
  );

  // Define path to public directory (for production)
  const productionAssetsPath = join(process.cwd(), "public");
  // Return appropriate path based on environment
  return isDevelopmentMode ? developmentAssetsPath : productionAssetsPath;
}
