// eslint.config.js
import js            from '@eslint/js'
import globals       from 'globals'
import reactHooks    from 'eslint-plugin-react-hooks'
import reactRefresh  from 'eslint-plugin-react-refresh'
import tseslint      from 'typescript-eslint'
import pluginImport  from 'eslint-plugin-import'   // import rules only

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended
    ],

    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser
    },

    plugins: {
      import: pluginImport,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },

    /* tell eslint-plugin-import to use the TS resolver */
    settings: {
      'import/resolver': {
        typescript: {}          // ← just the package name, no import needed
      }
    },

    rules: {
      /* React rules */
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],

      /* Import rules */
      'import/no-named-as-default': 'error',
      'import/no-unresolved': 'error',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index'
          ],
          'newlines-between': 'always'
        }
      ]
    }
  }
)
