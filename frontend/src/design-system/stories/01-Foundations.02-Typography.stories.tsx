import React from 'react';
import { tokens } from '../tokens';
import { tokenVal } from './_utils';

const meta = {
  title: 'Design System/Foundations/Typography',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

// Helper function to apply text style
const applyTextStyle = (styleName: string) => {
  const style = tokens.typography.textStyles[styleName as keyof typeof tokens.typography.textStyles];
  if (!style) return {};

  return {
    fontFamily: tokenVal(tokens.typography.fontFamily[style.fontFamily as keyof typeof tokens.typography.fontFamily]),
    fontSize: tokenVal(tokens.typography.fontSize[style.fontSize as keyof typeof tokens.typography.fontSize]),
    fontWeight: Number(tokenVal(tokens.typography.fontWeight[style.fontWeight as keyof typeof tokens.typography.fontWeight])),
    lineHeight: tokenVal(tokens.typography.lineHeight[style.lineHeight as keyof typeof tokens.typography.lineHeight]),
    letterSpacing: tokenVal(tokens.typography.letterSpacing[style.letterSpacing as keyof typeof tokens.typography.letterSpacing]),
  };
};

export const FontFamilies = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Font Families</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(tokens.typography.fontFamily).map(([name, families]) => (
            <div key={name} className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">{name}</div>
              <div
                style={{ fontFamily: tokenVal(families) }}
                className="text-xl leading-relaxed"
              >
                <div className="font-light mb-2">Light: The quick brown fox</div>
                <div className="font-normal mb-2">Regular: The quick brown fox</div>
                <div className="font-semibold">Semibold: The quick brown fox</div>
              </div>
              <div className="text-xs text-gray-400 mt-3 font-mono">
                {Array.isArray(families) ? families.join(', ') : families}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const FontSizes = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Font Sizes</h3>
        <div className="space-y-4">
          {Object.entries(tokens.typography.fontSize).map(([name, size]) => (
            <div key={name} className="flex items-baseline gap-6 p-4 rounded-lg border border-gray-100 bg-gray-50">
              <div className="w-20 text-sm font-medium text-gray-600">{name}</div>
              <div className="w-16 text-xs text-gray-400 font-mono">{tokenVal(size)}</div>
              <div style={{ fontSize: tokenVal(size) }} className="font-medium text-gray-900 flex-1">
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const FontWeights = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Font Weights</h3>
        <div className="space-y-4">
          {Object.entries(tokens.typography.fontWeight).map(([name, weight]) => (
            <div key={name} className="flex items-baseline gap-6 p-4 rounded-lg border border-gray-100 bg-gray-50">
              <div className="w-24 text-sm font-medium text-gray-600">{name}</div>
              <div className="w-16 text-xs text-gray-400 font-mono">{tokenVal(weight)}</div>
              <div style={{ fontWeight: Number(tokenVal(weight)) }} className="text-lg text-gray-900 flex-1">
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const LineHeights = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Line Heights</h3>
        <div className="space-y-6">
          {Object.entries(tokens.typography.lineHeight).map(([name, height]) => (
            <div key={name} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
              <div className="text-sm font-medium text-gray-600 mb-3">{name} ({tokenVal(height)})</div>
              <div style={{ lineHeight: tokenVal(height) }} className="text-lg text-gray-900 max-w-2xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const LetterSpacing = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Letter Spacing</h3>
        <div className="space-y-4">
          {Object.entries(tokens.typography.letterSpacing).map(([name, spacing]) => (
            <div key={name} className="flex items-baseline gap-6 p-4 rounded-lg border border-gray-100 bg-gray-50">
              <div className="w-24 text-sm font-medium text-gray-600">{name}</div>
              <div className="w-20 text-xs text-gray-400 font-mono">{tokenVal(spacing)}</div>
              <div style={{ letterSpacing: tokenVal(spacing) }} className="text-lg font-medium text-gray-900 flex-1">
                THE QUICK BROWN FOX
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const TextStyles = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Text Styles</h3>
        <div className="space-y-8">
          {Object.entries(tokens.typography.textStyles).map(([name, style]) => (
            <div key={name} className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">{name}</div>
              <div style={applyTextStyle(name)} className="text-gray-900 mb-4">
                {name === 'headline' && 'Financial Excellence Through Innovation'}
                {name === 'subheadline' && 'Building Tomorrow\'s Financial Solutions'}
                {name === 'title' && 'Advanced Analytics Dashboard'}
                {name === 'subtitle' && 'Real-time market insights and predictive modeling'}
                {name === 'body' && 'Our comprehensive financial modeling platform provides enterprise-grade solutions for risk assessment, portfolio optimization, and market analysis. Built with cutting-edge technology and industry best practices.'}
                {name === 'caption' && 'Last updated: August 2024'}
                {name === 'elegant' && 'Elegant typography for sophisticated applications'}
                {name === 'code' && 'const financialModel = new RiskAssessment();'}
              </div>
              <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded">
                {style.fontFamily} • {style.fontSize} • {style.fontWeight} • {style.lineHeight} • {style.letterSpacing}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const TypographyScale = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Typography Scale</h3>
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
            Our comprehensive financial modeling platform provides enterprise-grade solutions for risk assessment, portfolio optimization, and market analysis. Built with cutting-edge technology and industry best practices, we deliver actionable insights that drive strategic decision-making.
          </div>
          <div style={applyTextStyle('caption')} className="text-gray-500">
            Last updated: August 2024 • Version 2.1.0
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InteractiveExamples = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Interactive Examples</h3>

        {/* Financial Report Example */}
        <div className="p-8 rounded-xl border border-gray-200 bg-white shadow-sm mb-8">
          <div style={applyTextStyle('headline')} className="text-gray-900 mb-4">
            Q3 Financial Performance Report
          </div>
          <div style={applyTextStyle('subtitle')} className="text-gray-600 mb-6">
            Comprehensive analysis of quarterly results and market trends
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div style={applyTextStyle('title')} className="text-gray-800 mb-3">
                Key Metrics
              </div>
              <div style={applyTextStyle('body')} className="text-gray-700 space-y-2">
                <div>• Revenue Growth: <span className="font-semibold text-green-600">+23.4%</span></div>
                <div>• Profit Margin: <span className="font-semibold text-blue-600">18.7%</span></div>
                <div>• Market Share: <span className="font-semibold text-purple-600">12.3%</span></div>
              </div>
            </div>

            <div>
              <div style={applyTextStyle('title')} className="text-gray-800 mb-3">
                Risk Assessment
              </div>
              <div style={applyTextStyle('body')} className="text-gray-700">
                Market volatility remains within acceptable parameters. Portfolio diversification strategies continue to demonstrate effectiveness in mitigating sector-specific risks.
              </div>
            </div>
          </div>

          <div style={applyTextStyle('caption')} className="text-gray-500 mt-6 pt-4 border-t border-gray-100">
            Generated by FinVision Analytics Platform • Confidential
          </div>
        </div>

        {/* Code Example */}
        <div className="p-6 rounded-xl border border-gray-200 bg-gray-900 text-white">
          <div style={applyTextStyle('subtitle')} className="text-gray-300 mb-4">
            Risk Calculation Algorithm
          </div>
          <div style={applyTextStyle('code')} className="text-green-400 font-mono">
            <div>class RiskCalculator {'{'}</div>
            <div className="ml-4">calculateVaR(portfolio, confidence) {'{'}</div>
            <div className="ml-8">const volatility = this.getVolatility(portfolio);</div>
            <div className="ml-8">const zScore = this.getZScore(confidence);</div>
            <div className="ml-8">return portfolio.value * volatility * zScore;</div>
            <div className="ml-4">{'}'}</div>
            <div>{'}'}</div>
          </div>
        </div>
      </div>
    </div>
  ),
};
