# Icon

Theme-aware SVG icons rendered with `react-native-svg`.

## Importing icons from Figma

The Figma token export (`tokens/figma/tokens.json`) contains color/typography
tokens only — no icon geometry. To add a real icon from Figma:

1. In Figma, select the icon frame and choose **Export → SVG**.
2. Open the exported file and copy the `d` attribute of each `<path>`.
   - If the icon uses strokes (`stroke=...`) instead of fills, convert strokes
     to outlines first: **Object → Flatten** (or `Outline stroke` in the vector
     menu), then re-export.
3. In [paths.ts](paths.ts), add an entry to `iconPaths`:

   ```ts
   export const iconPaths = {
     // ...
     'my-icon': 'M...paste path data here...',
   } as const;
   ```

4. The icon is now available as `<Icon name="my-icon" />` and appears in the
   Storybook Gallery story automatically.

### Import conventions

- Use a **24×24 viewBox** grid; the component assumes `0 0 24 24`.
- Keep fills as `currentColor` by only pasting path data — the `Icon` component
  sets `fill="currentColor"` so the `tone` prop / text color controls the paint.
- Names are kebab-case, matching the Figma layer name (e.g. `chevron-left`).

## Usage

```tsx
import { Icon } from 'ui-mob-components';

<Icon name="check" size="sm" tone="primary" />
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `IconName` | required | One of the keys in `iconPaths` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 16 / 20 / 24 px |
| `tone` | `'inherit' \| 'primary' \| 'secondary' \| 'muted' \| 'inverse'` | `'inherit'` | `inherit` follows surrounding text color |
| `className` | `string` | — | Extra NativeWind classes, merged last |
| `accessibilityLabel` | `string` | — | Announced name; omit for decorative icons |

The starter paths (`plus`, `close`, `chevron-left`, `chevron-right`, `check`)
are placeholders on a Material-style 24px grid — replace them with your Figma
exports.
