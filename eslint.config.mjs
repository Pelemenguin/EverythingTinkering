import js from "@eslint/js";
import { defineConfig } from "eslint/config";


export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], rules:
            {
                "semi": ["error", "always"],
                "no-extra-semi": "error",
                "no-unused-vars": [
                    "warn",
                    {
                        "argsIgnorePattern": "^_"
                    }
                ]
            }
    },
    { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
]);
