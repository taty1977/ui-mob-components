import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
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
