import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  SectionHeader,
  applyTypographyStyle,
} from '../components';
import { Card } from '../../molecules/Card';

const meta: Meta = {
  title: '1 - Foundations / Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Typography"
            subtitle="Complete typography system with font families, sizes, weights, and text styles. Includes interactive examples, accessibility compliance, and real-world applications."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

// Helper function to apply text style
const applyTextStyle = (styleName: string) => {
  const styles: Record<string, React.CSSProperties> = {
    headline: {
      fontFamily: tokens.typography.fontFamily.display.join(', '),
      fontSize: tokens.typography.fontSize['4xl'],
      fontWeight: Number(tokens.typography.fontWeight.bold),
      lineHeight: tokens.typography.lineHeight.tight,
      letterSpacing: tokens.typography.letterSpacing.tight,
    },
    subheadline: {
      fontFamily: tokens.typography.fontFamily.display.join(', '),
      fontSize: tokens.typography.fontSize['2xl'],
      fontWeight: Number(tokens.typography.fontWeight.semibold),
      lineHeight: tokens.typography.lineHeight.snug,
      letterSpacing: tokens.typography.letterSpacing.normal,
    },
    title: {
      fontFamily: tokens.typography.fontFamily.sans.join(', '),
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: Number(tokens.typography.fontWeight.semibold),
      lineHeight: tokens.typography.lineHeight.snug,
      letterSpacing: tokens.typography.letterSpacing.normal,
    },
    subtitle: {
      fontFamily: tokens.typography.fontFamily.sans.join(', '),
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: Number(tokens.typography.fontWeight.medium),
      lineHeight: tokens.typography.lineHeight.normal,
      letterSpacing: tokens.typography.letterSpacing.normal,
    },
    body: {
      fontFamily: tokens.typography.fontFamily.sans.join(', '),
      fontSize: tokens.typography.fontSize.base,
      fontWeight: Number(tokens.typography.fontWeight.normal),
      lineHeight: tokens.typography.lineHeight.relaxed,
      letterSpacing: tokens.typography.letterSpacing.normal,
    },
    caption: {
      fontFamily: tokens.typography.fontFamily.sans.join(', '),
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: Number(tokens.typography.fontWeight.normal),
      lineHeight: tokens.typography.lineHeight.normal,
      letterSpacing: tokens.typography.letterSpacing.wide,
    },
    elegant: {
      fontFamily: tokens.typography.fontFamily.elegant.join(', '),
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: Number(tokens.typography.fontWeight.medium),
      lineHeight: tokens.typography.lineHeight.relaxed,
      letterSpacing: tokens.typography.letterSpacing.wide,
    },
    code: {
      fontFamily: tokens.typography.fontFamily.mono.join(', '),
      fontSize: tokens.typography.fontSize.sm,
      fontWeight: Number(tokens.typography.fontWeight.normal),
      lineHeight: tokens.typography.lineHeight.normal,
      letterSpacing: tokens.typography.letterSpacing.normal,
    },
  };

  return styles[styleName] || {};
};

// ============================================================================
// STORIES
// ============================================================================

export const FontFamilies: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Font Families"
        subtitle="Complete font family system with display, sans, and mono options"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(tokens.typography.fontFamily).map(
          ([name, families]) => (
            <Card key={name} className="hover:border-gray-300">
              <div className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
                {name}
              </div>
              <div
                style={{
                  fontFamily: Array.isArray(families)
                    ? families.join(', ')
                    : String(families),
                }}
                className="text-xl leading-relaxed"
              >
                <div className="font-light mb-2">
                  Light: The quick brown fox
                </div>
                <div className="font-normal mb-2">
                  Regular: The quick brown fox
                </div>
                <div className="font-semibold">
                  Semibold: The quick brown fox
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-3 font-mono">
                {Array.isArray(families) ? families.join(', ') : families}
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  ),
};

export const FontSizes: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Font Sizes"
        subtitle="Complete typography scale from xs to 4xl"
      />
      <div className="space-y-4">
        {Object.entries(tokens.typography.fontSize).map(([name, size]) => (
          <div
            key={name}
            className="flex items-baseline gap-6 p-4 rounded-lg border border-gray-100 bg-gray-50"
          >
            <div className="w-20 text-sm font-medium text-gray-600">{name}</div>
            <div className="w-16 text-xs text-gray-400 font-mono">{size}</div>
            <div
              style={{ fontSize: size }}
              className="font-medium text-gray-900 flex-1"
            >
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Font Weights"
        subtitle="Complete font weight scale from light to bold"
      />
      <div className="space-y-4">
        {Object.entries(tokens.typography.fontWeight).map(([name, weight]) => (
          <div
            key={name}
            className="flex items-baseline gap-6 p-4 rounded-lg border border-gray-100 bg-gray-50"
          >
            <div className="w-24 text-sm font-medium text-gray-600">{name}</div>
            <div className="w-16 text-xs text-gray-400 font-mono">{weight}</div>
            <div
              style={{ fontWeight: Number(weight) }}
              className="text-lg text-gray-900 flex-1"
            >
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LineHeights: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Line Heights"
        subtitle="Line height options for optimal readability"
      />
      <div className="space-y-6">
        {Object.entries(tokens.typography.lineHeight).map(([name, height]) => (
          <div
            key={name}
            className="p-4 rounded-lg border border-gray-100 bg-gray-50"
          >
            <div className="text-sm font-medium text-gray-600 mb-3">
              {name} ({height})
            </div>
            <div
              style={{ lineHeight: height }}
              className="text-lg text-gray-900 max-w-2xl"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const LetterSpacing: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Letter Spacing"
        subtitle="Letter spacing options for enhanced readability and style"
      />
      <div className="space-y-4">
        {Object.entries(tokens.typography.letterSpacing).map(
          ([name, spacing]) => (
            <div
              key={name}
              className="flex items-baseline gap-6 p-4 rounded-lg border border-gray-100 bg-gray-50"
            >
              <div className="w-24 text-sm font-medium text-gray-600">
                {name}
              </div>
              <div className="w-20 text-xs text-gray-400 font-mono">
                {spacing}
              </div>
              <div
                style={{ letterSpacing: spacing }}
                className="text-lg font-medium text-gray-900 flex-1"
              >
                THE QUICK BROWN FOX
              </div>
            </div>
          )
        )}
      </div>
    </div>
  ),
};

export const TextStyles: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Text Styles"
        subtitle="Predefined text styles for consistent typography across the application"
      />
      <div className="space-y-8">
        {[
          { name: 'headline', description: 'Main page titles, hero sections' },
          {
            name: 'subheadline',
            description: 'Section headers, major divisions',
          },
          { name: 'title', description: 'Component titles, card headers' },
          { name: 'subtitle', description: 'Supporting text, descriptions' },
          { name: 'body', description: 'Main content, paragraphs' },
          { name: 'caption', description: 'Metadata, timestamps' },
          { name: 'elegant', description: 'Premium content, quotes' },
          { name: 'code', description: 'Code snippets, technical content' },
        ].map(({ name, description }) => (
          <Card key={name} className="hover:border-gray-300">
            <div className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
              {name}
            </div>
            <div
              style={applyTextStyle(name)}
              className="text-gray-900 mb-4 break-words"
            >
              {name === 'headline' && 'Financial Excellence Through Innovation'}
              {name === 'subheadline' &&
                "Building Tomorrow's Financial Solutions"}
              {name === 'title' && 'Advanced Analytics Dashboard'}
              {name === 'subtitle' &&
                'Real-time market insights and predictive modeling'}
              {name === 'body' &&
                'Our comprehensive financial modeling platform provides enterprise-grade solutions for risk assessment, portfolio optimization, and market analysis. Built with cutting-edge technology and industry best practices.'}
              {name === 'caption' && 'Last updated: August 2024'}
              {name === 'elegant' &&
                'Elegant typography for sophisticated applications'}
              {name === 'code' &&
                'const financialModel = new RiskAssessment();'}
            </div>
            <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded">
              {description}
            </div>
          </Card>
        ))}
      </div>
    </div>
  ),
};

export const TypographyScale: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Typography Scale"
        subtitle="Complete typography hierarchy from headline to caption"
      />
      <div className="space-y-6">
        <div style={applyTextStyle('headline')} className="text-gray-900">
          Financial Excellence Through Innovation
        </div>
        <div style={applyTextStyle('subheadline')} className="text-gray-800">
          Building Tomorrow's Financial Solutions
        </div>
        <div style={applyTextStyle('title')} className="text-gray-800">
          Advanced Analytics Dashboard
        </div>
        <div style={applyTextStyle('subtitle')} className="text-gray-700">
          Real-time market insights and predictive modeling
        </div>
        <div style={applyTextStyle('body')} className="text-gray-700 max-w-3xl">
          Our comprehensive financial modeling platform provides
          enterprise-grade solutions for risk assessment, portfolio
          optimization, and market analysis. Built with cutting-edge technology
          and industry best practices, we deliver actionable insights that drive
          strategic decision-making.
        </div>
        <div style={applyTextStyle('caption')} className="text-gray-500">
          Last updated: August 2024 • Version 2.1.0
        </div>
      </div>
    </div>
  ),
};

export const InteractiveExamples: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Interactive Examples"
        subtitle="Real-world typography applications in financial interfaces"
      />

      {/* Financial Report Example */}
      <Card className="hover:border-gray-300 overflow-hidden">
        <div
          style={applyTextStyle('headline')}
          className="text-gray-900 mb-4 break-words"
        >
          Q3 Financial Performance Report
        </div>
        <div
          style={applyTextStyle('subtitle')}
          className="text-gray-600 mb-6 break-words"
        >
          Comprehensive analysis of quarterly results and market trends
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div
              style={applyTextStyle('title')}
              className="text-gray-800 mb-3 break-words"
            >
              Key Metrics
            </div>
            <div
              style={applyTextStyle('body')}
              className="text-gray-700 space-y-2"
            >
              <div>
                • Revenue Growth:{' '}
                <span className="font-semibold text-green-600">+23.4%</span>
              </div>
              <div>
                • Profit Margin:{' '}
                <span className="font-semibold text-blue-600">18.7%</span>
              </div>
              <div>
                • Market Share:{' '}
                <span className="font-semibold text-purple-600">12.3%</span>
              </div>
            </div>
          </div>

          <div>
            <div
              style={applyTextStyle('title')}
              className="text-gray-800 mb-3 break-words"
            >
              Risk Assessment
            </div>
            <div style={applyTextStyle('body')} className="text-gray-700">
              Market volatility remains within acceptable parameters. Portfolio
              diversification strategies continue to demonstrate effectiveness
              in mitigating sector-specific risks.
            </div>
          </div>
        </div>

        <div
          style={applyTextStyle('caption')}
          className="text-gray-500 mt-6 pt-4 border-t border-gray-100 break-words"
        >
          Generated by FinVision Analytics Platform • Confidential
        </div>
      </Card>

      {/* Code Example */}
      <div className="p-6 rounded-xl border border-gray-200 bg-gray-900 text-white overflow-hidden">
        <div
          style={applyTextStyle('subtitle')}
          className="text-gray-300 mb-4 break-words"
        >
          Risk Calculation Algorithm
        </div>
        <div
          style={applyTextStyle('code')}
          className="text-green-400 font-mono overflow-x-auto"
        >
          <div>class RiskCalculator {'{'}</div>
          <div className="ml-4">calculateVaR(portfolio, confidence) {'{'}</div>
          <div className="ml-8">
            const volatility = this.getVolatility(portfolio);
          </div>
          <div className="ml-8">const zScore = this.getZScore(confidence);</div>
          <div className="ml-8">
            return portfolio.value * volatility * zScore;
          </div>
          <div className="ml-4">{'}'}</div>
          <div>{'}'}</div>
        </div>
      </div>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Complete Typography Documentation"
        subtitle="Comprehensive guide to our sophisticated typography system"
      />

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4
          style={applyTypographyStyle('title')}
          className="text-gray-900 mb-6 break-words"
        >
          🌟 Design Philosophy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-indigo-500 flex-shrink-0"></div>
              <div>
                <div className="font-semibold text-gray-900 break-words">
                  Sophisticated Typography
                </div>
                <div className="text-sm text-gray-600 break-words">
                  Professional and elegant type system for financial
                  applications
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-gray-500 flex-shrink-0"></div>
              <div>
                <div className="font-semibold text-gray-900 break-words">
                  Clear Hierarchy
                </div>
                <div className="text-sm text-gray-600 break-words">
                  Well-defined typography scale for optimal readability
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-teal-500 flex-shrink-0"></div>
              <div>
                <div className="font-semibold text-gray-900 break-words">
                  Accessibility First
                </div>
                <div className="text-sm text-gray-600 break-words">
                  WCAG compliant with proper contrast ratios
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500 flex-shrink-0"></div>
              <div>
                <div className="font-semibold text-gray-900 break-words">
                  Consistent Patterns
                </div>
                <div className="text-sm text-gray-600 break-words">
                  Predefined text styles for maintainable design
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4
          style={applyTypographyStyle('title')}
          className="text-gray-900 mb-6 break-words"
        >
          🚀 Usage Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 break-words">
              Headlines & Titles
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="break-words">
                • Headline: Main page titles, hero sections
              </li>
              <li className="break-words">
                • Subheadline: Section headers, major divisions
              </li>
              <li className="break-words">
                • Title: Component titles, card headers
              </li>
              <li className="break-words">
                • Subtitle: Supporting text, descriptions
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 break-words">
              Body & Content
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="break-words">• Body: Main content, paragraphs</li>
              <li className="break-words">• Caption: Metadata, timestamps</li>
              <li className="break-words">
                • Code: Code snippets, technical content
              </li>
              <li className="break-words">
                • Elegant: Premium content, quotes
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 break-words">
              Font Families
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="break-words">• Display: Headlines, large text</li>
              <li className="break-words">• Sans: Body text, UI elements</li>
              <li className="break-words">• Mono: Code, technical content</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4
          style={applyTypographyStyle('title')}
          className="text-gray-900 mb-6 break-words"
        >
          ♿ Accessibility
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 break-words">
              Contrast Requirements
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="break-words">
                • All text meets WCAG 2.1 AA standards
              </li>
              <li className="break-words">
                • Minimum 4.5:1 contrast ratio for normal text
              </li>
              <li className="break-words">
                • Minimum 3:1 contrast ratio for large text
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 break-words">
              Best Practices
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="break-words">• Use semantic HTML elements</li>
              <li className="break-words">
                • Maintain proper heading hierarchy
              </li>
              <li className="break-words">
                • Ensure sufficient line height for readability
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const UsageGuidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Typography Usage Guidelines"
        subtitle="Best practices for implementing our sophisticated typography system"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card className="group p-6 hover:shadow-md overflow-hidden">
            <h4 className="font-semibold text-lg text-gray-900 mb-4 break-words">
              Headlines & Titles
            </h4>
            <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
              <li className="break-words">
                • Use headline for main page titles
              </li>
              <li className="break-words">
                • Use subheadline for section headers
              </li>
              <li className="break-words">• Use title for component headers</li>
              <li className="break-words">
                • Use subtitle for supporting text
              </li>
            </ul>
          </Card>

          <Card className="group p-6 hover:shadow-md overflow-hidden">
            <h4 className="font-semibold text-lg text-gray-900 mb-4 break-words">
              Body & Content
            </h4>
            <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
              <li className="break-words">• Use body for main content</li>
              <li className="break-words">• Use caption for metadata</li>
              <li className="break-words">• Use code for technical content</li>
              <li className="break-words">• Use elegant for premium content</li>
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="group p-6 hover:shadow-md overflow-hidden">
            <h4 className="font-semibold text-lg text-gray-900 mb-4 break-words">
              Font Families
            </h4>
            <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
              <li className="break-words">• Display for headlines</li>
              <li className="break-words">• Sans for body text</li>
              <li className="break-words">• Mono for code content</li>
              <li className="break-words">• Maintain consistency</li>
            </ul>
          </Card>

          <Card className="group p-6 hover:shadow-md overflow-hidden">
            <h4 className="font-semibold text-lg text-gray-900 mb-4 break-words">
              Accessibility
            </h4>
            <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
              <li className="break-words">• Ensure proper contrast ratios</li>
              <li className="break-words">• Use semantic HTML elements</li>
              <li className="break-words">• Maintain heading hierarchy</li>
              <li className="break-words">• Test with screen readers</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  ),
};

// Add new unique real user case stories
export const LegalDocumentation: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Legal Documentation Example"
        subtitle="Typography system applied to legal contracts and compliance documents"
      />

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <div
          style={applyTextStyle('headline')}
          className="text-gray-900 mb-6 break-words"
        >
          Investment Management Agreement
        </div>
        <div
          style={applyTextStyle('subtitle')}
          className="text-gray-600 mb-8 break-words"
        >
          Agreement between FinVision Capital Management and Client
        </div>

        <div className="space-y-6">
          <div>
            <div
              style={applyTextStyle('title')}
              className="text-gray-800 mb-3 break-words"
            >
              Article I: Definitions
            </div>
            <div
              style={applyTextStyle('body')}
              className="text-gray-700 space-y-3"
            >
              <p className="break-words">
                <strong>1.1 "Account"</strong> means the investment account
                established and maintained by the Manager for the Client
                pursuant to this Agreement.
              </p>
              <p className="break-words">
                <strong>1.2 "Assets"</strong> means all cash, securities, and
                other property held in the Account from time to time.
              </p>
              <p className="break-words">
                <strong>1.3 "Manager"</strong> means FinVision Capital
                Management, a registered investment adviser.
              </p>
            </div>
          </div>

          <div>
            <div
              style={applyTextStyle('title')}
              className="text-gray-800 mb-3 break-words"
            >
              Article II: Investment Authority
            </div>
            <div
              style={applyTextStyle('body')}
              className="text-gray-700 space-y-3"
            >
              <p className="break-words">
                The Client hereby appoints the Manager as investment adviser
                with full authority to buy, sell, and otherwise trade securities
                and other investments in the Account, subject to the investment
                objectives and guidelines set forth in Schedule A.
              </p>
              <p className="break-words">
                The Manager shall exercise reasonable care and diligence in the
                management of the Account and shall act in the best interests of
                the Client at all times.
              </p>
            </div>
          </div>
        </div>

        <div
          style={applyTextStyle('caption')}
          className="text-gray-500 mt-8 pt-6 border-t border-gray-100 break-words"
        >
          Document ID: IVM-2024-001 • Effective Date: January 1, 2024 • Version
          2.1
        </div>
      </div>
    </div>
  ),
};

