if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
  process.exit(0);
}
const _husky = (await import("husky")).default;
