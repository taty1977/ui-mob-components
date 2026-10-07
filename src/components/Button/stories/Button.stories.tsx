import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { Button } from '../Button';
import { Icon } from '../../Icon';

const tones = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
const variants = ['default', 'label', 'outline', 'text'] as const;

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    label: 'Continue',
    variant: 'default',
    tone: 'primary',
    size: 'md',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Text shown inside the button',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['default', 'label', 'outline', 'text'],
      table: { category: 'Appearance' },
    },
    tone: {
      control: 'select',
      options: tones,
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance' },
    },
    iconLeft: {
      control: 'boolean',
      description: 'Demo toggle: renders a chevron-left Icon node before the label',
      table: { category: 'Icons' },
    },
    iconRight: {
      control: 'boolean',
      description: 'Demo toggle: renders a chevron-right Icon node after the label',
      table: { category: 'Icons' },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Accessible name announced for the button',
      table: { category: 'Accessibility' },
    },
    accessibilityHint: {
      control: 'text',
      description: 'Optional hint announced after the accessible name',
      table: { category: 'Accessibility' },
    },
    className: {
      control: 'text',
      description: 'Extra NativeWind classes merged last',
      table: { category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ iconLeft, iconRight, size, ...args }) => (
    <Button
      {...args}
      size={size}
      iconLeft={iconLeft ? <Icon name="chevron-left" size={size ?? 'md'} /> : undefined}
      iconRight={iconRight ? <Icon name="chevron-right" size={size ?? 'md'} /> : undefined}
    />
  ),
};

export const Disabled: Story = {
  args: {
    label: 'Unavailable',
    disabled: true,
  },
};

export const VariantMatrix: Story = {
  render: () => (
    <View className="gap-5">
      {tones.map((tone) => (
        <View key={tone} className="gap-2">
          <Text className="text-13 font-semibold capitalize text-light-text-secondary dark:text-dark-text-secondary">
            {tone}
          </Text>
          <View className="flex-row flex-wrap items-center gap-2">
            {variants.map((variant) => (
              <Button
                key={`${tone}-${variant}`}
                label={variant}
                tone={tone}
                variant={variant}
                size="sm"
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  ),
};

export const Accessibility: Story = {
  args: {
    label: 'Save changes',
    accessibilityLabel: 'Save changes to your profile',
    accessibilityHint: 'Saves the current profile details',
  },
};

export const WithIcons: Story = {
  render: ({ iconLeft, iconRight, size, ...args }) => (
    <View className="gap-5">
      <Button
        {...args}
        size={size}
        iconLeft={iconLeft ? <Icon name="chevron-left" size={size ?? 'md'} /> : undefined}
        iconRight={iconRight ? <Icon name="chevron-right" size={size ?? 'md'} /> : undefined}
      />
      <View className="gap-2">
        <Text className="text-13 font-semibold text-light-text-secondary">
          All tones and variants
        </Text>
        {tones.map((tone) => (
          <View key={tone} className="flex-row flex-wrap items-center gap-2">
            {variants.map((variant) => (
              <Button
                key={`${tone}-${variant}`}
                label={variant}
                tone={tone}
                variant={variant}
                size="sm"
                iconLeft={<Icon name="chevron-left" size="sm" />}
                iconRight={<Icon name="chevron-right" size="sm" />}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  ),
};
