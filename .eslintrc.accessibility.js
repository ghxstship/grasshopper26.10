/**
 * ESLint Accessibility Rules
 * Enforces WCAG 2.2 AAA compliance
 */

module.exports = {
  extends: [
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['jsx-a11y'],
  rules: {
    // ARIA attributes
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error',
    
    // Keyboard accessibility
    'jsx-a11y/interactive-supports-focus': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-static-element-interactions': 'warn',
    
    // Alt text requirements
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    
    // Form accessibility
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/no-autofocus': 'warn',
    
    // Heading hierarchy
    'jsx-a11y/heading-has-content': 'error',
    
    // Anchor accessibility
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    
    // Tab index
    'jsx-a11y/tabindex-no-positive': 'error',
    
    // Media
    'jsx-a11y/media-has-caption': 'warn',
    
    // Scope
    'jsx-a11y/scope': 'error',
  },
};
