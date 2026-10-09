import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Pressable, View } from 'react-native';
import { Menu, type MenuItem, type MenuProps } from '../Menu';
import { Icon } from '../../Icon';

// Trigger nodes must be non-pressable; Menu wraps them in its own Pressable.
const burgerTrigger = (
  <View className="w-10 h-10 rounded-lg bg-misc-body-bg items-center justify-center text-text-primary">
    <Icon name="burger-menu" size="md" tone="inherit" />
  </View>
);

const demoItems: MenuItem[] = [
  { label: 'Profile', icon: 'user' },
  { label: 'Documents', icon: 'document' },
  { label: 'Log out', icon: 'close', destructive: true },
];

// Right-pinned frame mirrors the header corner the menu usually opens from.
const Frame = ({ children }: { children: ReactNode }) => (
  <View className="flex-row justify-end p-4">{children}</View>
);

const meta = {
  title: 'Navigation/Menu',
  component: Menu,
  args: {
    items: demoItems,
    trigger: burgerTrigger,
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
    onClose: {
      control: false,
      description: 'Fired by backdrop press, item selection, and Android back',
      table: { category: 'Advanced' },
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
      <Menu {...args} />
    </Frame>
  ),
};

// Disabled rows dim; destructive rows take the error tone.
export const ItemVariants: Story = {
  render: () => (
    <Frame>
      <Menu
        trigger={burgerTrigger}
        items={[
          { label: 'Refresh', icon: 'loop' },
          { label: 'Premium feature', icon: 'lock', disabled: true },
          { label: 'Delete account', icon: 'close', destructive: true },
        ]}
      />
    </Frame>
  ),
};

// The Header flow: parent state drives open/onClose and pins the position.
function ControlledDemo(args: MenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <Frame>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        onPress={() => setOpen(true)}
        className="w-10 h-10 rounded-lg bg-misc-body-bg items-center justify-center text-text-primary"
      >
        <Icon name="burger-menu" size="md" tone="inherit" />
      </Pressable>
      <Menu
        {...args}
        trigger={undefined}
        open={open}
        onClose={() => setOpen(false)}
        position={{ top: 60, right: 16 }}
      />
    </Frame>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};
