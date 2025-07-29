import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './resizable';

const defaultProps = {
  direction: 'horizontal' as const,
  onLayout: () => {},
};

describe('Resizable Components', () => {
  it('renders ResizablePanelGroup with correct attributes', () => {
    render(
      <ResizablePanelGroup {...defaultProps}>
        <ResizablePanel defaultSize={50}>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>Panel 2</ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(
      screen.getByText('Panel 1').closest('[data-slot="resizable-panel-group"]')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Panel 1').closest('[data-slot="resizable-panel"]')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Panel 2').closest('[data-slot="resizable-panel"]')
    ).toBeInTheDocument();
  });

  it('renders ResizableHandle with handle icon when withHandle is true', () => {
    render(
      <ResizablePanelGroup {...defaultProps}>
        <ResizablePanel defaultSize={50}>Panel 1</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>Panel 2</ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="resizable-handle-icon"]')
    ).toBeInTheDocument();
  });

  it('applies custom className to all components', () => {
    render(
      <ResizablePanelGroup {...defaultProps} className="group-class">
        <ResizablePanel defaultSize={50} className="panel-class">
          Panel 1
        </ResizablePanel>
        <ResizableHandle className="handle-class" />
        <ResizablePanel defaultSize={50} className="panel-class">
          Panel 2
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(
      screen.getByText('Panel 1').closest('[data-slot="resizable-panel-group"]')
    ).toHaveClass('group-class');
    expect(
      screen.getByText('Panel 1').closest('[data-slot="resizable-panel"]')
    ).toHaveClass('panel-class');
    expect(
      document.querySelector('[data-slot="resizable-handle"]')
    ).toHaveClass('handle-class');
  });

  it('maintains ARIA attributes for accessibility', () => {
    render(
      <ResizablePanelGroup {...defaultProps} aria-label="Resizable panels">
        <ResizablePanel defaultSize={50} aria-label="First panel">
          Panel 1
        </ResizablePanel>
        <ResizableHandle aria-label="Resize handle" />
        <ResizablePanel defaultSize={50} aria-label="Second panel">
          Panel 2
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByLabelText('Resizable panels')).toBeInTheDocument();
    expect(screen.getByLabelText('First panel')).toBeInTheDocument();
    expect(screen.getByLabelText('Second panel')).toBeInTheDocument();
    expect(screen.getByLabelText('Resize handle')).toBeInTheDocument();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    const handleKeyDown = jest.fn();

    render(
      <ResizablePanelGroup {...defaultProps}>
        <ResizablePanel defaultSize={50}>Panel 1</ResizablePanel>
        <ResizableHandle onKeyDown={handleKeyDown} />
        <ResizablePanel defaultSize={50}>Panel 2</ResizablePanel>
      </ResizablePanelGroup>
    );

    const handle = screen.getByRole('separator');
    if (handle) {
      await user.tab();
      expect(handle).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(handleKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'ArrowRight',
        })
      );
    }
  });
});
