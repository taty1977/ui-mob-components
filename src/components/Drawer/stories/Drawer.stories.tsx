import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { Text, View } from 'react-native';
import { Drawer, type DrawerItem, type DrawerProps } from '../Drawer';
import { Icon } from '../../Icon';
import { navigationTones } from '../../../themes/paletteTones';
import { useSingleActionLog } from '../../NavItem/stories/useSingleActionLog';

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

const demoItems: DrawerItem[] = [
  { label: 'Dashboard', icon: 'house', onPress: fn().mockName('Dashboard onPress') },
  { label: 'Doctors', icon: 'doctor', onPress: fn().mockName('Doctors onPress') },
  { label: 'Labs', icon: 'lab', onPress: fn().mockName('Labs onPress') },
  { label: 'Profile', icon: 'user', onPress: fn().mockName('Profile onPress') },
];

// Free-form children render below the item rows.
const demoFooter = (
  <View className="px-4 py-3">
    <Text className="text-13 text-text-secondary">Signed in as Ana Gomez</Text>
  </View>
);

// Trigger sits on the same edge the drawer opens from; item presses log onPress,
// dismissals log onClose � one Actions entry per click.
function FramedDrawer(args: DrawerProps) {
  const logged = useSingleActionLog(args.items, args.onClose);
  return (
    <View className={args.side === 'right' ? 'flex-row justify-end' : 'flex-row'}>
      <Drawer {...args} items={logged.items} onClose={logged.onClose} />
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
    items: demoItems,
    tone: 'primary',
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
    items: {
      control: 'object',
      description: 'Navigation rows: label, optional registry icon, destructive, disabled, onPress',
      table: { category: 'Content' },
    },
    children: {
      control: { type: 'radio' },
      options: ['None', 'Account footer'],
      mapping: { None: undefined, 'Account footer': demoFooter },
      description: 'Free-form panel content rendered below the items',
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
    tone: {
      control: 'select',
      options: navigationTones,
      description:
        'Brand tone (primary | secondary) for item hover/focus/press and the close button',
      table: { category: 'Appearance' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state; omit to let the trigger drive it',
      table: { category: 'State' },
    },
    onClose: {
      control: false,
      description:
        'Fired by backdrop press, close button, item selection, and Android back (stories log dismissals only; item presses log onPress)',
      table: { category: 'Events' },
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

// Disabled rows dim; destructive rows take the error tone; children render below.
export const ItemVariants: Story = {
  args: {
    tone: 'secondary',
    children: demoFooter,
    items: [
      { label: 'Dashboard', icon: 'house', onPress: fn().mockName('Dashboard onPress') },
      {
        label: 'Premium labs',
        icon: 'lock',
        disabled: true,
        onPress: fn().mockName('Premium labs onPress'),
      },
      {
        label: 'Sign out',
        icon: 'close',
        destructive: true,
        onPress: fn().mockName('Sign out onPress'),
      },
    ],
  },
};
