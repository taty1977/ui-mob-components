import { createElement, useEffect, type ComponentType } from 'react';
import type { Preview } from '@storybook/react-native-web-vite';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

type Theme = 'light' | 'dark' | 'teal';
type Platform = 'ios' | 'android';

const canvasColor: Record<Theme, string> = {
	light: '#f8f7fa',
	dark: '#25293c',
	teal: '#f4f9f9',
};

const ThemeSync = ({ Story, theme }: { Story: ComponentType; theme: Theme }) => {
	useEffect(() => {
		document.documentElement.classList.remove('light', 'dark', 'teal');
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

const ThemeFrame = ({ Story, platform }: { Story: ComponentType; platform: Platform }) =>
	createElement(
		View,
		{
			className: 'min-h-screen bg-background-canvas px-4 py-6',
		},
		createElement(
			View,
			{
				className:
					platform === 'ios'
						? 'mx-auto min-h-[780px] w-full max-w-[390px] overflow-hidden rounded-[40px] border border-gray-300 bg-background-surface shadow-xl'
						: 'mx-auto min-h-[780px] w-full max-w-[412px] overflow-hidden rounded-[28px] border border-gray-300 bg-background-surface shadow-xl',
			},
			createElement(
				View,
				{
					className:
						'flex-row items-center justify-between border-b border-border-subtle px-5 py-3',
				},
				createElement(
					Text,
					{ className: 'text-13 font-semibold text-text-primary' },
					platform === 'ios' ? 'iOS' : 'Android',
				),
				createElement(
					Text,
					{ className: 'text-13 text-text-secondary' },
					platform === 'ios' ? '9:41' : '12:00',
				),
			),
			createElement(View, { className: 'p-5' }, createElement(Story)),
		),
	);

const preview: Preview = {
	parameters: {
		options: {
			storySort: { order: ['Design System', ['Introduction'], '*'] },
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
					{ value: 'teal', title: 'Teal' },
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
		(Story) => createElement(SafeAreaProvider, null, createElement(Story)),
		(Story, context) =>
			createElement(ThemeSync, {
				Story,
				theme:
					context.globals.theme === 'dark'
						? 'dark'
						: context.globals.theme === 'teal'
							? 'teal'
							: 'light',
			}),
		(Story, context) => {
			if (context.parameters.layout === 'fullscreen') return createElement(Story);
			const platform = context.globals.platform === 'android' ? 'android' : 'ios';
			return createElement(ThemeFrame, { Story, platform });
		},
	],
};

export default preview;
