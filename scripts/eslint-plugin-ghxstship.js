/**
 * ESLint Plugin for GHXSTSHIP Design System Enforcement
 * Contemporary Minimal Pop Art Aesthetic - Zero Tolerance
 */

module.exports = {
  rules: {
    'no-raw-typography': {
      meta: {
        type: 'error',
        docs: {
          description: 'Enforce use of Typography components instead of raw HTML elements with className',
          category: 'Design System',
          recommended: true,
        },
        messages: {
          noRawH1: 'Use <HeroTitle> or <SectionHeader> instead of <h1> with className',
          noRawH2: 'Use <SectionHeader> instead of <h2> with className',
          noRawH3: 'Use <SubsectionHeader> instead of <h3> with className',
          noRawH4: 'Use <CardTitle> instead of <h4> with className',
          noRawH5: 'Use Typography component instead of <h5> with className',
          noRawH6: 'Use Typography component instead of <h6> with className',
          noRawP: 'Use <BodyText> or <BodyTextSmall> instead of <p> with className',
        },
        fixable: 'code',
      },
      create(context) {
        return {
          JSXElement(node) {
            const elementName = node.openingElement.name.name;
            const hasClassName = node.openingElement.attributes.some(
              attr => attr.name && attr.name.name === 'className'
            );

            if (hasClassName) {
              const messageMap = {
                h1: 'noRawH1',
                h2: 'noRawH2',
                h3: 'noRawH3',
                h4: 'noRawH4',
                h5: 'noRawH5',
                h6: 'noRawH6',
                p: 'noRawP',
              };

              if (messageMap[elementName]) {
                context.report({
                  node,
                  messageId: messageMap[elementName],
                });
              }
            }
          },
        };
      },
    },

    'no-forbidden-colors': {
      meta: {
        type: 'error',
        docs: {
          description: 'Enforce monochromatic color palette (black, white, greyscale only)',
          category: 'Design System',
          recommended: true,
        },
        messages: {
          forbiddenColor: 'Forbidden color "{{color}}". GHXSTSHIP uses ONLY black, white, and greyscale (grey-100 through grey-900).',
        },
      },
      create(context) {
        const forbiddenColorPatterns = [
          /bg-(?:red|green|blue|yellow|purple|pink|indigo|cyan|teal|orange|lime|emerald|sky|violet|fuchsia|rose)-/,
          /text-(?:red|green|blue|yellow|purple|pink|indigo|cyan|teal|orange|lime|emerald|sky|violet|fuchsia|rose)-/,
          /border-(?:red|green|blue|yellow|purple|pink|indigo|cyan|teal|orange|lime|emerald|sky|violet|fuchsia|rose)-/,
        ];

        return {
          JSXAttribute(node) {
            if (node.name.name === 'className' && node.value) {
              const classNameValue = node.value.value || '';
              
              forbiddenColorPatterns.forEach(pattern => {
                const match = classNameValue.match(pattern);
                if (match) {
                  // Allow platform gradient text classes
                  if (!classNameValue.includes('text-gradient')) {
                    context.report({
                      node,
                      messageId: 'forbiddenColor',
                      data: { color: match[0] },
                    });
                  }
                }
              });
            }
          },
        };
      },
    },

    'no-custom-card-styling': {
      meta: {
        type: 'error',
        docs: {
          description: 'Enforce use of Card component instead of custom styling',
          category: 'Design System',
          recommended: true,
        },
        messages: {
          useCardComponent: 'Use <Card variant="{{variant}}"> instead of custom card styling',
        },
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name === 'className' && node.value) {
              const classNameValue = node.value.value || '';
              
              // Detect common custom card patterns
              if (
                classNameValue.includes('bg-gray-900/50') ||
                (classNameValue.includes('border-gray-800') && classNameValue.includes('rounded'))
              ) {
                context.report({
                  node,
                  messageId: 'useCardComponent',
                  data: { variant: 'atlvs|compvss|gvteway' },
                });
              }
            }
          },
        };
      },
    },

    'no-soft-shadows': {
      meta: {
        type: 'error',
        docs: {
          description: 'Enforce hard geometric shadows instead of soft shadows',
          category: 'Design System',
          recommended: true,
        },
        messages: {
          noSoftShadow: 'Use hard geometric shadows (shadow-hard, shadow-hard-inverse) instead of soft shadows',
        },
      },
      create(context) {
        const softShadowPatterns = [
          /shadow-(?:sm|md|lg|xl|2xl)/,
        ];

        return {
          JSXAttribute(node) {
            if (node.name.name === 'className' && node.value) {
              const classNameValue = node.value.value || '';
              
              softShadowPatterns.forEach(pattern => {
                if (pattern.test(classNameValue)) {
                  context.report({
                    node,
                    messageId: 'noSoftShadow',
                  });
                }
              });
            }
          },
        };
      },
    },

    'no-raw-font-classes': {
      meta: {
        type: 'error',
        docs: {
          description: 'Enforce use of Typography components instead of raw font classes',
          category: 'Design System',
          recommended: true,
        },
        messages: {
          noRawFont: 'Use Typography components instead of raw font classes (font-anton, font-bebas, etc.)',
        },
      },
      create(context) {
        return {
          JSXAttribute(node) {
            if (node.name.name === 'className' && node.value) {
              const classNameValue = node.value.value || '';
              
              if (
                /font-(?:anton|bebas|oswald|share-tech|share-tech-mono)/.test(classNameValue) ||
                /text-(?:hero|display|h[1-6]|body|caption|meta)/.test(classNameValue)
              ) {
                // Allow in Typography component files
                const filename = context.getFilename();
                if (!filename.includes('/components/atoms/Typography')) {
                  context.report({
                    node,
                    messageId: 'noRawFont',
                  });
                }
              }
            }
          },
        };
      },
    },
  },
};
