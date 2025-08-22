import { tokens } from '../tokens/tokens';

// Helper function to get token value
const tokenVal = (value: any): string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
};

// Apply text style helper
export const applyTextStyle = (styleName: string) => {
  // Check if textStyles exists in tokens
  if (!tokens.typography.textStyles) {
    // Fallback to default styles based on styleName
    const defaultStyles: Record<string, any> = {
      headline: {
        fontFamily: 'sans',
        fontSize: '2xl',
        fontWeight: 'bold',
        lineHeight: 'tight',
        letterSpacing: 'tight'
      },
      body: {
        fontFamily: 'sans',
        fontSize: 'base',
        fontWeight: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal'
      },
      caption: {
        fontFamily: 'sans',
        fontSize: 'sm',
        fontWeight: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal'
      }
    };

    const style = defaultStyles[styleName];
    if (!style) return {};

    return {
      fontFamily: tokenVal(
        tokens.typography.fontFamily[
          style.fontFamily as keyof typeof tokens.typography.fontFamily
        ]
      ),
      fontSize: tokenVal(
        tokens.typography.fontSize[
          style.fontSize as keyof typeof tokens.typography.fontSize
        ]
      ),
      fontWeight: Number(
        tokenVal(
          tokens.typography.fontWeight[
            style.fontWeight as keyof typeof tokens.typography.fontWeight
          ]
        )
      ),
      lineHeight: tokenVal(
        tokens.typography.lineHeight[
          style.lineHeight as keyof typeof tokens.typography.lineHeight
        ]
      ),
      letterSpacing: tokenVal(
        tokens.typography.letterSpacing[
          style.letterSpacing as keyof typeof tokens.typography.letterSpacing
        ]
      ),
    };
  }

  const style =
    tokens.typography.textStyles[
      styleName as keyof typeof tokens.typography.textStyles
    ];
  if (!style) return {};

  return {
    fontFamily: tokenVal(
      tokens.typography.fontFamily[
        style.fontFamily as keyof typeof tokens.typography.fontFamily
      ]
    ),
    fontSize: tokenVal(
      tokens.typography.fontSize[
        style.fontSize as keyof typeof tokens.typography.fontSize
      ]
    ),
    fontWeight: Number(
      tokenVal(
        tokens.typography.fontWeight[
          style.fontWeight as keyof typeof tokens.typography.fontWeight
        ]
      )
    ),
    lineHeight: tokenVal(
      tokens.typography.lineHeight[
        style.lineHeight as keyof typeof tokens.typography.lineHeight
      ]
    ),
    letterSpacing: tokenVal(
      tokens.typography.letterSpacing[
        style.letterSpacing as keyof typeof tokens.typography.letterSpacing
      ]
    ),
  };
};

