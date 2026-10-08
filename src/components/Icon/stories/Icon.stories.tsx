import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { Icon } from '../Icon';
import { iconPaths, type IconName } from '../paths';

// Control options derive from the registry and the tone set.
const names = Object.keys(iconPaths) as IconName[];
const tones = [
  'inherit',
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
  'muted',
  'inverse',
] as const;

const meta = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    name: 'plus',
    size: 'md',
    tone: 'primary',
  },
  argTypes: {
    name: {
      control: 'select',
      options: names,
      table: { category: 'Content' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'xxl'],
      table: { category: 'Appearance' },
    },
    tone: {
      control: 'select',
      options: tones,
      table: { category: 'Appearance' },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Accessible name announced for the icon',
      table: { category: 'Accessibility' },
    },
    className: {
      control: 'text',
      description: 'Extra NativeWind classes on the Svg, merged last',
      table: { category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {};

export const Gallery: Story = {
  render: (args) => (
    <View className="flex-row flex-wrap gap-4">
      {names.map((name) => (
        <View key={name} className="items-center gap-1">
          <Icon name={name} size={args.size} tone={args.tone} />
          <Text className="text-13 text-light-text-secondary">{name}</Text>
        </View>
      ))}
    </View>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <View className="gap-3">
      {tones.map((tone) => (
        <View key={tone} className="flex-row items-center gap-2">
          <Icon name={args.name} size={args.size} tone={tone} />
          <Text className="text-13 capitalize text-light-text-secondary">{tone}</Text>
        </View>
      ))}
    </View>
  ),
};
