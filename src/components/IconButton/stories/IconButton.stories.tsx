import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { fn } from 'storybook/test';
import { a11yProps } from '../../../utils/a11yProps';
import { iconPaths, type IconName, type IconSize } from '../../Icon';
import { IconButton } from '../IconButton';

// Control options derive from the registry and the tone set.
const names = Object.keys(iconPaths) as IconName[];
const sizes: IconSize[] = ['sm', 'md', 'lg', 'xl', 'xxl'];
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

// Badge adornment for the children demo toggle — mirrors the Header bell badge.
// Hidden from AT: visible text inside a labeled control trips label-content-name-mismatch.
const demoBadge = (show: unknown, count: number) =>
  show ? (
    <View
      {...a11yProps(true)}
      className="absolute -top-1 -right-0.5 min-w-4 h-4 px-1 rounded-full items-center justify-center bg-error-800"
    >
      <Text className="text-[9px] font-bold text-misc-bg-white">
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  ) : undefined;

const meta = {
  title: 'Inputs/IconButton',
  component: IconButton,
  args: {
    name: 'bell',
    size: 'lg',
    tone: 'inherit',
    disabled: false,
    children: false,
    accessibilityLabel: 'Notifications',
    onPress: fn(),
    onLongPress: fn(),
  },
  argTypes: {
    name: {
      control: 'select',
      options: names,
      table: { category: 'Content' },
    },
    children: {
      control: 'boolean',
      description: 'Demo toggle: renders an unread-count badge adornment over the icon',
      table: { category: 'Content' },
    },
    size: {
      control: 'select',
      options: sizes,
      table: { category: 'Appearance' },
    },
    tone: {
      control: 'select',
      options: tones,
      table: { category: 'Appearance' },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Accessible name — required for icon-only buttons',
      table: { category: 'Accessibility' },
    },
    hitSlop: {
      control: false,
      description:
        'Extra touch area — defaults to the slop reaching the platform minimum target (44pt/48dp) for the size',
      table: { category: 'Advanced' },
    },
    onPress: {
      control: false,
      table: { category: 'Events' },
    },
    onLongPress: {
      control: false,
      table: { category: 'Events' },
    },
    className: {
      control: 'text',
      description: 'Extra NativeWind classes on the Pressable, merged last',
      table: { category: 'Advanced' },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {
  render: ({ children, ...args }) => (
    <IconButton {...args}>{demoBadge(children, 3)}</IconButton>
  ),
};

// --- Galleries --------------------------------------------------------------------

export const Sizes: Story = {
  render: ({ children, ...args }) => (
    <View className="flex-row items-center gap-2">
      {sizes.map((size) => (
        <IconButton key={size} {...args} size={size} accessibilityLabel={`${size} icon button`}>
          {demoBadge(children, 3)}
        </IconButton>
      ))}
    </View>
  ),
};

export const Tones: Story = {
  render: ({ children, ...args }) => (
    <View className="flex-row flex-wrap items-center gap-2">
      {tones.map((tone) => (
        <IconButton key={tone} {...args} tone={tone} accessibilityLabel={`${tone} icon button`}>
          {demoBadge(children, 3)}
        </IconButton>
      ))}
    </View>
  ),
};

// --- Adornments (children) ---------------------------------------------------------

export const WithBadge: Story = {
  args: { name: 'bell', accessibilityLabel: 'Notifications, 3 unread' },
  render: (args) => (
    <View className="flex-row items-center gap-4">
      <IconButton {...args}>{demoBadge(true, 3)}</IconButton>
      <IconButton {...args} accessibilityLabel="Notifications, 99+ unread">
        {demoBadge(true, 120)}
      </IconButton>
    </View>
  ),
};

// --- States ------------------------------------------------------------------------

export const Disabled: Story = {
  args: { disabled: true },
};
