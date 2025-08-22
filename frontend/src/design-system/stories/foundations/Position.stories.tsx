import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  SectionHeader,
  GuidelinesCard,
  GuidelinesSection,
} from '../components';

const meta: Meta = {
  title: '1 - Foundations / Position',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Position"
            subtitle="Comprehensive positioning system with position utilities, top/right/bottom/left tokens, z-index integration, and positioning patterns. Includes accessibility considerations and real-world examples."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
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

// Position System Components
const PositionDemo = ({
  name,
  position,
  top,
  right,
  bottom,
  left,
  zIndex,
  className = '',
}: {
  name: string;
  position: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
  className?: string;
}) => (
  <div className={`p-6 rounded-xl border bg-card space-y-4 ${className}`}>
    <div className="text-sm font-medium text-foreground">{name}</div>
    <div className="relative h-32 bg-muted/10 border border-muted/20 rounded overflow-hidden">
      <div
        className="absolute bg-primary/20 border border-primary/30 rounded p-2 text-xs text-primary"
        style={{
          position: position as any,
          top,
          right,
          bottom,
          left,
          zIndex: zIndex ? Number(zIndex) : undefined,
        }}
      >
        {name}
      </div>
    </div>
    <div className="text-xs text-muted-foreground font-mono">
      position: {position}
      {top && ` • top: ${top}`}
      {right && ` • right: ${right}`}
      {bottom && ` • bottom: ${bottom}`}
      {left && ` • left: ${left}`}
      {zIndex && ` • z-index: ${zIndex}`}
    </div>
  </div>
);

const ZIndexDemo = ({
  name,
  zIndex,
  description,
  className = '',
}: {
  name: string;
  zIndex: string;
  description: string;
  className?: string;
}) => (
  <div className={`p-6 rounded-xl border bg-card space-y-4 ${className}`}>
    <div className="text-sm font-medium text-foreground">{name}</div>
    <div className="text-xs text-muted-foreground">{description}</div>
    <div className="relative h-24 bg-muted/10 border border-muted/20 rounded">
      <div
        className="absolute inset-2 bg-primary/20 border border-primary/30 rounded flex items-center justify-center text-xs text-primary"
        style={{ zIndex: Number(zIndex) }}
      >
        z-index: {zIndex}
      </div>
    </div>
    <div className="text-xs text-muted-foreground font-mono">
      z-index: {zIndex}
    </div>
  </div>
);

const StackingDemo = ({
  name,
  layers,
  className = '',
}: {
  name: string;
  layers: Array<{ name: string; zIndex: string; color: string }>;
  className?: string;
}) => (
  <div className={`p-6 rounded-xl border bg-card space-y-4 ${className}`}>
    <div className="text-sm font-medium text-foreground">{name}</div>
    <div className="relative h-32 bg-muted/10 border border-muted/20 rounded">
      {layers.map((layer, index) => (
        <div
          key={layer.name}
          className={`absolute ${layer.color} border rounded p-2 text-xs text-white`}
          style={{
            zIndex: Number(layer.zIndex),
            top: `${20 + index * 10}px`,
            left: `${20 + index * 10}px`,
            width: `${120 - index * 10}px`,
            height: `${80 - index * 5}px`,
          }}
        >
          {layer.name}
        </div>
      ))}
    </div>
    <div className="text-xs text-muted-foreground font-mono">
      {layers.map(layer => `${layer.name}: ${layer.zIndex}`).join(' • ')}
    </div>
  </div>
);

// ============================================================================
// STORIES
// ============================================================================

export const PositionTypes: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Position Types"
          subtitle="Different positioning methods and their use cases"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PositionDemo name="Static (Default)" position="static" />

          <PositionDemo
            name="Relative"
            position="relative"
            top="10px"
            left="10px"
          />

          <PositionDemo
            name="Absolute"
            position="absolute"
            top="10px"
            right="10px"
          />

          <PositionDemo name="Fixed" position="fixed" top="10px" left="10px" />

          <PositionDemo name="Sticky" position="sticky" top="10px" />

          <PositionDemo
            name="Centered Absolute"
            position="absolute"
            top="50%"
            left="50%"
          />
        </div>
      </div>
    </div>
  ),
};

