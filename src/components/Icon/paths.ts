// Placeholder 24x24 paths on a Material-style grid. Replace each path with the
// SVG path data copied from the corresponding Figma icon export.
export const iconPaths = {
  plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  'chevron-left': 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  'chevron-right': 'M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12z',
  check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
} as const;

export type IconName = keyof typeof iconPaths;
