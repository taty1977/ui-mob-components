import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { fn } from 'storybook/test';
import { Pressable, View } from 'react-native';
import { Menu, type MenuItem, type MenuProps } from '../Menu';
import { Icon } from '../../Icon';
import { navigationTones } from '../../../themes/paletteTones';
import { useSingleActionLog } from '../../NavItem/stories/useSingleActionLog';

// Trigger nodes must be non-pressable; Menu wraps them in its own Pressable.
const burgerTrigger = (
  <View className="w-10 h-10 rounded-lg bg-background-canvas items-center justify-center text-text-primary">
    <Icon name="burger-menu" size="md" tone="inherit" />
  </View>
);

const demoItems: MenuItem[] = [
  { label: 'Profile', icon: 'user', onPress: fn().mockName('Profile onPress') },
  {
    label: 'Documents',
    icon: 'document',
    onPress: fn().mockName('Documents onPress'),
  },
  {
    label: 'Log out',
    icon: 'close',
    destructive: true,
    onPress: fn().mockName('Log out onPress'),
  },
];

// Right-pinned frame mirrors the header corner the menu usually opens from.
const Frame = ({ children }: { children: ReactNode }) => (
  <View className="flex-row justify-end p-4">{children}</View>
);

const tones = navigationTones;

// One Actions entry per click: item presses log onPress, dismissals log onClose.
function LoggedMenu(args: MenuProps) {
  const logged = useSingleActionLog(args.items, args.onClose);
  return <Menu {...args} items={logged.items ?? []} onClose={logged.onClose} />;
}

const meta = {
  title: 'Navigation/Menu',
  component: Menu,
  args: {
    items: demoItems,
    trigger: burgerTrigger,
    onClose: fn(),
    tone: 'primary',
  },
  argTypes: {
    items: {
      control: 'object',
      description: 'Menu entries: label, optional registry icon, destructive, disabled, onPress',
      table: { category: 'Content' },
    },
    trigger: {
      control: false,
      description: 'Anchor node; tapping opens the menu below it (uncontrolled)',
      table: { category: 'Content' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state; omit to let the trigger drive it',
      table: { category: 'State' },
    },
    tone: {
      control: 'select',
      options: tones,
      description:
        'Brand tone (primary | secondary) for item hover/focus/press; destructive items use error',
      table: { category: 'Appearance' },
    },
    onClose: {
      control: false,
      description:
        'Fired by backdrop press, item selection, and Android back (stories log dismissals only; item presses log onPress)',
      table: { category: 'Events' },
    },
    position: {
      control: 'object',
      description: 'Window-px offset for the card; measured from the trigger when uncontrolled',
      table: { category: 'Advanced' },
    },
    className: {
      control: 'text',
      description: 'Extra NativeWind classes on the menu card',
      table: { category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {
  render: (args) => (
    <Frame>
      <LoggedMenu {...args} />
    </Frame>
  ),
};

// Disabled rows dim; destructive rows take the error tone.
export const ItemVariants: Story = {
  args: {
    items: [
      {
        label: 'Refresh',
        icon: 'loop',
        onPress: fn().mockName('Refresh onPress'),
      },
      {
        label: 'Premium feature',
        icon: 'lock',
        disabled: true,
        onPress: fn().mockName('Premium feature onPress'),
      },
      {
        label: 'Delete account',
        icon: 'close',
        destructive: true,
        onPress: fn().mockName('Delete account onPress'),
      },
    ],
  },
  render: (args) => (
    <Frame>
      <LoggedMenu {...args} />
    </Frame>
  ),
};

// The Header flow: parent state drives open/onClose and pins the position.
function ControlledDemo(args: MenuProps) {
  const [open, setOpen] = useState(false);
  const logged = useSingleActionLog(args.items, args.onClose);
  return (
    <Frame>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        onPress={() => setOpen(true)}
        className="w-10 h-10 rounded-lg bg-background-canvas items-center justify-center text-text-primary"
      >
        <Icon name="burger-menu" size="md" tone="inherit" />
      </Pressable>
      <Menu
        {...args}
        items={logged.items ?? []}
        trigger={undefined}
        open={open}
        onClose={() => {
          logged.onClose();
          setOpen(false);
        }}
        position={{ top: 60, right: 16 }}
      />
    </Frame>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};
