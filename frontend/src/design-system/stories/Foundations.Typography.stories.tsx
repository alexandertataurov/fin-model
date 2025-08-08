import { tokens } from '../tokens';

const meta = {
  title: 'Design System/Foundations/Typography',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

export const Scales = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Font Families</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(tokens.typography.fontFamily).map(
            ([name, families]) => (
              <div key={name} className="p-4 rounded-lg border bg-card">
                <div className="text-sm text-muted-foreground">{name}</div>
                <div
                  style={{ fontFamily: (families as string[]).join(', ') }}
                  className="text-xl"
                >
                  The quick brown fox
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Font Sizes</h3>
        <div className="space-y-3">
          {Object.entries(tokens.typography.fontSize).map(([name, [size]]) => (
            <div key={name} className="flex items-baseline gap-4">
              <div className="w-24 text-sm text-muted-foreground">{name}</div>
              <div style={{ fontSize: String(size) }} className="font-medium">
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const Weights = {
  render: () => (
    <div className="space-y-3">
      {Object.entries(tokens.typography.fontWeight).map(([name, weight]) => (
        <div key={name} className="flex items-baseline gap-4">
          <div className="w-24 text-sm text-muted-foreground">{name}</div>
          <div style={{ fontWeight: Number(weight as string) }}>
            The quick brown fox jumps over the lazy dog ({String(weight)})
          </div>
        </div>
      ))}
    </div>
  ),
};
