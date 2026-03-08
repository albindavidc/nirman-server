// eslint.config.mjs
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '*.js'] }, // add your ignores

  pluginJs.configs.recommended,

  ...tseslint.configs.recommended, // ← spreads the recommended TS rules
  ...tseslint.configs.stylistic, // optional: stylistic rules

  // Prettier integration (must come after TS rules)
  pluginPrettierRecommended,
  eslintConfigPrettier, // turns off conflicting rules — must be last!

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // if using Jest
      },
      parserOptions: {
        project: true, // enables project: true for type-aware rules (needs tsconfig.json)
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      '@typescript-eslint/no-unsafe-assignment': 'warn',
    },
  },
);