export const EducationalContent: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Educational Content Example"
        subtitle="Typography system applied to learning materials and course content"
      />

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <div
          style={applyTextStyle('headline')}
          className="text-gray-900 mb-6 break-words"
        >
          Advanced Financial Modeling Course
        </div>
        <div
          style={applyTextStyle('subtitle')}
          className="text-gray-600 mb-8 break-words"
        >
          Module 3: Risk Assessment and Portfolio Optimization
        </div>

        <div className="space-y-8">
          <div>
            <div
              style={applyTextStyle('title')}
              className="text-gray-800 mb-4 break-words"
            >
              Learning Objectives
            </div>
            <div
              style={applyTextStyle('body')}
              className="text-gray-700 space-y-2"
            >
              <div className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold mt-1">•</span>
                <span className="break-words">
                  Understand modern portfolio theory and efficient frontier
                  concepts
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold mt-1">•</span>
                <span className="break-words">
                  Master Value at Risk (VaR) calculations and stress testing
                  methodologies
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-indigo-600 font-bold mt-1">•</span>
                <span className="break-words">
                  Apply Monte Carlo simulation techniques to portfolio
                  optimization
                </span>
              </div>
            </div>
          </div>

          <div>
            <div
              style={applyTextStyle('title')}
              className="text-gray-800 mb-4 break-words"
            >
              Key Concepts
            </div>
            <div
              style={applyTextStyle('body')}
              className="text-gray-700 space-y-4"
            >
              <div>
                <div
                  style={applyTextStyle('subtitle')}
                  className="text-gray-800 mb-2 break-words"
                >
                  Efficient Frontier
                </div>
                <p className="break-words">
                  The efficient frontier represents the set of optimal
                  portfolios that offer the highest expected return for a
                  defined level of risk. Portfolios that lie below the efficient
                  frontier are sub-optimal because they do not provide enough
                  return for the level of risk they carry.
                </p>
              </div>

              <div>
                <div
                  style={applyTextStyle('subtitle')}
                  className="text-gray-800 mb-2 break-words"
                >
                  Value at Risk (VaR)
                </div>
                <p className="break-words">
                  VaR measures the maximum potential loss of a portfolio over a
                  specific time period with a given confidence level. For
                  example, a 95% VaR of $1 million means there is a 5% chance
                  that the portfolio will lose more than $1 million in the
                  specified time period.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div
              style={applyTextStyle('elegant')}
              className="text-gray-800 mb-4 break-words"
            >
              "The essence of investment management is the management of risks,
              not the management of returns."
            </div>
            <div
              style={applyTextStyle('caption')}
              className="text-gray-600 break-words"
            >
              — Benjamin Graham, The Intelligent Investor
            </div>
          </div>
        </div>

        <div
          style={applyTextStyle('caption')}
          className="text-gray-500 mt-8 pt-6 border-t border-gray-100 break-words"
        >
          Course Duration: 8 weeks • Difficulty: Advanced • Prerequisites:
          Financial Mathematics, Statistics
        </div>
      </div>
    </div>
  ),
};
