import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';

const meta: Meta = {
  title: 'Design System/Overview/Journey',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof meta>;

const LinkCard = ({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) => (
  <a href={`?path=/story/${href}`}>
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </a>
);

export const Showcase: Story = {
  render: () => (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">FinVision Design System Journey</h1>
        <p className="text-muted-foreground">
          Explore foundations, core components, application widgets, charts, and
          pages.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Foundations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LinkCard
            title="Colors"
            description="Brand, semantic and neutral palettes"
            href="design-system-foundations-colors--palette"
          />
          <LinkCard
            title="Typography"
            description="Font families and scales"
            href="design-system-foundations-typography--scales"
          />
          <LinkCard
            title="Spacing"
            description="8pt spacing scale"
            href="design-system-foundations-spacing--scale"
          />
          <LinkCard
            title="Radius"
            description="Border radius system"
            href="design-system-foundations-radius--scale"
          />
          <LinkCard
            title="Shadows"
            description="Elevation levels"
            href="design-system-foundations-shadows--elevation"
          />
          <LinkCard
            title="Transitions"
            description="Timing and easing"
            href="design-system-foundations-transitions--timing-and-easing"
          />
          <LinkCard
            title="Z-Index"
            description="Layering"
            href="design-system-foundations-z-index--layers"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Core Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LinkCard
            title="Button"
            description="Variants, sizes, states"
            href="design-system-button--default"
          />
          <LinkCard
            title="Input"
            description="Text, password, number"
            href="design-system-input--default"
          />
          <LinkCard
            title="Card"
            description="Content containers"
            href="design-system-card--default"
          />
          <LinkCard
            title="Select"
            description="Accessible dropdowns"
            href="design-system-select--basic"
          />
          <LinkCard
            title="Tabs"
            description="Section navigation"
            href="design-system-tabs--basic"
          />
          <LinkCard
            title="Tooltip"
            description="Context hints"
            href="design-system-tooltip--basic"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Data Visualization</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LinkCard
            title="Line Chart"
            description="Trends over time"
            href="components-charts-linechart--basic"
          />
          <LinkCard
            title="Bar Chart"
            description="Comparisons"
            href="components-charts-barchart--basic"
          />
          <LinkCard
            title="Pie Chart"
            description="Breakdowns"
            href="components-charts-piechart--basic"
          />
          <LinkCard
            title="Waterfall"
            description="Contributors"
            href="components-charts-waterfallchart--basic"
          />
          <LinkCard
            title="Theming"
            description="Token-driven chart colors (light/dark)"
            href="components-charts-theming--token-colors-light"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Application</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LinkCard
            title="AuthGuard"
            description="Route protection patterns"
            href="components-auth-authguard--default"
          />
          <LinkCard
            title="File Upload"
            description="Workflow showcase"
            href="components-fileupload--complete-workflow"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LinkCard
            title="Login"
            description="Mocked providers and real UX"
            href="pages-login--default"
          />
        </div>
      </section>

      <div className="flex items-center justify-center gap-4">
        <a href="?path=/story/design-system-foundations-colors--palette">
          <Button size="lg">Start with Colors</Button>
        </a>
        <a href="?path=/story/components-charts-theming--token-colors-light">
          <Button variant="secondary" size="lg">
            See Themed Charts
          </Button>
        </a>
      </div>
    </div>
  ),
};
