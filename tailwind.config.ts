import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Title/H1
        anton: ['var(--font-anton)', 'sans-serif'],
        // H2-H6
        bebas: ['var(--font-bebas-neue)', 'sans-serif'],
        // Subtitle
        oswald: ['var(--font-oswald)', 'sans-serif'],
        // Body
        'share-tech': ['var(--font-share-tech)', 'sans-serif'],
        // Mono
        'share-tech-mono': ['var(--font-share-tech-mono)', 'monospace'],
      },
      fontSize: {
        // Semantic Typography Scale
        'hero': ['var(--font-size-hero)', { lineHeight: 'var(--line-height-hero)', letterSpacing: 'var(--letter-spacing-hero)', fontWeight: 'var(--font-weight-hero)' }],
        'display': ['var(--font-size-display)', { lineHeight: 'var(--line-height-display)', letterSpacing: 'var(--letter-spacing-display)', fontWeight: 'var(--font-weight-display)' }],
        'h1': ['var(--font-size-h1)', { lineHeight: 'var(--line-height-h1)', letterSpacing: 'var(--letter-spacing-h1)', fontWeight: 'var(--font-weight-h1)' }],
        'h2': ['var(--font-size-h2)', { lineHeight: 'var(--line-height-h2)', letterSpacing: 'var(--letter-spacing-h2)', fontWeight: 'var(--font-weight-h2)' }],
        'h3': ['var(--font-size-h3)', { lineHeight: 'var(--line-height-h3)', letterSpacing: 'var(--letter-spacing-h3)', fontWeight: 'var(--font-weight-h3)' }],
        'h4': ['var(--font-size-h4)', { lineHeight: 'var(--line-height-h4)', letterSpacing: 'var(--letter-spacing-h4)', fontWeight: 'var(--font-weight-h4)' }],
        'h5': ['var(--font-size-h5)', { lineHeight: 'var(--line-height-h5)', letterSpacing: 'var(--letter-spacing-h5)', fontWeight: 'var(--font-weight-h5)' }],
        'h6': ['var(--font-size-h6)', { lineHeight: 'var(--line-height-h6)', letterSpacing: 'var(--letter-spacing-h6)', fontWeight: 'var(--font-weight-h6)' }],
        'subtitle': ['var(--font-size-subtitle)', { lineHeight: 'var(--line-height-subtitle)', letterSpacing: 'var(--letter-spacing-subtitle)', fontWeight: 'var(--font-weight-subtitle)' }],
        'body-lg': ['var(--font-size-body-lg)', { lineHeight: 'var(--line-height-body-lg)', letterSpacing: 'var(--letter-spacing-body-lg)', fontWeight: 'var(--font-weight-body-lg)' }],
        'body': ['var(--font-size-body)', { lineHeight: 'var(--line-height-body)', letterSpacing: 'var(--letter-spacing-body)', fontWeight: 'var(--font-weight-body)' }],
        'body-sm': ['var(--font-size-body-sm)', { lineHeight: 'var(--line-height-body-sm)', letterSpacing: 'var(--letter-spacing-body-sm)', fontWeight: 'var(--font-weight-body-sm)' }],
        'caption': ['var(--font-size-caption)', { lineHeight: 'var(--line-height-caption)', letterSpacing: 'var(--letter-spacing-caption)', fontWeight: 'var(--font-weight-caption)' }],
        'overline': ['var(--font-size-overline)', { lineHeight: 'var(--line-height-overline)', letterSpacing: 'var(--letter-spacing-overline)', fontWeight: 'var(--font-weight-overline)' }],
      },
      colors: {
        // Base colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        // GHXSTSHIP Monochromatic Semantic Tokens
        'ghxst-black': 'var(--black)',
        'ghxst-white': 'var(--white)',
        'ghxst-primary': 'var(--primary)',
        'ghxst-secondary': 'var(--secondary)',
        'ghxst-accent': 'var(--accent)',
        'ghxst-accent-hover': 'var(--accent-hover)',
        'ghxst-surface': 'var(--surface)',
        'ghxst-border': 'var(--border)',
        'ghxst-text-primary': 'var(--text-primary)',
        'ghxst-text-secondary': 'var(--text-secondary)',
        'ghxst-text-inverse': 'var(--text-inverse)',
        
        // GVTEWAY Primary Colors (Bold Accents)
        gvteway: {
          red: {
            DEFAULT: '#FF0000',
            50: '#FFE5E5',
            100: '#FFCCCC',
            200: '#FF9999',
            300: '#FF6666',
            400: '#FF3333',
            500: '#FF0000',
            600: '#CC0000',
            700: '#990000',
            800: '#660000',
            900: '#330000',
          },
          yellow: {
            DEFAULT: '#FFD700',
            50: '#FFFDF0',
            100: '#FFFAE0',
            200: '#FFF5C2',
            300: '#FFF0A3',
            400: '#FFEB85',
            500: '#FFD700',
            600: '#E6C200',
            700: '#CCAD00',
            800: '#B39900',
            900: '#998400',
          },
          blue: {
            DEFAULT: '#0066FF',
            50: '#E5F0FF',
            100: '#CCE0FF',
            200: '#99C2FF',
            300: '#66A3FF',
            400: '#3385FF',
            500: '#0066FF',
            600: '#0052CC',
            700: '#003D99',
            800: '#002966',
            900: '#001433',
          },
        },
        
        // ATLVS Secondary Colors
        atlvs: {
          green: {
            DEFAULT: '#00FF00',
            50: '#E5FFE5',
            100: '#CCFFCC',
            200: '#99FF99',
            300: '#66FF66',
            400: '#33FF33',
            500: '#00FF00',
            600: '#00CC00',
            700: '#009900',
            800: '#006600',
            900: '#003300',
          },
          orange: {
            DEFAULT: '#FF8800',
            50: '#FFF4E5',
            100: '#FFE9CC',
            200: '#FFD399',
            300: '#FFBD66',
            400: '#FFA733',
            500: '#FF8800',
            600: '#CC6D00',
            700: '#995200',
            800: '#663700',
            900: '#331B00',
          },
          purple: {
            DEFAULT: '#8800FF',
            50: '#F4E5FF',
            100: '#E9CCFF',
            200: '#D399FF',
            300: '#BD66FF',
            400: '#A733FF',
            500: '#8800FF',
            600: '#6D00CC',
            700: '#520099',
            800: '#370066',
            900: '#1B0033',
          },
        },
        
        // COMPVSS Tertiary Colors (External Teams & Collaborators)
        compvss: {
          cyan: {
            DEFAULT: '#00FFFF',
            50: '#E5FFFF',
            100: '#CCFFFF',
            200: '#99FFFF',
            300: '#66FFFF',
            400: '#33FFFF',
            500: '#00FFFF',
            600: '#00CCCC',
            700: '#009999',
            800: '#006666',
            900: '#003333',
          },
          teal: {
            DEFAULT: '#00CED1',
            50: '#E5F9FA',
            100: '#CCF4F5',
            200: '#99E9EB',
            300: '#66DEE1',
            400: '#33D3D7',
            500: '#00CED1',
            600: '#00A5A7',
            700: '#007C7D',
            800: '#005254',
            900: '#00292A',
          },
          indigo: {
            DEFAULT: '#4B0082',
            50: '#EDE5F4',
            100: '#DBCCE9',
            200: '#B799D3',
            300: '#9366BD',
            400: '#6F33A7',
            500: '#4B0082',
            600: '#3C0068',
            700: '#2D004E',
            800: '#1E0034',
            900: '#0F001A',
          },
        },
        
        // Grayscale - Aligned with CSS variables
        gray: {
          50: 'var(--gray-50)',
          100: 'var(--gray-100)',
          200: 'var(--gray-200)',
          300: 'var(--gray-300)',
          400: 'var(--gray-400)',
          500: 'var(--gray-500)',
          600: 'var(--gray-600)',
          700: 'var(--gray-700)',
          800: 'var(--gray-800)',
          900: 'var(--gray-900)',
          950: 'var(--gray-950)',
        },
        
        // UI Component colors
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        
        // Semantic UI State Colors
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          light: 'hsl(var(--success-light))',
          border: 'hsl(var(--success-border))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          light: 'hsl(var(--warning-light))',
          border: 'hsl(var(--warning-border))'
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
          light: 'hsl(var(--error-light))',
          border: 'hsl(var(--error-border))'
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          light: 'hsl(var(--info-light))',
          border: 'hsl(var(--info-border))'
        },
        
        // Conflict Resolution Colors
        conflict: {
          local: 'var(--conflict-local)',
          'local-bg': 'var(--conflict-local-bg)',
          'local-hover': 'var(--conflict-local-hover)',
          remote: 'var(--conflict-remote)',
          'remote-bg': 'var(--conflict-remote-bg)',
          'remote-hover': 'var(--conflict-remote-hover)',
          custom: 'var(--conflict-custom)',
          'custom-bg': 'var(--conflict-custom-bg)',
          'custom-hover': 'var(--conflict-custom-hover)',
        },
        
        // Integration Provider Colors
        integration: {
          spotify: 'var(--integration-spotify)',
          shopify: 'var(--integration-shopify)',
          'google-bg': 'var(--integration-google-bg)',
          'google-text': 'var(--integration-google-text)',
          'google-border': 'var(--integration-google-border)',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' }
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' }
        },
        'slide-in-from-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' }
        },
        'slide-in-from-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
        'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
        'slide-in-from-right': 'slide-in-from-right 0.3s ease-out'
      },
      animationDelay: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    }
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Tailwind requires CommonJS
    require("tailwindcss-animate"),
    function({ matchUtilities, theme }: { matchUtilities: (utilities: Record<string, (value: string) => Record<string, string>>, config: { values: Record<string, string> }) => void; theme: (key: string) => Record<string, string> }) {
      matchUtilities(
        {
          'animation-delay': (value: string) => ({
            'animation-delay': value,
          }),
        },
        { values: theme('animationDelay') }
      );
    },
  ],
};

export default config;
