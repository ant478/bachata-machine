import js from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

const commonPlugins = {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    prettier,
};

const commonRules = {
    ...reactHooks.configs.recommended.rules,
    ...reactRefresh.configs.vite.rules,
    'react-hooks/exhaustive-deps': 'error',
    'prettier/prettier': 'error',
};

export default defineConfig([
    globalIgnores(['dist', 'node_modules']),
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: commonPlugins,
        rules: {
            ...js.configs.recommended.rules,
            ...commonRules,
        },
    },
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsEslint.parser,
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: process.cwd(),
                sourceType: 'module',
            },
        },
        plugins: {
            ...commonPlugins,
            '@typescript-eslint': tsEslint.plugin,
        },
        rules: {
            ...tsEslint.configs.recommendedTypeChecked.rules,
            ...commonRules,
        },
    },
]);
