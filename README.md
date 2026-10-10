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
| `npm run chromatic` | Publish to Chromatic and run visual regression tests |
| `npm test` | Run the Vitest unit tests once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run typecheck` | Type-check `src` without emitting |
| `npm run lint` | ESLint (TypeScript + React rules) |
| `npm run build` | Generate tokens and build `lib/` (CJS, ESM, types) |
| `npm run generate-tokens` | Regenerate `src/themes/generatedTokens.ts` from the Figma export |
| `npm run check-tokens` | Fail if the generated token module is stale (CI) |
| `npm run release` | Publish to npm via Changesets |

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
    Avatar/
      Avatar.tsx            # image/initial avatar with presence dot
      index.ts
      stories/
      tests/
    Button/
      Button.tsx            # component
      index.ts              # component export
      stories/              # Storybook stories
      tests/                # Vitest unit tests
    Header/
      Header.tsx            # app header (logo/back, greeting, avatar, bell)
      index.ts
      stories/
      tests/
    Heading/
      Heading.tsx           # h1-h6 text with tone/weight, theme font family
      index.ts
      stories/
      tests/
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
    Logo/
      Logo.tsx              # AllInOne Health mark + wordmark
      index.ts
      stories/
      tests/
    Menu/
      Menu.tsx              # MenuView (stateless) + Menu (trigger/controlled wrapper)
      index.ts
      stories/
      tests/
    Splash/
      Splash.tsx            # SplashView (stateless) + Splash (Animated wrapper)
      index.ts
      stories/
      tests/
    Stepper/
      Stepper.tsx           # StepperView (stateless) + Stepper (stateful wrapper)
      index.ts
      stories/
      tests/
    BodyText/
      BodyText.tsx        # subtitle1–overline body text (MUI-style variants)
      index.ts
      stories/
      tests/
  themes/                   # generatedTokens.ts (baked tokens) + theme mapping (multi-mode)
tokens/figma/tokens.json    # exported Figma variables (source of truth)
```

## Usage

```tsx
import { Avatar, Button, Header, Heading, Icon, Input, Logo, Menu, BodyText } from 'ui-mob-components';

<Heading variant="h2" tone="primary">Book an appointment</Heading>
<BodyText variant="body2" tone="muted">Vitals look stable.</BodyText>
<Avatar name="Ana" imageUrl="https://…/ana.png" status="online" />
<Header userName="Ana" unreadCount={3} onPressMenu={() => setMenuOpen(true)} />
<Menu open={menuOpen} onClose={() => setMenuOpen(false)} items={[{ label: 'Profile', icon: 'user' }]} />
<Button label="Save" tone="primary" variant="default" />
<Button
  label="Next"
  variant="outline"
  tone="secondary"
  iconRight={<Icon name="chevron-right" />}
/>
<Input label="Email" helperText="We never share it" />
<Input label="Search" iconLeft={<Icon name="chevron-left" />} tone="secondary" />
<Logo size={48} />
<Splash message="Loading patient vitals…" />
<Stepper steps={[{ title: 'Account' }, { title: 'Verify' }, { title: 'Done' }]} />
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

When `error` is set, the underlying input is also marked `aria-invalid` (web),
so form libraries like react-hook-form get an accessible invalid state via the
`Controller` pattern for free.

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
react-native-svg. Then apply the shipped Tailwind preset — it bundles the
NativeWind preset, the Figma-token theme (colors, spacing, radii, typography
scales), the light/dark CSS variables, and a content glob covering the package
build output:

```js
// tailwind.config.js (consuming app)
module.exports = {
  presets: [require('ui-mob-components/tailwind.preset')],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
};
```

If your package manager hoists the library elsewhere (e.g. a monorepo root), add
the glob yourself so NativeWind can discover the component classes:

```js
content: [
  './src/**/*.{js,jsx,ts,tsx}',
  './node_modules/ui-mob-components/lib/**/*.{js,jsx,ts,tsx}',
]
```

Configure NativeWind's Babel and Metro integrations in the consuming app as
described in the NativeWind installation guide. `nativewind`, `react-native-svg`
and `react-native-safe-area-context` are peer dependencies — install them in the
app so it controls their versions. Wrap the app root in
`SafeAreaProvider` (react-native-safe-area-context) for `Screen` insets, and load
the theme font — `fontFamily.sans` resolves to `var(--font-family)`.
