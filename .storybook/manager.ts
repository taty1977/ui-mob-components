import { addons } from 'storybook/manager-api';

addons.setConfig({
  sidebar: {
    // Start with every top-level group expanded instead of collapsed.
    collapsedRoots: [],
  },
});
