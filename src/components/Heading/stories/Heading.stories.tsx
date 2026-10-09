import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import {
  Heading,
  type HeadingTone,
  type HeadingVariant,
  type HeadingWeight,
} from '../Heading';

const variants: HeadingVariant[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const tones: HeadingTone[] = [
  'default',
  'muted',
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
];
const weights: HeadingWeight[] = ['regular', 'medium', 'semibold', 'bold'];

const meta = {
  title: 'Data Display/Heading',
  component: Heading,
  args: {
    children: 'Where does it hurt?',
    variant: 'h4',
    tone: 'default',
    weight: 'bold',
  },
  argTypes: {
    children: { control: 'text', description: 'Heading text', table: { category: 'Content' } },
    variant: {
      control: 'select',
      options: variants,
      description: 'Semantic level; sets the size (46/38/28/24/18/15) and the web heading level',
      table: { category: 'Appearance' },
    },
    tone: {
      control: 'select',
      // inverse is available in code for colored surfaces; excluded from the light-canvas list.
      options: [...tones, 'inverse'],
      description: 'Text color from the theme',
      table: { category: 'Appearance' },
    },
    weight: {
      control: 'select',
      options: weights,
      description: 'Token font weight',
      table: { category: 'Appearance' },
    },
    numberOfLines: {
      control: 'number',
      description: 'Truncate with ellipsis after N lines',
      table: { category: 'Advanced' },
    },
    className: { control: 'text', table: { category: 'Advanced' } },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {};

// h1–h6 on the token scale.
export const Variants: Story = {
  render: () => (
    <View className="gap-3">
      {variants.map((variant) => (
        <Heading key={variant} variant={variant}>
          {`${variant.toUpperCase()} — Book an appointment`}
        </Heading>
      ))}
    </View>
  ),
};

// Theme tones at one size.
export const Tones: Story = {
  render: () => (
    <View className="gap-2">
      {tones.map((tone) => (
        <Heading key={tone} variant="h5" tone={tone}>
          {tone}
        </Heading>
      ))}
    </View>
  ),
};

// Four token weights at one size.
export const Weights: Story = {
  render: () => (
    <View className="gap-2">
      {weights.map((weight) => (
        <Heading key={weight} variant="h3" weight={weight}>
          {weight}
        </Heading>
      ))}
    </View>
  ),
};
