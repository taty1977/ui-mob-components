import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { Avatar, type AvatarSize } from '../Avatar';

const sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl', 'xxl'];

const demoAvatarUrl = 'https://i.pravatar.cc/96?img=47';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  args: {
    name: 'Ana Gomez',
    imageUrl: demoAvatarUrl,
    size: 'md',
    status: 'online',
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'Initial fallback and accessibility label',
      table: { category: 'Content' },
    },
    imageUrl: {
      control: 'text',
      description: 'Image URL; empty shows the name initial',
      table: { category: 'Content' },
    },
    size: {
      control: 'select',
      options: sizes,
      description: 'Named size token, like Icon sizes (md = 42px)',
      table: { category: 'Appearance' },
    },
    status: {
      control: 'select',
      // A bare undefined option would arrive as the string "undefined" (truthy).
      options: ['none', 'online', 'offline'],
      mapping: { none: undefined, online: 'online', offline: 'offline' },
      description: 'Presence dot; hidden when unset',
      table: { category: 'Appearance' },
    },
    onPress: {
      control: false,
      description: 'When set, the avatar is a button labeled "<name>\'s profile"',
      table: { category: 'Advanced' },
    },
    accessibilityLabel: { control: 'text', table: { category: 'Accessibility' } },
    className: { control: 'text', table: { category: 'Advanced' } },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {};

// All five size tokens; the dot and initial scale with the avatar.
export const Sizes: Story = {
  render: () => (
    <View className="flex-row items-end gap-4">
      {sizes.map((size) => (
        <View key={size} className="items-center gap-1">
          <Avatar name="Ana Gomez" imageUrl={demoAvatarUrl} size={size} status="online" />
          <Text className="text-12 text-text-secondary">{size}</Text>
        </View>
      ))}
    </View>
  ),
};

// Image vs initial fallback against each presence state (online / offline / none).
export const States: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <Avatar name="Ana Gomez" imageUrl={demoAvatarUrl} status="online" />
      <Avatar name="Ana Gomez" status="online" />
      <Avatar name="Ben Lee" imageUrl="https://i.pravatar.cc/96?img=12" status="offline" />
      <Avatar name="Ben Lee" status="offline" />
      <Avatar name="Cleo Diaz" imageUrl="https://i.pravatar.cc/96?img=32" />
      <Avatar name="Cleo Diaz" />
    </View>
  ),
};
