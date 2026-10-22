import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import type { ReactElement } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { fn } from 'storybook/test';
import { BodyText } from '../../BodyText';
import { Button } from '../../Button';
import { Heading } from '../../Heading';
import { Input } from '../../Input';
import { paletteTones } from '../../../themes/paletteTones';
import { themeTokens } from '../../../themes/themeTokens';

// --- Fixtures --------------------------------------------------------------------

const usageExample = `import { Button, Input } from 'ui-mob-components';

// tailwind.config.js
// presets: [require('ui-mob-components/tailwind.preset')]

<View className="light">
  <Input label="Email" keyboardType="email-address" />
  <Button label="Continue" tone="primary" variant="default" />
</View>`;

const CodeBlock = ({ label, children }: { label: string; children: string }): ReactElement => (
  <View
    accessibilityRole="summary"
    accessibilityLabel={label}
    className="rounded-md bg-action-hover p-4"
  >
    <Text selectable className="font-mono text-13 text-text-primary">
      {children}
    </Text>
  </View>
);

type IntroductionArgs = {
  onPress: () => void;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onBlur: () => void;
};

// --- Meta ------------------------------------------------------------------------

const meta = {
  title: 'Design System',
  parameters: { layout: 'fullscreen' },
} satisfies Meta<IntroductionArgs>;

export default meta;
type Story = StoryObj<IntroductionArgs>;

// --- Stories --------------------------------------------------------------------

export const Introduction: Story = {
  args: { onPress: fn(), onChangeText: fn(), onFocus: fn(), onBlur: fn() },
  argTypes: {
    onPress: { control: false, table: { category: 'Events' } },
    onChangeText: { control: false, table: { category: 'Events' } },
    onFocus: { control: false, table: { category: 'Events' } },
    onBlur: { control: false, table: { category: 'Events' } },
  },
  render: (args) => (
    <ScrollView className="min-h-screen bg-background-canvas" contentContainerClassName="p-6">
      <View className="mx-auto w-full max-w-4xl gap-6 rounded-lg bg-background-surface p-8">
        <Heading variant="h1">Mobile design system</Heading>
        <BodyText>
          React Native components styled with NativeWind 4. Figma JSON files drive the palette,
          spacing, corners, typography, and Light, Dark, and Teal themes, so iOS, Android, and web
          share one set of tokens.
        </BodyText>

        <Heading variant="h2">Shared foundations</Heading>
        <View className="flex-row flex-wrap gap-4">
          {paletteTones.map((tone) => (
            <Button key={tone} label={tone} tone={tone} onPress={args.onPress} />
          ))}
        </View>
        <Input
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          helperText="Accessible labels and validation, with no provider required."
          onChangeText={args.onChangeText}
          onFocus={args.onFocus}
          onBlur={args.onBlur}
        />

        <Heading variant="h2">Usage</Heading>
        <CodeBlock label="Usage code example">{usageExample}</CodeBlock>
        <BodyText>
          Use the Theme toolbar to preview every mode and the Platform toolbar to switch between
          the iOS and Android frames. Consumers add the exported Tailwind preset to their own
          NativeWind build.
        </BodyText>

        <Heading variant="h2">Spacing (pixels)</Heading>
        <CodeBlock label="Spacing tokens">
          {JSON.stringify(themeTokens.core.space, null, 2)}
        </CodeBlock>
      </View>
    </ScrollView>
  ),
};
