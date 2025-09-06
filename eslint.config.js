// eslint.config.js (versão incrementada)
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";
import reactRf from "eslint-plugin-react-refresh";
import imprt from "eslint-plugin-import";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default tseslint.config(
	{ ignores: ["dist", "build", "coverage", "e2e-results", "test-results", "lighthouse-results"] },
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2020,
			sourceType: "module",
			globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
		},
		plugins: {
			react, // ⬅️ JSX lint
			"react-hooks": hooks,
			"jsx-a11y": a11y,
			"import": imprt,
			"react-refresh": reactRf,
		},
		rules: {
			...js.configs.recommended.rules,
			...tseslint.configs.recommended.rules,
			...hooks.configs.recommended.rules,
			...a11y.configs.recommended.rules,

			/* extras úteis */
			"react/jsx-key": "error",
			"import/order": ["error", { "newlines-between": "always" }],
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			'no-restricted-imports': [
			'error',
			{
				paths: [
				{
					name: 'lucide-react',
					message:
					'N’importe pas depuis "lucide-react" (racine). Utilise les sous-imports icône: "lucide-react/dist/esm/icons/<name>".',
				},
				],
			},
			],
		},
		settings: { react: { version: "detect" } },
	},
);
