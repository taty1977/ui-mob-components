import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Screen } from '../Screen';
import { BodyText } from '../../BodyText';
import type { FooterTab } from '../../Footer';

// --- Fixtures --------------------------------------------------------------------

// App sections for the bottom-nav stories.
const APP_TABS: FooterTab[] = [
  { label: 'Today', icon: 'house' },
  { label: 'Labs', icon: 'lab' },
  { label: 'Doctor', icon: 'doctor' },
  { label: 'Messages', icon: 'bell' },
  { label: 'Me', icon: 'user' },
];

// Placeholder cards, tall enough to overflow the fixed frame and show the scroll.
const SECTIONS = [
  'Today\'s overview',
  'Upcoming',
  'Recent activity',
  'Vitals',
  'Medications',
  'Appointments',
  'Activity',
  'Reports',
];

const content = (
  <View className="gap-2 py-4">
    {SECTIONS.map((title) => (
      <View
        key={title}
        className="rounded-md border border-border-subtle bg-background-surface p-4 gap-1"
      >
        <BodyText variant="subtitle2">{title}</BodyText>
        <BodyText variant="body2" tone="muted">
          Screen content goes here.
        </BodyText>
      </View>
    ))}
  </View>
);

// --- Meta ------------------------------------------------------------------------

const meta = {
  title: 'Layout/Screen',
  component: Screen,
  args: {
    children: content,
    header: { title: 'Today', unreadCount: 2 },
    footer: { variant: 'tabs', tabs: APP_TABS, activeTab: 'Today' },
  },
  argTypes: {
    // Content
    children: { control: false, table: { category: 'Content' } },
    header: {
      control: 'object',
      description: 'Header props; hidden when unset',
      table: { category: 'Content' },
    },
    footer: {
      control: 'object',
      description: 'Footer props; hidden when unset',
      table: { category: 'Content' },
    },
    // Appearance
    scrollable: {
      control: 'boolean',
      description: 'Wrap the content in a ScrollView; false when the content scrolls itself (e.g. a FlatList)',
      table: { category: 'Appearance' },
    },
    // Advanced
    className: { control: 'text', table: { category: 'Advanced' } },
    contentClassName: { control: 'text', table: { category: 'Advanced' } },
  },
  // Full-bleed (no phone chrome) at exactly viewport height: the body scrolls
  // while the header/footer stay pinned, and the page itself never scrolls.
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <View className="h-screen">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Screen>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {};

// Centered legal/meta footer instead of the tab bar.
export const MetaFooter: Story = {
  args: { footer: { variant: 'meta', needHelp: 'Need help? Call 1-800-555-1234' } },
};

// No header or footer — content only.
export const Bare: Story = {
  args: { header: undefined, footer: undefined },
};
