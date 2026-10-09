import isChromatic from 'chromatic/isChromatic';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Splash, SplashView, type SplashProps } from '../Splash';

// Chromatic can't pause the JS-driven halo loop, so snapshot the stateless
// view frozen at the loop's first frame (opacity 0.7, scale 0.9).
const DemoSplash = (props: SplashProps) =>
    isChromatic() ? (
        <SplashView {...props} haloStyle={{ opacity: 0.7, transform: [{ scale: 0.9 }] }} />
    ) : (
        <Splash {...props} />
    );

const meta = {
    title: 'Brand‑Specific/Splash',
    component: Splash,
    args: {
        message: 'We’re ready to help you manage your care…',
        size: 144,
    },
    argTypes: {
        message: {
            control: 'text',
            description: 'Loading message below the spinner; empty hides it',
            table: { category: 'Content' },
        },
        size: {
            control: { type: 'range', min: 96, max: 240, step: 8 },
            description: 'Spinner dimensions in px; the logo mark renders at half',
            table: { category: 'Appearance' },
        },
        className: {
            control: 'text',
            description: 'Extra NativeWind classes on the outer wrapper',
            table: { category: 'Advanced' },
        },
    },
} satisfies Meta<typeof Splash>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Stories --------------------------------------------------------------------

export const Playground: Story = {
    render: (args) => <DemoSplash {...args} />,
};

export const WithoutMessage: Story = {
    args: {
        message: '',
    },
    render: (args) => <DemoSplash {...args} />,
};
