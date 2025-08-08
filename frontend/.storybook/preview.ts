import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Overview',
          'Getting Started',
          'Foundations',
          'Components',
          'Charts',
        ],
      },
    },
  },
};

export default preview;