// Typography utility functions
export const typography = {
  // Font families
  fontFamily: {
    sans: tokenVal(tokens.typography.fontFamily.sans),
    serif: tokenVal(tokens.typography.fontFamily.serif),
    display: tokenVal(tokens.typography.fontFamily.display),
    mono: tokenVal(tokens.typography.fontFamily.mono),
    elegant: tokenVal(tokens.typography.fontFamily.elegant),
    modern: tokenVal(tokens.typography.fontFamily.modern),
  },

  // Font sizes
  fontSize: {
    xs: tokenVal(tokens.typography.fontSize.xs),
    sm: tokenVal(tokens.typography.fontSize.sm),
    base: tokenVal(tokens.typography.fontSize.base),
    lg: tokenVal(tokens.typography.fontSize.lg),
    xl: tokenVal(tokens.typography.fontSize.xl),
    '2xl': tokenVal(tokens.typography.fontSize['2xl']),
    '3xl': tokenVal(tokens.typography.fontSize['3xl']),
    '4xl': tokenVal(tokens.typography.fontSize['4xl']),
    '5xl': tokenVal(tokens.typography.fontSize['5xl']),
    '6xl': tokenVal(tokens.typography.fontSize['6xl']),
    '7xl': tokenVal(tokens.typography.fontSize['7xl']),
    '8xl': tokenVal(tokens.typography.fontSize['8xl']),
    '9xl': tokenVal(tokens.typography.fontSize['9xl']),
  },

  // Font weights
  fontWeight: {
    thin: Number(tokenVal(tokens.typography.fontWeight.thin)),
    extralight: Number(tokenVal(tokens.typography.fontWeight.extralight)),
    light: Number(tokenVal(tokens.typography.fontWeight.light)),
    normal: Number(tokenVal(tokens.typography.fontWeight.normal)),
    medium: Number(tokenVal(tokens.typography.fontWeight.medium)),
    semibold: Number(tokenVal(tokens.typography.fontWeight.semibold)),
    bold: Number(tokenVal(tokens.typography.fontWeight.bold)),
    extrabold: Number(tokenVal(tokens.typography.fontWeight.extrabold)),
    black: Number(tokenVal(tokens.typography.fontWeight.black)),
  },

  // Line heights
  lineHeight: {
    tight: tokenVal(tokens.typography.lineHeight.tight),
    snug: tokenVal(tokens.typography.lineHeight.snug),
    normal: tokenVal(tokens.typography.lineHeight.normal),
    relaxed: tokenVal(tokens.typography.lineHeight.relaxed),
    loose: tokenVal(tokens.typography.lineHeight.loose),
    'extra-loose': tokenVal(tokens.typography.lineHeight['extra-loose']),
  },

  // Letter spacing
  letterSpacing: {
    tighter: tokenVal(tokens.typography.letterSpacing.tighter),
    tight: tokenVal(tokens.typography.letterSpacing.tight),
    normal: tokenVal(tokens.typography.letterSpacing.normal),
    wide: tokenVal(tokens.typography.letterSpacing.wide),
    wider: tokenVal(tokens.typography.letterSpacing.wider),
    widest: tokenVal(tokens.typography.letterSpacing.widest),
    'extra-wide': tokenVal(tokens.typography.letterSpacing['extra-wide']),
  },

  // Predefined text styles
  styles: {
    headline: applyTextStyle('headline'),
    subheadline: applyTextStyle('subheadline'),
    title: applyTextStyle('title'),
    subtitle: applyTextStyle('subtitle'),
    body: applyTextStyle('body'),
    caption: applyTextStyle('caption'),
    elegant: applyTextStyle('elegant'),
    code: applyTextStyle('code'),
  },

  // Utility functions for common combinations
  getStyle: (
    family: string,
    size: string,
    weight: string,
    lineHeight?: string,
    letterSpacing?: string
  ) => ({
    fontFamily: tokenVal(
      tokens.typography.fontFamily[
        family as keyof typeof tokens.typography.fontFamily
      ]
    ),
    fontSize: tokenVal(
      tokens.typography.fontSize[
        size as keyof typeof tokens.typography.fontSize
      ]
    ),
    fontWeight: Number(
      tokenVal(
        tokens.typography.fontWeight[
          weight as keyof typeof tokens.typography.fontWeight
        ]
      )
    ),
    ...(lineHeight && {
      lineHeight: tokenVal(
        tokens.typography.lineHeight[
          lineHeight as keyof typeof tokens.typography.lineHeight
        ]
      ),
    }),
    ...(letterSpacing && {
      letterSpacing: tokenVal(
        tokens.typography.letterSpacing[
          letterSpacing as keyof typeof tokens.typography.letterSpacing
        ]
      ),
    }),
  }),
};

