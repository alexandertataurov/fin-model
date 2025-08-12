import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Title, Stories } from '@storybook/blocks';
import { AspectRatio } from '../../components/AspectRatio';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Separator } from '../../components/Separator';
import {
  AnimatedBanner,
  SectionHeader,
  GuidelinesSection,
  GuidelinesCard,
  PhilosophyItem
} from '../components';

const meta: Meta = {
  title: 'Design System/2 - Layout/AspectRatio',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Layout: AspectRatio"
            subtitle="Maintain consistent proportions across different screen sizes and content types. Perfect for responsive images, videos, charts, and UI elements."
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
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

export const Foundation: Story = {
  render: () => (
    <div className="space-y-16">
      <div>
        <SectionHeader
          title="AspectRatio Foundation"
          subtitle="Core aspect ratios for consistent layout proportions"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">16:9</CardTitle>
              <CardDescription>Standard video format</CardDescription>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={16 / 9}>
                <div className="w-full h-full rounded-md border bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-sm font-medium text-blue-800">
                  Video Content
                </div>
              </AspectRatio>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1:1</CardTitle>
              <CardDescription>Square format</CardDescription>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={1}>
                <div className="w-full h-full rounded-md border bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-sm font-medium text-green-800">
                  Profile Photos
                </div>
              </AspectRatio>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4:3</CardTitle>
              <CardDescription>Traditional format</CardDescription>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={4 / 3}>
                <div className="w-full h-full rounded-md border bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-sm font-medium text-purple-800">
                  Legacy Content
                </div>
              </AspectRatio>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">21:9</CardTitle>
              <CardDescription>Ultrawide format</CardDescription>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={21 / 9}>
                <div className="w-full h-full rounded-md border bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-sm font-medium text-orange-800">
                  Hero Images
                </div>
              </AspectRatio>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const UseCases: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Common Use Cases"
          subtitle="Real-world applications of aspect ratios in modern interfaces"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Media Content</CardTitle>
              <CardDescription>Videos, images, and interactive media</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">16:9</Badge>
                  <span className="text-sm text-muted-foreground">Video players, presentations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">1:1</Badge>
                  <span className="text-sm text-muted-foreground">Profile pictures, social media</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">3:2</Badge>
                  <span className="text-sm text-muted-foreground">Photography, galleries</span>
                </div>
              </div>

              <AspectRatio ratio={16 / 9}>
                <div className="w-full h-full rounded-md border bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-2">▶️</div>
                    <div className="text-sm font-medium text-indigo-800">Video Player</div>
                  </div>
                </div>
              </AspectRatio>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Visualization</CardTitle>
              <CardDescription>Charts, graphs, and analytics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">2:1</Badge>
                  <span className="text-sm text-muted-foreground">Financial charts, dashboards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">3:1</Badge>
                  <span className="text-sm text-muted-foreground">Timeline views, progress bars</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">1:1</Badge>
                  <span className="text-sm text-muted-foreground">Pie charts, radial displays</span>
                </div>
              </div>

              <AspectRatio ratio={2 / 1}>
                <div className="w-full h-full rounded-md border bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-medium text-emerald-800">Financial Chart</div>
                  </div>
                </div>
              </AspectRatio>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const ResponsiveDesign: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Responsive Design Patterns"
          subtitle="How aspect ratios adapt across different screen sizes"
        />

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Mobile-First Approach</CardTitle>
              <CardDescription>Optimizing aspect ratios for mobile devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">Mobile</div>
                  <AspectRatio ratio={4 / 3}>
                    <div className="w-full h-full rounded-md border bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-xs font-medium text-pink-800">
                      4:3
                    </div>
                  </AspectRatio>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">Tablet</div>
                  <AspectRatio ratio={16 / 10}>
                    <div className="w-full h-full rounded-md border bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xs font-medium text-blue-800">
                      16:10
                    </div>
                  </AspectRatio>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">Desktop</div>
                  <AspectRatio ratio={16 / 9}>
                    <div className="w-full h-full rounded-md border bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-xs font-medium text-green-800">
                      16:9
                    </div>
                  </AspectRatio>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">Ultrawide</div>
                  <AspectRatio ratio={21 / 9}>
                    <div className="w-full h-full rounded-md border bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-xs font-medium text-purple-800">
                      21:9
                    </div>
                  </AspectRatio>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const InteractiveExamples: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Interactive Examples"
          subtitle="See aspect ratios in action with real content"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Product Gallery</CardTitle>
              <CardDescription>Consistent image proportions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AspectRatio ratio={1}>
                <div className="w-full h-full rounded-md border bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📱</div>
                    <div className="text-sm font-medium text-amber-800">Product Image</div>
                  </div>
                </div>
              </AspectRatio>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button variant="outline" size="sm">Add to Cart</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
              <CardDescription>Maintain video proportions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AspectRatio ratio={16 / 9}>
                <div className="w-full h-full rounded-md border bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎥</div>
                    <div className="text-sm font-medium text-red-800">Video Preview</div>
                  </div>
                </div>
              </AspectRatio>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Play</Button>
                <Button variant="outline" size="sm">Fullscreen</Button>
              </div>
            </CardContent>
          </Card>
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
          title="Usage Guidelines"
          subtitle="Best practices for implementing aspect ratios"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <GuidelinesCard
              title="Content Types"
              items={[
                "• Videos: Use 16:9 for standard content",
                "• Images: 1:1 for social media, 3:2 for photography",
                "• Charts: 2:1 for financial data, 1:1 for circular charts",
                "• Hero sections: 21:9 for dramatic impact"
              ]}
            />

            <GuidelinesCard
              title="Responsive Behavior"
              items={[
                "• Maintain aspect ratios across breakpoints",
                "• Consider mobile-first design principles",
                "• Use container queries for dynamic layouts",
                "• Test on various screen sizes"
              ]}
            />
          </div>

          <div className="space-y-4">
            <GuidelinesCard
              title="Performance"
              items={[
                "• Pre-calculate aspect ratios for better performance",
                "• Use CSS custom properties for dynamic ratios",
                "• Optimize images for specific aspect ratios",
                "• Consider lazy loading for multiple ratios"
              ]}
            />

            <GuidelinesCard
              title="Accessibility"
              items={[
                "• Ensure content remains readable at all ratios",
                "• Maintain sufficient contrast in all states",
                "• Consider screen reader compatibility",
                "• Test with zoom and magnification tools"
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Complete AspectRatio Documentation"
          subtitle="Comprehensive guide to maintaining consistent proportions"
        />

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 break-words">🌟 Design Philosophy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <PhilosophyItem
                color="#3b82f6"
                title="Consistent Proportions"
                description="Maintain visual harmony across different screen sizes and content types"
              />
              <PhilosophyItem
                color="#10b981"
                title="Responsive Design"
                description="Adapt aspect ratios for optimal viewing on all devices"
              />
            </div>
            <div className="space-y-4">
              <PhilosophyItem
                color="#8b5cf6"
                title="Content Optimization"
                description="Choose ratios that enhance content presentation and user experience"
              />
              <PhilosophyItem
                color="#f59e0b"
                title="Performance Focus"
                description="Efficient implementation that doesn't impact page load times"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
          <h4 className="text-xl font-semibold text-gray-900 mb-6 break-words">🚀 Implementation Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GuidelinesSection
              title="Standard Ratios"
              items={[
                "• <strong>16:9</strong>: Video content, presentations",
                "• <strong>1:1</strong>: Profile images, social media",
                "• <strong>4:3</strong>: Traditional content, legacy media",
                "• <strong>21:9</strong>: Hero sections, ultrawide displays"
              ]}
            />
            <GuidelinesSection
              title="Specialized Ratios"
              items={[
                "• <strong>2:1</strong>: Financial charts, dashboards",
                "• <strong>3:2</strong>: Photography, galleries",
                "• <strong>3:1</strong>: Timeline views, progress bars",
                "• <strong>Golden Ratio</strong>: Aesthetic compositions"
              ]}
            />
            <GuidelinesSection
              title="Best Practices"
              items={[
                "• Choose ratios based on content type",
                "• Consider responsive behavior",
                "• Maintain accessibility standards",
                "• Test across devices and browsers"
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  ),
};
