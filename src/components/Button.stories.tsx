import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    label: 'Continue',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
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
