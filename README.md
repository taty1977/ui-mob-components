# ui-mob-components

Reusable TypeScript components for React Native, styled with NativeWind and CVA.

## Development

From this directory, install dependencies and start the browser catalog:

```sh
npm install
npm run storybook
```

## Consumer setup

Install this package together with React Native, NativeWind 4, and Tailwind CSS 3. Add the package build output to the consumer's Tailwind content paths so NativeWind can discover the component classes:

```js
content: [
  './src/**/*.{js,jsx,ts,tsx}',
  './node_modules/ui-mob-components/lib/**/*.{js,jsx,ts,tsx}',
]
```

Configure NativeWind's Babel and Metro integrations in the consuming app as described in the NativeWind Expo installation guide. `nativewind` is a peer dependency, so the app controls the NativeWind runtime version.
