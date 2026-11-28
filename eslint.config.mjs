import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const eslintConfig = defineConfig([
  ...tseslint.configs.recommended,
  globalIgnores([
    'dist/**',
    '.tanstack/**',
    'src/routeTree.gen.ts',
    'out/**',
    'build/**',
    '.source/**',
  ]),
  {
    files: ['src/**/*.{ts,tsx}', 'lib/**/*.ts'],
    languageOptions: { parserOptions: { projectService: true } },
    rules: { '@typescript-eslint/no-floating-promises': 'error' },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]);

export default eslintConfig;
