import config from "@nuclear/eslint-config";

export default [
  ...config,
  {
    ignores: [
      "dist/**/*",
      "build/**/*",
      "node_modules/**/*",
      "**/*.d.ts",
      "**/*.d.ts.map",
      "**/*.js.map",
    ],
  },
];
