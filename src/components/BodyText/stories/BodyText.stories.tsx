import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import {
  BodyText,
  type BodyTextTone,
  type BodyTextVariant,
  type BodyTextWeight,
} from '../BodyText';

const variants: BodyTextVariant[] = [
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'caption',
  'overline',
];
const tones: BodyTextTone[] = [
  'default',
  'muted',
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
];
const weights: BodyTextWeight[] = ['regular', 'medium', 'semibold', 'bold'];

const meta = {
  title: 'Data Display/BodyText',
  component: BodyText,
  args: {
    children: 'The patient reports mild headaches since Tuesday.',
    variant: 'body1',
    tone: 'default',
  },
  argTypes: {
    children: { control: 'text', description: 'Text content', table: { category: 'Content' } },
    variant: {
      control: 'select',
      options: variants,
      description: 'MUI-style variant; sets size (18/15/15/13/12/12) and default weight',
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
      // "auto" keeps the variant default; a bare undefined option arrives as a string.
      options: ['auto', ...weights],
      mapping: { auto: undefined },
      description: 'Overrides the variant default weight',
      table: { category: 'Appearance' },
    },
    numberOfLines: {
      control: 'number',
      description: 'Truncate with ellipsis after N lines',
      table: { category: 'Advanced' },
    },
    className: { control: 'text', table: { category: 'Advanced' } },
  },
} satisfies Meta<typeof BodyText>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {};

// All six variants with their default weights.
export const Variants: Story = {
  render: () => (
    <View className="gap-3">
      {variants.map((variant) => (
        <BodyText key={variant} variant={variant}>
          {variant}
        </BodyText>
      ))}
    </View>
  ),
};

// Theme tones at body1.
export const Tones: Story = {
  render: () => (
    <View className="gap-2">
      {tones.map((tone) => (
        <BodyText key={tone} tone={tone}>
          {tone}
        </BodyText>
      ))}
    </View>
  ),
};

// Weight overrides on body1.
export const Weights: Story = {
  render: () => (
    <View className="gap-2">
      {weights.map((weight) => (
        <BodyText key={weight} weight={weight}>
          {weight}
        </BodyText>
      ))}
    </View>
  ),
};
