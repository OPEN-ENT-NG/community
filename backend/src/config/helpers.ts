import { join } from "path";

export function getStaticAssetsPath(): string {
  const isDev = process.env.DEV === "true";
  return isDev
    ? join(
        process.cwd(),
        "node_modules",
        "@edifice.io",
        "community-frontend",
        "dist",
        "public",
      )
    : join(process.cwd(), "public");
}
