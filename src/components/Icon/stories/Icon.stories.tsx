import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { Icon } from '../Icon';
import { iconPaths, type IconName } from '../paths';

const names = Object.keys(iconPaths) as IconName[];

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
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    tone: {
      control: 'select',
      options: ['inherit', 'primary', 'secondary', 'error', 'warning', 'info', 'success', 'muted', 'inverse'],
      table: { category: 'Appearance' },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Accessible name announced for the icon',
      table: { category: 'Accessibility' },
    },
    className: {
      control: 'text',
      description: 'Extra NativeWind classes merged last',
      table: { category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Gallery: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-4">
      {names.map((name) => (
        <View key={name} className="items-center gap-1">
          <Icon name={name} tone="primary" />
          <Text className="text-13 text-light-text-secondary">{name}</Text>
        </View>
      ))}
    </View>
  ),
};

export const InButtons: Story = {
  render: () => (
    <View className="gap-3">
      <View className="flex-row items-center gap-2">
        <Icon name="chevron-left" size="sm" tone="muted" />
        <Text className="text-15 text-light-text-primary">Icons scale alongside text</Text>
        <Icon name="chevron-right" size="sm" tone="muted" />
      </View>
    </View>
  ),
};
