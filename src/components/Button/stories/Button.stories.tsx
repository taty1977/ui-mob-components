import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { Button } from '../Button';

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
    variant: {
      control: 'select',
      options: ['default', 'label', 'outline', 'text'],
    },
    tone: {
      control: 'select',
      options: tones,
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Accessible name announced for the button',
    },
    accessibilityHint: {
      control: 'text',
      description: 'Optional hint announced after the accessible name',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

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
