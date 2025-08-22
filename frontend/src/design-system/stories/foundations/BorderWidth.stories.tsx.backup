import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  BorderWidthScale,
  BorderStyleShowcase,
  InteractiveBorderStates,
  PracticalExamples,
  BorderRadiusCombinations,
  SectionHeader,
  GuidelinesCard,
  GuidelinesSection,
  PhilosophyItem,
} from '../components';

const meta: Meta = {
  title: '1 - Foundations / Border Width',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Border Width"
            subtitle="Comprehensive border width system for various UI components. Supports different border styles, states, and use cases with accessibility compliance."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
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

// ============================================================================
// STORIES
// ============================================================================

export const Scale: Story = {
  render: () => (
    <div className="space-y-16">
      <BorderWidthScale />
    </div>
  ),
};

export const BorderStyles: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Border Styles"
        subtitle="Different border styles for various UI patterns and visual hierarchy"
      />
      <BorderStyleShowcase />
    </div>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Interactive Border States"
        subtitle="Border width variations for different interactive states and feedback"
      />
      <InteractiveBorderStates />
    </div>
  ),
};

export const PracticalExamplesStory: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Practical Examples"
        subtitle="Real-world applications of border width in UI components"
      />
      <PracticalExamples />
    </div>
  ),
};

export const BorderRadiusCombinationsStory: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Border Radius Combinations"
        subtitle="How border width interacts with different border radius values"
      />
      <BorderRadiusCombinations />
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Complete Border Width Documentation"
          subtitle="Comprehensive guide to our sophisticated border width system"
        />

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h4 className="text-xl font-semibold text-gray-900 mb-6">
            🌟 Design Philosophy
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <PhilosophyItem
                color={tokens.colors.primary[500]}
                title="Subtle Hierarchy"
                description="Thin borders for subtle separation and visual hierarchy"
              />
              <PhilosophyItem
                color={tokens.colors.secondary[500]}
                title="Emphasis Control"
                description="Medium borders for emphasis and interactive states"
              />
            </div>
            <div className="space-y-4">
              <PhilosophyItem
                color={tokens.colors.accent[500]}
                title="Strong Definition"
                description="Thick borders for strong visual definition and focus"
              />
              <PhilosophyItem
                color={tokens.colors.danger}
                title="Accessibility First"
                description="Ensures sufficient contrast and clear visual boundaries"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h4 className="text-xl font-semibold text-gray-900 mb-6">
            🚀 Usage Guidelines
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GuidelinesSection
              title="Thin Borders (1px)"
              items={[
                '• Cards: Subtle separation',
                '• Inputs: Default state borders',
                '• Dividers: Content separation',
                '• Tables: Cell boundaries',
              ]}
            />
            <GuidelinesSection
              title="Medium Borders (2px)"
              items={[
                '• Focus states: Active input focus',
                '• Emphasis: Important elements',
                '• Interactive: Button hover states',
                '• Selection: Selected items',
              ]}
            />
            <GuidelinesSection
              title="Thick Borders (3px+)"
              items={[
                '• Strong focus: Critical elements',
                '• Error states: Validation errors',
                '• Success states: Confirmation feedback',
                '• Brand elements: Logo containers',
              ]}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h4 className="text-xl font-semibold text-gray-900 mb-6">
            ♿ Accessibility
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GuidelinesSection
              title="Contrast Requirements"
              items={[
                '• Ensure sufficient contrast between border and background',
                '• Test border visibility in high contrast mode',
                '• Consider color blindness when using colored borders',
              ]}
            />
            <GuidelinesSection
              title="Best Practices"
              items={[
                '• Use consistent border widths for similar elements',
                "• Don't rely solely on borders for information",
                '• Provide alternative visual cues for screen readers',
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const UsageGuidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Border Width Usage Guidelines"
          subtitle="Best practices for implementing our sophisticated border width system"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <GuidelinesCard
              title="Thin Borders (1px)"
              items={[
                '• Use for subtle visual separation',
                '• Default state for form elements',
                '• Card and container boundaries',
                '• Table cell dividers',
              ]}
            />

            <GuidelinesCard
              title="Medium Borders (2px)"
              items={[
                '• Focus states and active elements',
                '• Interactive component emphasis',
                '• Selected state indicators',
                '• Important content boundaries',
              ]}
            />
          </div>

          <div className="space-y-4">
            <GuidelinesCard
              title="Thick Borders (3px+)"
              items={[
                '• Strong visual emphasis',
                '• Error and success states',
                '• Critical UI elements',
                '• Brand identity elements',
              ]}
            />

            <GuidelinesCard
              title="Accessibility"
              items={[
                '• Ensure sufficient contrast',
                '• Test with screen readers',
                '• Consider color blindness',
                '• Provide alternative cues',
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
