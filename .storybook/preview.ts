import { createElement, useEffect, type ComponentType } from 'react';
import type { Preview } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

type Theme = 'light' | 'dark';
type Platform = 'ios' | 'android';

// Matches Variables.*.Misc.body-bg / paper in tokens/figma/tokens.json.
const canvasColor: Record<Theme, string> = {
	light: '#f8f7fa',
	dark: '#25293c',
};

// Syncs the toolbar theme onto <html> (drives the light-/dark- classes) and the
// canvas backgrounds — with or without the phone frame.
const ThemeSync = ({ Story, theme }: { Story: ComponentType; theme: Theme }) => {
	useEffect(() => {
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(theme);
	}, [theme]);

	useEffect(() => {
		const color = canvasColor[theme];
		const previous = document.body.style.backgroundColor;
		document.body.style.backgroundColor = color;
		document
			.querySelectorAll<HTMLElement>('.docs-root, #storybook-root, #root')
			.forEach((node) => {
				node.style.backgroundColor = color;
			});
		return () => {
			document.body.style.backgroundColor = previous;
		};
	}, [theme]);

	return createElement(Story);
};

// Phone chrome: status bar and the rounded device frame.
const ThemeFrame = ({ Story, platform }: { Story: ComponentType; platform: Platform }) =>
	createElement(
		View,
		{
			className: 'min-h-screen bg-light-background-canvas px-4 py-6 dark:bg-dark-background-canvas',
		},
		createElement(
			View,
			{
				className:
					platform === 'ios'
						? 'mx-auto min-h-[780px] w-full max-w-[390px] overflow-hidden rounded-[40px] border border-light-gray-300 bg-light-background-surface shadow-xl dark:border-dark-gray-700 dark:bg-dark-background-surface'
						: 'mx-auto min-h-[780px] w-full max-w-[412px] overflow-hidden rounded-[28px] border border-light-gray-300 bg-light-background-surface shadow-xl dark:border-dark-gray-700 dark:bg-dark-background-surface',
			},
			createElement(
				View,
				{
					className:
						'flex-row items-center justify-between border-b border-light-border-subtle px-5 py-3 dark:border-dark-border-subtle',
				},
				createElement(
					Text,
					{ className: 'text-13 font-semibold text-light-text-primary dark:text-dark-text-primary' },
					platform === 'ios' ? 'iOS' : 'Android',
				),
				createElement(
					Text,
					{ className: 'text-13 text-light-text-secondary dark:text-dark-text-secondary' },
					platform === 'ios' ? '9:41' : '12:00',
				),
			),
			createElement(View, { className: 'p-5' }, createElement(Story)),
		),
	);

const preview: Preview = {
	parameters: {
		// Keep the All Components group at the top of the sidebar.
		options: {
			storySort: { order: ['All Components'] },
		},
		viewport: {
			options: {
				iphone: {
					name: 'iPhone',
					styles: { width: '390px', height: '844px' },
					type: 'mobile',
				},
				android: {
					name: 'Android phone',
					styles: { width: '412px', height: '915px' },
					type: 'mobile',
				},
			},
		},
	},
	globalTypes: {
		theme: {
			description: 'Color theme',
			defaultValue: 'light',
			toolbar: {
				title: 'Theme',
				icon: 'circlehollow',
				items: [
					{ value: 'light', title: 'Light' },
					{ value: 'dark', title: 'Dark' },
				],
				dynamicTitle: true,
			},
		},
		platform: {
			description: 'Preview platform',
			defaultValue: 'ios',
			toolbar: {
				title: 'Platform',
				icon: 'mobile',
				items: [
					{ value: 'ios', title: 'iOS' },
					{ value: 'android', title: 'Android' },
				],
				dynamicTitle: true,
			},
		},
	},
	initialGlobals: {
		theme: 'light',
		platform: 'ios',
		viewport: { value: 'iphone', isRotated: false },
	},
	decorators: [
		// safe-area-context's SafeAreaView (used by Screen) needs a provider ancestor.
		(Story) => createElement(SafeAreaProvider, null, createElement(Story)),
		// Sync the toolbar theme onto <html>/body, with or without the phone frame.
		(Story, context) =>
			createElement(ThemeSync, {
				Story,
				theme: context.globals.theme === 'dark' ? 'dark' : 'light',
			}),
		// Phone chrome; stories opt out with parameters.layout = 'fullscreen'.
		(Story, context) => {
			if (context.parameters.layout === 'fullscreen') return createElement(Story);
			const platform = context.globals.platform === 'android' ? 'android' : 'ios';
			return createElement(ThemeFrame, { Story, platform });
		},
	],
};

export default preview;
