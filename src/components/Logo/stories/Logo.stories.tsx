import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Logo } from '../Logo';

const meta = {
  title: 'Brand‑Specific/Logo',
  component: Logo,
  args: {
    variant: 'horizontal',
    size: 48,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['horizontal', 'stacked', 'icon'],
      description: 'horizontal = mark + wordmark, stacked = mark above centered wordmark, icon = mark only',
      table: { category: 'Appearance' },
    },
    size: {
      control: { type: 'range', min: 16, max: 128, step: 4 },
      description: 'Pixel dimensions (square)',
      table: { category: 'Appearance' },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Accessible name announced for the logo',
      table: { category: 'Accessibility' },
    },
    className: {
      control: 'text',
      description: 'Extra NativeWind classes on the Svg, merged last',
      table: { category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <View className="flex-row items-end gap-4">
      {[24, 48, 96].map((size) => (
        <Logo key={size} {...args} variant="icon" size={size} />
      ))}
    </View>
  ),
};