export const PositioningValues: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Positioning Values"
          subtitle="Common positioning values and their effects"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PositionDemo
            name="Top Left"
            position="absolute"
            top="10px"
            left="10px"
          />

          <PositionDemo
            name="Top Right"
            position="absolute"
            top="10px"
            right="10px"
          />

          <PositionDemo
            name="Bottom Left"
            position="absolute"
            bottom="10px"
            left="10px"
          />

          <PositionDemo
            name="Bottom Right"
            position="absolute"
            bottom="10px"
            right="10px"
          />

          <PositionDemo
            name="Centered"
            position="absolute"
            top="50%"
            left="50%"
          />

          <PositionDemo
            name="Full Coverage"
            position="absolute"
            top="0"
            right="0"
            bottom="0"
            left="0"
          />

          <PositionDemo
            name="Top Center"
            position="absolute"
            top="10px"
            left="50%"
          />

          <PositionDemo
            name="Bottom Center"
            position="absolute"
            bottom="10px"
            left="50%"
          />

          <PositionDemo
            name="Left Center"
            position="absolute"
            top="50%"
            left="10px"
          />
        </div>
      </div>
    </div>
  ),
};

export const ZIndexSystem: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Z-Index System"
          subtitle="Layering elements with z-index values"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ZIndexDemo
            name="Base Layer"
            zIndex="0"
            description="Default stacking order"
          />

          <ZIndexDemo
            name="Above Base"
            zIndex="10"
            description="Slightly above base content"
          />

          <ZIndexDemo
            name="Dropdown Level"
            zIndex="1000"
            description="Navigation dropdowns"
          />

          <ZIndexDemo
            name="Sticky Level"
            zIndex="1020"
            description="Sticky headers and navigation"
          />

          <ZIndexDemo
            name="Fixed Level"
            zIndex="1030"
            description="Fixed position elements"
          />

          <ZIndexDemo
            name="Modal Level"
            zIndex="1040"
            description="Modal dialogs and overlays"
          />

          <ZIndexDemo
            name="Popover Level"
            zIndex="1050"
            description="Context menus and popovers"
          />

          <ZIndexDemo
            name="Tooltip Level"
            zIndex="1060"
            description="Tooltips and help text"
          />

          <ZIndexDemo
            name="Maximum Level"
            zIndex="9999"
            description="Highest priority elements"
          />
        </div>
      </div>
    </div>
  ),
};

export const StackingContexts: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Stacking Contexts"
          subtitle="Complex layering scenarios with multiple elements"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StackingDemo
            name="Three Layer Stack"
            layers={[
              { name: 'Base', zIndex: '0', color: 'bg-blue-500' },
              { name: 'Middle', zIndex: '10', color: 'bg-green-500' },
              { name: 'Top', zIndex: '20', color: 'bg-red-500' },
            ]}
          />

          <StackingDemo
            name="Modal Stack"
            layers={[
              { name: 'Backdrop', zIndex: '1040', color: 'bg-black/50' },
              { name: 'Modal', zIndex: '1050', color: 'bg-white' },
              { name: 'Tooltip', zIndex: '1060', color: 'bg-gray-800' },
            ]}
          />

          <StackingDemo
            name="Navigation Stack"
            layers={[
              { name: 'Header', zIndex: '1020', color: 'bg-blue-600' },
              { name: 'Dropdown', zIndex: '1030', color: 'bg-white' },
              { name: 'Tooltip', zIndex: '1040', color: 'bg-gray-800' },
            ]}
          />

          <StackingDemo
            name="Overlay Stack"
            layers={[
              { name: 'Content', zIndex: '0', color: 'bg-gray-100' },
              { name: 'Overlay', zIndex: '1050', color: 'bg-black/30' },
              { name: 'Dialog', zIndex: '1060', color: 'bg-white' },
            ]}
          />
        </div>
      </div>
    </div>
  ),
};

