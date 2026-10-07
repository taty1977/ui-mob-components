# ui-mob-components

Reusable TypeScript components for React Native, styled with NativeWind 4 and themed from Figma design tokens.

## Development

From this directory, install dependencies and start the browser catalog:

```sh
npm install
npm run storybook
```

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run storybook` | Start the Storybook catalog on port 6006 |
| `npm run build-storybook` | Build the static Storybook site |
| `npm test` | Run the Vitest unit tests once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run typecheck` | Type-check `src` without emitting |
| `npm run lint` | ESLint (TypeScript + React rules) |
| `npm run build` | Build `lib/` (CJS, ESM, types) and copy tokens |

### Commit hooks

Husky gates every commit with:

1. `lint-staged` — ESLint `--fix` on staged files only
2. `npm run typecheck` — full `tsc --noEmit`
3. `npm test` — the Vitest suite

The commit aborts if any step fails. To check beforehand, run `npm run lint`,
`npm run typecheck`, or `npm test` manually.

## Project structure

```
src/
  index.ts                  # public API barrel
  components/
    index.ts                # component barrel
    Button/
      Button.tsx            # component
      index.ts              # component export
      stories/              # Storybook stories
      tests/                # Vitest unit tests
    Icon/
      Icon.tsx              # renderer (size, tone, a11y)
      paths.ts              # icon geometry (name -> path data)
      stories/
      tests/
      README.md             # Figma icon import workflow
    Input/
      Input.tsx             # InputView (stateless) + Input (stateful wrapper)
      input.styles.ts       # style tables (frames, tones, paddings)
      LabelText.tsx         # shared label with required asterisk
      stories/
      tests/
  themes/                   # Figma token -> theme mapping (light/dark)
tokens/figma/tokens.json    # exported Figma variables
```

## Usage

```tsx
import { Button, Icon, Input } from 'ui-mob-components';

<Button label="Save" tone="primary" variant="default" />
<Button
  label="Next"
  variant="outline"
  tone="secondary"
  iconRight={<Icon name="chevron-right" />}
/>
<Input label="Email" helperText="We never share it" />
<Input label="Search" iconLeft={<Icon name="chevron-left" />} tone="secondary" />
```

### Button

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | required | Text inside the button |
| `tone` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Palette tone |
| `variant` | `'default' \| 'label' \| 'outline' \| 'text'` | `'default'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height, padding, and text size |
| `iconLeft` / `iconRight` | `ReactNode` | — | Consumer-supplied nodes rendered beside the label; they inherit the label color |
| `className` | `string` | — | Extra NativeWind classes, merged last |
| `disabled` | `boolean` | `false` | Renders at 45% opacity |

All other React Native [`Pressable`](https://reactnative.dev/docs/pressable) props
— `onPress`, `onLongPress`, `accessibilityLabel`, `testID`, etc. — are forwarded to
the underlying `Pressable`, so press handling works with no extra wiring:

```tsx
<Button label="Save" onPress={() => save()} onLongPress={() => preview()} />
```

### Input

MUI-style text field (label, helper text, error state, adornments) built on
`TextInput`; all `TextInput` props pass through.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | Floats MUI-style once the field has a value; doubles as `accessibilityLabel` |
| `helperText` | `string` | — | Hint below the field; error-toned when `error` is set |
| `variant` | `'outlined' \| 'filled' \| 'standard'` | `'outlined'` | Box / gray fill + underline / underline only |
| `size` | `'small' \| 'normal'` | `'normal'` | 44px / 48px field height |
| `tone` | `'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success'` | `'primary'` | Border and focused-label color |
| `error` / `disabled` / `required` | `boolean` | `false` | MUI states; `error` always overrides `tone` |
| `iconLeft` / `iconRight` | `ReactNode` | — | Adornments; the icon side gets 50% less padding |
| `className` / `inputClassName` | `string` | — | Extra NativeWind classes on the wrapper / the `TextInput` |

### Icon

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `IconName` | required | Key from `iconPaths` in `src/components/Icon/paths.ts` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 16 / 20 / 24 px |
| `tone` | `'inherit' \| 'primary' \| 'secondary' \| 'error' \| 'warning' \| 'info' \| 'success' \| 'muted' \| 'inverse'` | `'inherit'` | `inherit` follows the surrounding text color via `currentColor` |
| `className` | `string` | — | Extra NativeWind classes |
| `accessibilityLabel` | `string` | — | Announced name; omit for decorative icons |

Adding icons from Figma is documented in [src/components/Icon/README.md](src/components/Icon/README.md).

## Theming

Themes are built from `tokens/figma/tokens.json` (Light and Dark Figma variables).
`src/themes/themeTokens.ts` resolves token references into `lightTheme` / `darkTheme`
objects, and `tailwind.config.js` exposes the same values as NativeWind classes such
as `bg-light-palette-primary-main`. Classes without the `light`/`dark` prefix
(e.g. `text-palette-primary-main`) resolve through per-theme CSS variables and
follow the active theme — Icon tones use these. In Storybook, the Theme toolbar toggles the
preview between the light and dark token sets.

## Consumer setup

Install this package together with React Native, NativeWind 4, Tailwind CSS 3, and
react-native-svg. Add the package build output to the consumer's Tailwind content
paths so NativeWind can discover the component classes:

```js
content: [
  './src/**/*.{js,jsx,ts,tsx}',
  './node_modules/ui-mob-components/lib/**/*.{js,jsx,ts,tsx}',
]
```

Configure NativeWind's Babel and Metro integrations in the consuming app as
described in the NativeWind installation guide. `nativewind` is a peer dependency,
so the app controls the NativeWind runtime version.

### Web: browser autofill tint

On the web, browsers paint a pale background over autofilled inputs and force a
text fill color. This repo's `global.css` already neutralizes it; add the same
snippet to your app's global stylesheet:

```css
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
input:autofill {
  transition: background-color 600000s ease-in-out 0s;
  -webkit-text-fill-color: currentColor;
}
```
