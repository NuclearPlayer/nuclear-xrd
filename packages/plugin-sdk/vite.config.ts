/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dts from "vite-plugin-dts";

export default defineConfig(({ command, mode }) => {
  const isProduction = command === "build";
  const isNpmBuild = mode === "npm";

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(isProduction
        ? [
            dts({
              insertTypesEntry: true,
              copyDtsFiles: false,
              exclude: ["**/*.test.ts", "**/*.test.tsx"],
            }),
          ]
        : []),
    ],
    ...(isProduction && {
      build: {
        lib: {
          entry: "src/index.ts",
          name: "NuclearPluginSDK",
          formats: ["es"],
          fileName: "index",
        },
        rollupOptions: {
          external: isNpmBuild
            ? ["react", "react-dom"]
            : ["react", "react-dom", "@nuclear/ui"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "@nuclear/ui": "NuclearUI",
            },
          },
        },
      },
    }),
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
    },
  };
});