export const PracticalExamples: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="Practical Position Examples"
          subtitle="Real-world applications of positioning"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tooltip */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Tooltip</div>
            <div className="relative inline-block">
              <div className="bg-primary px-3 py-2 rounded text-white text-sm cursor-help">
                Hover me
              </div>
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
                style={{ zIndex: 1060 }}
              >
                This is a tooltip
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Absolute positioning with transform centering
            </div>
          </div>

          {/* Badge */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">Badge</div>
            <div className="relative inline-block">
              <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-gray-600">Icon</span>
              </div>
              <div
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                style={{ zIndex: 10 }}
              >
                3
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Absolute positioning for notification badges
            </div>
          </div>

          {/* Modal */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Modal Overlay
            </div>
            <div className="relative h-32 bg-muted/10 border border-muted/20 rounded overflow-hidden">
              <div
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                style={{ zIndex: 1040 }}
              >
                <div className="bg-white rounded-lg p-4 max-w-sm mx-4">
                  <div className="text-sm font-medium">Modal Title</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Modal content goes here
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Fixed positioning with backdrop overlay
            </div>
          </div>

          {/* Sticky Header */}
          <div className="p-6 rounded-xl border bg-card space-y-4">
            <div className="text-sm font-medium text-foreground">
              Sticky Header
            </div>
            <div className="space-y-2">
              <div
                className="bg-blue-600 text-white px-4 py-2 rounded"
                style={{ position: 'sticky', top: '0', zIndex: 1020 }}
              >
                Sticky Header
              </div>
              <div className="space-y-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 px-4 py-2 rounded text-sm"
                  >
                    Content item {i + 1}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Sticky positioning for persistent headers
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Position Guidelines"
          subtitle="Best practices for implementing positioning"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <GuidelinesCard
              title="Position Types"
              items={[
                '• Use static for normal document flow',
                '• Use relative for offset positioning',
                '• Use absolute for overlay elements',
                '• Use fixed for persistent elements',
              ]}
            />

            <GuidelinesCard
              title="Z-Index Usage"
              items={[
                '• Use semantic z-index tokens',
                '• Avoid arbitrary high values',
                '• Consider stacking context',
                '• Test layering behavior',
              ]}
            />
          </div>

          <div className="space-y-4">
            <GuidelinesCard
              title="Positioning Values"
              items={[
                '• Use percentages for responsive positioning',
                '• Use pixels for precise positioning',
                '• Use transform for centering',
                '• Consider viewport units',
              ]}
            />

            <GuidelinesCard
              title="Accessibility"
              items={[
                '• Ensure logical tab order',
                '• Maintain focus management',
                '• Consider screen readers',
                '• Test keyboard navigation',
              ]}
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
            title="Position Values"
            items={[
              '• <strong>static</strong>: Default document flow',
              '• <strong>relative</strong>: Offset from normal position',
              '• <strong>absolute</strong>: Positioned relative to nearest positioned ancestor',
              '• <strong>fixed</strong>: Positioned relative to viewport',
              '• <strong>sticky</strong>: Hybrid of relative and fixed',
            ]}
          />
          <GuidelinesSection
            title="Z-Index Tokens"
            items={[
              '• <strong>0</strong>: Base content layer',
              '• <strong>10-50</strong>: Slight elevation',
              '• <strong>1000</strong>: Dropdown menus',
              '• <strong>1020</strong>: Sticky headers',
              '• <strong>1040</strong>: Modal overlays',
              '• <strong>1060</strong>: Tooltips and popovers',
            ]}
          />
          <GuidelinesSection
            title="Common Patterns"
            items={[
              '• <strong>Centering</strong>: absolute + transform',
              '• <strong>Overlays</strong>: fixed + inset-0',
              '• <strong>Badges</strong>: absolute + negative offsets',
              '• <strong>Tooltips</strong>: absolute + positioning',
              '• <strong>Modals</strong>: fixed + backdrop',
              '• <strong>Sticky</strong>: sticky + top-0',
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