// CSS-in-JS style objects for common use cases
export const textStyles = {
  // Headings
  h1: typography.styles.headline,
  h2: typography.styles.subheadline,
  h3: typography.styles.title,
  h4: typography.styles.subtitle,

  // Body text
  body: typography.styles.body,
  bodyLarge: typography.getStyle('sans', 'lg', 'normal', 'relaxed'),
  bodySmall: typography.getStyle('sans', 'sm', 'normal', 'normal'),

  // Specialized text
  caption: typography.styles.caption,
  code: typography.styles.code,
  elegant: typography.styles.elegant,

  // Financial specific
  metric: typography.getStyle('sans', '2xl', 'semibold', 'tight'),
  metricLarge: typography.getStyle('sans', '3xl', 'bold', 'tight'),
  metricSmall: typography.getStyle('sans', 'lg', 'medium', 'snug'),

  // Navigation
  nav: typography.getStyle('sans', 'sm', 'medium', 'normal'),
  navActive: typography.getStyle('sans', 'sm', 'semibold', 'normal'),

  // Buttons
  button: typography.getStyle('sans', 'sm', 'medium', 'normal'),
  buttonLarge: typography.getStyle('sans', 'base', 'medium', 'normal'),

  // Forms
  label: typography.getStyle('sans', 'sm', 'medium', 'normal'),
  input: typography.getStyle('sans', 'base', 'normal', 'normal'),
  help: typography.getStyle('sans', 'xs', 'normal', 'normal', 'wide'),
};

// Tailwind CSS classes for typography
export const typographyClasses = {
  // Font families
  fontSans: 'font-sans',
  fontSerif: 'font-serif',
  fontDisplay: 'font-display',
  fontMono: 'font-mono',
  fontElegant: 'font-elegant',
  fontModern: 'font-modern',

  // Font sizes
  textXs: 'text-xs',
  textSm: 'text-sm',
  textBase: 'text-base',
  textLg: 'text-lg',
  textXl: 'text-xl',
  text2xl: 'text-2xl',
  text3xl: 'text-3xl',
  text4xl: 'text-4xl',
  text5xl: 'text-5xl',
  text6xl: 'text-6xl',
  text7xl: 'text-7xl',
  text8xl: 'text-8xl',
  text9xl: 'text-9xl',

  // Font weights
  fontThin: 'font-thin',
  fontExtralight: 'font-extralight',
  fontLight: 'font-light',
  fontNormal: 'font-normal',
  fontMedium: 'font-medium',
  fontSemibold: 'font-semibold',
  fontBold: 'font-bold',
  fontExtrabold: 'font-extrabold',
  fontBlack: 'font-black',

  // Line heights
  leadingTight: 'leading-tight',
  leadingSnug: 'leading-snug',
  leadingNormal: 'leading-normal',
  leadingRelaxed: 'leading-relaxed',
  leadingLoose: 'leading-loose',
  leadingExtraLoose: 'leading-[2.5]',

  // Letter spacing
  trackingTighter: 'tracking-tighter',
  trackingTight: 'tracking-tight',
  trackingNormal: 'tracking-normal',
  trackingWide: 'tracking-wide',
  trackingWider: 'tracking-wider',
  trackingWidest: 'tracking-widest',
  trackingExtraWide: 'tracking-[0.15em]',
};

// React component for applying text styles
export const Text: React.FC<{
  variant?: keyof typeof typography.styles;
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}> = ({
  variant = 'body',
  children,
  className = '',
  as: Component = 'div',
  style = {},
  ...props
}) => {
  const textStyle = typography.styles[variant] || {};

  return (
    <Component
      style={{ ...textStyle, ...style }}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

// Export individual components for common text variants
export const Heading1: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text variant="headline" as="h1" className={className}>
    {children}
  </Text>
);

export const Heading2: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text variant="subheadline" as="h2" className={className}>
    {children}
  </Text>
);

export const Heading3: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text variant="title" as="h3" className={className}>
    {children}
  </Text>
);

export const Heading4: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text variant="subtitle" as="h4" className={className}>
    {children}
  </Text>
);

export const BodyText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text variant="body" className={className}>
    {children}
  </Text>
);

export const Caption: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text variant="caption" className={className}>
    {children}
  </Text>
);

export const CodeText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text variant="code" as="code" className={className}>
    {children}
  </Text>
);

export const ElegantText: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text variant="elegant" className={className}>
    {children}
  </Text>
);
