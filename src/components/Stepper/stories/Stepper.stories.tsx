import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { Stepper } from '../Stepper';
import { Input } from '../../Input';
import { Icon } from '../../Icon';

const tones = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;

// The middle step shows an inline Input when active.
const demoSteps = [
  { title: 'Account', description: 'Credentials and profile' },
  {
    title: 'Email',
    description: 'Where should we write back?',
    content: <Input label="Email" placeholder="you@example.com" />,
  },
  { title: 'Done', description: 'Review and finish' },
];

// Shared minimal steps for the tone matrix.
const toneSteps = [{ title: 'First' }, { title: 'Second' }, { title: 'Third' }];

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  args: {
    steps: demoSteps,
    tone: 'primary',
  },
  argTypes: {
    steps: {
      control: 'object',
      description: 'Step definitions: title, optional description, optional icon (replaces the number), optional content shown when active',
      table: { category: 'Content' },
    },
    tone: {
      control: 'select',
      options: tones,
      description: 'Accent color for active and completed steps',
      table: { category: 'Appearance' },
    },
    activeStep: {
      control: 'number',
      description: 'Controlled active index; omit to manage internally',
      table: { category: 'State' },
    },
    defaultStep: {
      control: 'number',
      description: 'Initial step when uncontrolled',
      table: { category: 'State' },
    },
    onStepPress: {
      control: false,
      description: 'Called with the pressed step index (circle or title)',
      table: { category: 'Advanced' },
    },
    completedIcon: {
      control: false,
      description: 'Custom node shown on completed steps (default: check Icon)',
      table: { category: 'Icons' },
    },
    className: {
      control: 'text',
      description: 'Extra NativeWind classes on the outer wrapper',
      table: { category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {
  render: (args) => <Stepper {...args} defaultStep={1} />,
};

export const Tones: Story = {
  render: () => (
    <View className="gap-6">
      {tones.map((tone) => (
        <View key={tone} className="gap-1">
          <Text className="text-13 font-semibold capitalize text-text-secondary">{tone}</Text>
          <Stepper tone={tone} defaultStep={1} steps={toneSteps} />
        </View>
      ))}
    </View>
  ),
};

// Steps can swap the number for any node; completedIcon overrides the default check.
export const CustomIcons: Story = {
  render: () => (
    <Stepper
      defaultStep={1}
      completedIcon={<Icon name="check" size="sm" tone="inverse" />}
      steps={[
        { title: 'Account', icon: <Icon name="user" size="sm" tone="inverse" /> },
        { title: 'Email', icon: <Icon name="mail" size="sm" tone="inverse" /> },
        { title: 'Done' },
      ]}
    />
  ),
};
