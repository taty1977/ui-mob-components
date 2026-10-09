import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Header } from '../Header';

const meta = {
  title: 'Brand/Header',
  component: Header,
  args: {
    userName: 'Ana Gomez',
    userAvatarUrl: 'https://i.pravatar.cc/84?img=47',
    subtitle: 'How are you feeling today?',
    unreadCount: 3,
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Screen title; empty shows a greeting with userName',
      table: { category: 'Content' },
    },
    subtitle: { control: 'text', table: { category: 'Content' } },
    userName: {
      control: 'text',
      description: 'Greeting, avatar initial fallback, and profile label',
      table: { category: 'Content' },
    },
    userAvatarUrl: {
      control: 'text',
      description: 'Avatar image; empty shows the initial fallback',
      table: { category: 'Content' },
    },
    showLogo: {
      control: 'boolean',
      description: 'Brand mark on the left (avatar moves right); hidden while onPressBack is set',
      table: { category: 'Appearance' },
    },
    showStatusIndicator: { control: 'boolean', table: { category: 'Appearance' } },
    statusOnline: { control: 'boolean', table: { category: 'State' } },
    unreadCount: {
      control: 'number',
      description: 'Badge over the bell, capped at 99+',
      table: { category: 'State' },
    },
    topInset: {
      control: 'number',
      description: 'Top safe-area inset in px (pass useSafeAreaInsets().top in the app)',
      table: { category: 'Advanced' },
    },
    onPressBack: {
      control: false,
      description: 'When set, a back button replaces the logo/avatar',
      table: { category: 'Advanced' },
    },
    onPressProfile: { control: false, table: { category: 'Advanced' } },
    onPressNotification: { control: false, table: { category: 'Advanced' } },
    onPressMenu: {
      control: false,
      description: 'When set, a burger-menu button shows at the right end',
      table: { category: 'Advanced' },
    },
    className: { control: 'text', table: { category: 'Advanced' } },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {};

export const WithBackButton: Story = {
  args: { title: 'Appointments', subtitle: undefined, onPressBack: () => {} },
};

export const WithMenuButton: Story = {
  args: { onPressMenu: () => {} },
};

// Initial fallback, offline status, and the 99+ badge cap.
export const NoAvatar: Story = {
  args: { userAvatarUrl: undefined, statusOnline: false, unreadCount: 120 },
};
