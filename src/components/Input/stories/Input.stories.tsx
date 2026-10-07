import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Input, InputView } from '../Input';
import { Icon } from '../../Icon';

const tones = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const;

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Email',
    placeholder: '',
    helperText: '',
    variant: 'outlined',
    size: 'normal',
    tone: 'primary',
    error: false,
    disabled: false,
    required: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label rendered above the field; used as accessibility label by default',
      table: { category: 'Content' },
    },
    placeholder: {
      control: 'text',
      table: { category: 'Content' },
    },
    helperText: {
      control: 'text',
      description: 'Hint below the field; turns error-toned when error is set',
      table: { category: 'Content' },
    },
    variant: {
      control: 'select',
      options: ['outlined', 'filled', 'standard'],
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['small', 'normal'],
      table: { category: 'Appearance' },
    },
    tone: {
      control: 'select',
      options: tones,
      description: 'Accent color for the field border and the focused label',
      table: { category: 'Appearance' },
    },
    error: {
      control: 'boolean',
      description: 'Error state: border, label, and helper text turn error-toned',
      table: { category: 'State' },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    required: {
      control: 'boolean',
      description: 'Appends an asterisk to the label',
      table: { category: 'State' },
    },
    iconLeft: {
      control: 'boolean',
      description: 'Demo toggle: renders a chevron-left Icon before the input',
      table: { category: 'Icons' },
    },
    iconRight: {
      control: 'boolean',
      description: 'Demo toggle: renders a chevron-right Icon after the input',
      table: { category: 'Icons' },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Overrides the label-derived accessible name',
      table: { category: 'Accessibility' },
    },
    className: {
      control: 'text',
      description: 'Extra NativeWind classes on the outer wrapper',
      table: { category: 'Advanced' },
    },
    inputClassName: {
      control: 'text',
      description: 'Extra NativeWind classes on the TextInput itself',
      table: { category: 'Advanced' },
    },
    ref: {
      control: false,
      description: 'Ref to the underlying TextInput (focus, blur, clear programmatically)',
      table: { category: 'Advanced' },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: ({ iconLeft, iconRight, ...args }) => (
    <View className="max-w-80">
      <Input
        {...args}
        iconLeft={iconLeft ? <Icon name="chevron-left" /> : undefined}
        iconRight={iconRight ? <Icon name="chevron-right" /> : undefined}
      />
    </View>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <View className="gap-6 max-w-80">
      <Input {...args} label="Outlined" variant="outlined" helperText="Default MUI variant" />
      <Input {...args} label="Filled" variant="filled" helperText="Background fills on the field" />
      <Input {...args} label="Standard" variant="standard" helperText="Underline only" />
    </View>
  ),
};

export const States: Story = {
  render: (args) => (
    <View className="gap-6 max-w-80">
      <Input
        {...args}
        label="Error"
        error
        defaultValue="not-an-email"
        helperText="Please enter a valid email address"
      />
      <Input {...args} label="Disabled" disabled placeholder="Cannot edit" helperText="This field is disabled" />
      <Input {...args} label="Required" required placeholder="Required field" helperText="Marked with an asterisk" />
    </View>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <View className="gap-6 max-w-80">
      <Input {...args} label="Search" placeholder="Search…" iconLeft={<Icon name="magnifier" />} />
      <Input {...args} label="Select" placeholder="Choose…" iconRight={<Icon name="eye" />} />
    </View>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <View className="gap-6 max-w-80">
      {tones.map((tone) => (
        <InputView
          key={tone}
          {...args}
          label={tone}
          tone={tone}
          focused
          focusVisible
          filled
          helperText="Keyboard-focus preview"
        />
      ))}
    </View>
  ),
};
