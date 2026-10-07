import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      modulesToTranspile: ['nativewind', 'react-native-css-interop'],
      pluginReactOptions: {
        jsxImportSource: 'nativewind',
      },
    },
  },
};

export default config;
