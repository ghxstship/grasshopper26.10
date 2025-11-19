/**
 * ESLint Configuration for Design System Enforcement
 * ZERO TOLERANCE for design system violations
 * 
 * Add to your main .eslintrc.js:
 * extends: ['./.eslintrc.design-system.js']
 */

module.exports = {
  rules: {
    /**
     * Prohibit hardcoded hex colors
     */
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value=/#[0-9A-Fa-f]{3,8}/]",
        message: '❌ Hardcoded hex colors are not allowed. Use design tokens: var(--color-*) or semantic color classes.',
      },
      {
        selector: "CallExpression[callee.name='rgb']",
        message: '❌ RGB colors are not allowed. Use design tokens: var(--color-*) or semantic color classes.',
      },
      {
        selector: "CallExpression[callee.name='rgba']",
        message: '❌ RGBA colors are not allowed. Use design tokens with opacity: var(--color-*) or semantic color classes.',
      },
      {
        selector: "TemplateLiteral[expressions.length>0] > TemplateElement[value.raw=/#[0-9A-Fa-f]{3,8}/]",
        message: '❌ Hardcoded hex colors in template literals are not allowed. Use design tokens.',
      },
    ],

    /**
     * Prohibit magic numbers (hardcoded spacing/sizing)
     */
    'no-magic-numbers': [
      'warn',
      {
        ignore: [0, 1, -1, 2, 100], // Allow common values
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
        detectObjects: false,
      },
    ],

    /**
     * Accessibility - ARIA attributes
     */
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',

    /**
     * Accessibility - Keyboard navigation
     */
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',

    /**
     * Accessibility - Alt text
     */
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/img-redundant-alt': 'error',

    /**
     * Accessibility - Form labels
     */
    'jsx-a11y/label-has-associated-control': 'error',

    /**
     * Accessibility - Focus management
     */
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/tabindex-no-positive': 'error',

    /**
     * Accessibility - Semantic HTML
     */
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/html-has-lang': 'error',

    /**
     * React best practices
     */
    'react/prop-types': 'off', // Using TypeScript
    'react/react-in-jsx-scope': 'off', // Next.js doesn't require React import
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    /**
     * TypeScript best practices
     */
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },

  /**
   * Custom rules for design system enforcement
   * These would require custom ESLint plugins
   */
  overrides: [
    {
      files: ['**/*.tsx', '**/*.jsx'],
      rules: {
        // Warn about inline styles (should use design tokens)
        'react/forbid-dom-props': [
          'warn',
          {
            forbid: [
              {
                propName: 'style',
                message: 'Avoid inline styles. Use design tokens and className instead.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['**/*.css', '**/*.scss'],
      rules: {
        // CSS-specific rules would go here
        // Requires stylelint for proper CSS linting
      },
    },
  ],

  settings: {
    react: {
      version: 'detect',
    },
  },
};
