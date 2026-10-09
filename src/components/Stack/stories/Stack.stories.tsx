import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import type { ReactElement } from 'react';
import { View } from 'react-native';
import { Stack } from '../Stack';
import { BodyText } from '../../BodyText';

// --- Fixtures --------------------------------------------------------------------

// Small themed box used as stack content.
const Box = ({ label }: { label: string }): ReactElement => (
  <View className="rounded-md border border-palette-primary-opacity-main bg-palette-primary-opacity-lighter px-4 py-2">
    <BodyText variant="body2" tone="primary">
      {label}
    </BodyText>
  </View>
);

const threeBoxes = [
  <Box key="1" label="First" />,
  <Box key="2" label="Second" />,
  <Box key="3" label="Third" />,
];

// --- Meta ------------------------------------------------------------------------

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: { children: threeBoxes, gap: 2 },
  argTypes: {
    children: { control: false, table: { category: 'Content' } },
    // Appearance
    direction: {
      control: 'radio',
      options: ['column', 'row'],
      description: 'column (default) stacks vertically; row horizontally',
      table: { category: 'Appearance' },
    },
    gap: {
      control: 'select',
      options: [0, 1, 2, 3, 4, 5, 6, 8],
      description: 'Gap between children on the token spacing scale',
      table: { category: 'Appearance' },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Cross-axis alignment; stretch is RN’s default',
      table: { category: 'Appearance' },
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Main-axis distribution; start is RN’s default',
      table: { category: 'Appearance' },
    },
    wrap: { control: 'boolean', table: { category: 'Appearance' } },
    flex: {
      control: 'boolean',
      description: 'Grow to fill the parent (flex-1)',
      table: { category: 'Appearance' },
    },
    // Advanced
    className: { control: 'text', table: { category: 'Advanced' } },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {};

// Horizontal stack that wraps onto multiple lines.
export const Row: Story = {
  args: { direction: 'row', gap: 3, wrap: true },
};

// Horizontal stack with even distribution across the parent width.
export const SpacedEvenly: Story = {
  args: { direction: 'row', justify: 'between', gap: 0, flex: true },
};
