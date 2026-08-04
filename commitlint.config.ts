import type { UserConfig } from "@commitlint/types";

const expectedTypes = [
  "feat",
  "fix",
  "chore",
  "ci",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "revert",
  "WIP",
];

const headerPattern = new RegExp(`^(${expectedTypes.join("|")}):\\s(.+)`);

const config: UserConfig = {
  parserPreset: {
    parserOpts: {
      headerPattern,
      headerCorrespondence: ["type", "subject"],
    },
  },
  plugins: [
    {
      rules: {
        "header-match-custom-pattern": (parsed) => {
          const { type, subject } = parsed;
          if (!type || !subject) {
            return [
              false,
              "Header must match pattern: <type>: <description>" +
                `\nType must be one of: ${expectedTypes.join(", ")}`,
            ];
          }
          return [true, ""];
        },
        "type-enum": (parsed) => {
          const { type } = parsed;
          if (type && !expectedTypes.includes(type)) {
            return [false, `Type must be one of: ${expectedTypes.join(", ")}`];
          }
          return [true, ""];
        },
      },
    },
  ],
  rules: {
    "header-match-custom-pattern": [2, "always"], // Usa la regla personalizada
    "type-enum": [2, "always", expectedTypes],
  },
};

export default config;
