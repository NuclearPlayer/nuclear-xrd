import config from "@nuclear/eslint-config";

export default [
  ...config,
  {
    ignores: ["dist/**/*"],
  },
];
