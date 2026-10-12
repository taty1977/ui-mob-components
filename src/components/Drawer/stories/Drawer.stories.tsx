import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { Text, View } from 'react-native';
import { Drawer, type DrawerProps } from '../Drawer';
import { Icon, type IconName } from '../../Icon';

// Trigger nodes must be non-pressable; Drawer wraps them in its own Pressable.
const menuTrigger = (
  <View className="w-10 h-10 rounded-lg bg-background-canvas items-center justify-center">
    <Icon name="menu" size="md" tone="primary" />
  </View>
);

const profileTrigger = (
  <View className="w-10 h-10 rounded-full bg-palette-primary-opacity-light items-center justify-center">
    <Icon name="user" size="md" tone="primary" />
  </View>
);

const demoDestinations: { label: string; icon: IconName }[] = [
  { label: 'Dashboard', icon: 'house' },
  { label: 'Doctors', icon: 'doctor' },
  { label: 'Labs', icon: 'lab' },
  { label: 'Profile', icon: 'user' },
];

const demoContent = (
  <View className="gap-1 py-2">
    {demoDestinations.map((item) => (
      <View key={item.label} className="flex-row items-center gap-3 px-4 py-3">
        <Icon name={item.icon} size="md" tone="primary" />
        <Text className="text-15 text-text-primary">{item.label}</Text>
      </View>
    ))}
  </View>
);

// Trigger sits on the same edge the drawer opens from.
function FramedDrawer(args: DrawerProps) {
  return (
    <View className={args.side === 'right' ? 'flex-row justify-end' : 'flex-row'}>
      <Drawer {...args} />
    </View>
  );
}

const meta = {
  title: 'Navigation/Drawer',
  component: Drawer,
  // Overlay stories skip the phone frame so the drawer covers the whole canvas.
  parameters: { layout: 'fullscreen' },
  render: (args) => <FramedDrawer {...args} />,
  args: {
    trigger: menuTrigger,
    children: demoContent,
    onClose: fn(),
  },
  argTypes: {
    trigger: {
      control: { type: 'radio' },
      options: ['Menu button', 'Profile button'],
      mapping: { 'Menu button': menuTrigger, 'Profile button': profileTrigger },
      description: 'Anchor node; tapping opens the drawer (uncontrolled)',
      table: { category: 'Content' },
    },
    children: {
      control: { type: 'radio' },
      options: ['Navigation', 'Empty'],
      mapping: { Navigation: demoContent, Empty: undefined },
      description: 'Drawer panel content',
      table: { category: 'Content' },
    },
    side: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Screen edge the panel sits on',
      table: { category: 'Appearance' },
    },
    width: {
      control: 'number',
      description: 'Panel width in px',
      table: { category: 'Appearance' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state; omit to let the trigger drive it',
      table: { category: 'State' },
    },
    onClose: {
      control: false,
      description: 'Fired by backdrop press and Android back',
      table: { category: 'Actions' },
    },
    className: {
      control: 'text',
      description: 'Extra NativeWind classes on the panel',
      table: { category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {};

export const RightSide: Story = {
  args: { side: 'right' },
};

export const LeftSide: Story = {
  args: { side: 'left' },
};