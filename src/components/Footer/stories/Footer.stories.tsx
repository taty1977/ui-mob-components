import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { Text, View } from 'react-native';
import { Footer } from '../Footer';
import type { FooterProps, FooterTab } from '../Footer';
import { Drawer } from '../../Drawer';
import { Icon, type IconName } from '../../Icon';

// --- Fixtures --------------------------------------------------------------------

// App sections for the bottom-nav stories.
const APP_TABS: FooterTab[] = [
  { label: 'Dashboard', icon: 'house' },
  { label: 'Doctors', icon: 'doctor' },
  { label: 'Labs', icon: 'lab' },
  { label: 'Menu', icon: 'menu' },
];

const drawerDestinations: { label: string; icon: IconName }[] = [
  { label: 'Profile', icon: 'user' },
  { label: 'Documents', icon: 'document' },
  { label: 'Log out', icon: 'close' },
];

const drawerContent = (
  <View className="gap-1 py-2">
    {drawerDestinations.map((item) => (
      <View key={item.label} className="flex-row items-center gap-3 px-4 py-3">
        <Icon name={item.icon} size="md" tone="primary" />
        <Text className="text-15 text-text-primary">{item.label}</Text>
      </View>
    ))}
  </View>
);

// --- Meta ------------------------------------------------------------------------

const meta = {
  title: 'Brand‑Specific/Footer',
  component: Footer,
  args: {
    needHelp: 'Need help? Our care team is here Mon–Fri, 8am–8pm EST at 1-800-555-1234',
    termsLine: 'By logging in, you confirm that you have read and agree to our Terms of Service and Privacy Policy.',
    version: 'v2.4.0 (Build 89201)',
    // The default variant is tabs; these populate the Playground's tab bar.
    tabs: APP_TABS,
    defaultTab: 'Dashboard',
    onTabPress: fn(),
  },
  argTypes: {
    // Content
    copyright: {
      control: 'text',
      description: 'Copyright line; empty falls back to "© <current year> AllInOne Health, Inc."',
      table: { category: 'Content' },
    },
    version: {
      control: 'text',
      description: 'Build/version text under the copyright line',
      table: { category: 'Content' },
    },
    needHelp: {
      control: 'text',
      description: 'Help line above the copyright; hidden when empty',
      table: { category: 'Content' },
    },
    termsLine: {
      control: 'text',
      description: "Terms/privacy line between the help text and copyright; '' hides it",
      table: { category: 'Content' },
    },
    tabs: {
      control: 'object',
      description: 'Tab items for the bottom nav bar (variant="tabs"); empty bar when unset',
      table: { category: 'Content' },
    },
    // Appearance
    variant: {
      control: 'select',
      options: ['meta', 'tabs'],
      description: 'meta = centered text block; tabs = bottom navigation bar',
      table: { category: 'Appearance' },
    },
    tone: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'secondary', 'error', 'warning', 'info', 'success', 'inverse'],
      description: 'Text tone for the meta lines and inactive tabs',
      table: { category: 'Appearance' },
    },
    activeTone: {
      control: 'select',
      options: ['primary', 'secondary', 'error', 'warning', 'info', 'success'],
      description: 'Active tab color, like Button tones (variant="tabs")',
      table: { category: 'Appearance' },
    },
    // State
    activeTab: {
      control: 'text',
      description: 'Label of the active tab; omit to manage internally (variant="tabs")',
      table: { category: 'State' },
    },
    defaultTab: {
      control: 'text',
      description: 'Initial active tab when uncontrolled (variant="tabs")',
      table: { category: 'State' },
    },
    // Actions
    onTabPress: {
      control: false,
      description: 'Called with the pressed tab label (variant="tabs")',
      table: { category: 'Actions' },
    },
    bottomInset: {
      control: 'number',
      description: 'Bottom safe-area inset in px (pass useSafeAreaInsets().bottom in the app)',
      table: { category: 'Advanced' },
    },
    className: { control: 'text', table: { category: 'Advanced' } },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

// The Menu tab opens the drawer; other tabs switch normally.
function FooterWithDrawer(args: FooterProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <Footer
        {...args}
        onTabPress={(label) => {
          args.onTabPress?.(label);
          if (label === 'Menu') setDrawerOpen(true);
        }}
      />
      <Drawer open={drawerOpen} side="right" onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
}

export const Playground: Story = {
  // Full canvas: the drawer overlay must cover the tab bar and frame chrome.
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <View className="min-h-screen justify-end">
      <FooterWithDrawer {...args} />
    </View>
  ),
};

// Bottom navigation bar with the five app sections.
export const BottomNav: Story = {
  args: { variant: 'tabs' },
};

// Default copyright only — no help, terms, or version lines.
export const Bare: Story = {
  args: {
    variant: 'meta',
    copyright: undefined,
    version: undefined,
    needHelp: undefined,
    termsLine: undefined,
  },
};
