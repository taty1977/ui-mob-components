import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg (only reached via Icon; its source isn't Node-parseable).
vi.mock('react-native-svg', () => {
  const Svg = (props: Record<string, unknown>) => ({ type: 'Svg', props });
  const Path = (props: Record<string, unknown>) => ({ type: 'Path', props });
  return { default: Svg, Path };
});

import { StepperView } from '../Stepper';
import type { StepperStep, StepperViewProps } from '../Stepper';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const demoSteps: StepperStep[] = [
  { title: 'Account', description: 'Credentials and profile' },
  { title: 'Verify', content: 'VERIFY-CONTENT' },
  { title: 'Done' },
];

// Middle step is active by default so completed / active / upcoming all render.
const renderStepper = (props: Partial<StepperViewProps> = {}) =>
  StepperView({ steps: demoSteps, activeIndex: 1, onSelect: vi.fn(), ...props }) as unknown as AnyElement;

// --- Element-tree helpers ----------------------------------------------------------
// Rows are [indicator, content]; positional access keeps null slots on purpose
// (e.g. the missing connector line after the last step reads as null).
const rowsOf = (element: AnyElement) => (element.props.children as AnyElement[]).filter(Boolean);
const indicatorOf = (row: AnyElement) => (row.props.children as AnyElement[])[0];
const circleOf = (row: AnyElement) => (indicatorOf(row).props.children as AnyElement[])[0];
const lineOf = (row: AnyElement) => (indicatorOf(row).props.children as AnyElement[])[1];
const contentOf = (row: AnyElement) => (row.props.children as AnyElement[])[1];
const titlePressableOf = (row: AnyElement) => (contentOf(row).props.children as AnyElement[])[0];
const titleTextOf = (row: AnyElement) =>
  (titlePressableOf(row).props.children as AnyElement[])[0];

describe('Stepper', () => {
  // --- Circle content ---------------------------------------------------------------

  it('marks steps before the active index as completed with a check icon', () => {
    const rows = rowsOf(renderStepper());
    const circle = circleOf(rows[0]);
    expect(circle.props.className).toContain('bg-palette-primary-main');
    expect((circle.props.children as AnyElement).props.name).toBe('check');
  });

  it('renders a custom completed icon when provided', () => {
    const rows = rowsOf(renderStepper({ completedIcon: 'DONE!' }));
    expect(circleOf(rows[0]).props.children).toBe('DONE!');
  });

  it('renders a custom step icon instead of the number when provided', () => {
    const rows = rowsOf(
      renderStepper({
        steps: [{ title: 'A' }, { title: 'B', icon: 'B-ICON' }, { title: 'C' }],
        activeIndex: 1,
      })
    );
    expect(circleOf(rows[1]).props.children).toBe('B-ICON');
    // Numbers stay the default elsewhere.
    expect((circleOf(rows[2]).props.children as AnyElement).props.children).toBe(3);
  });

  it('shows the step number on the active and upcoming circles', () => {
    const rows = rowsOf(renderStepper());
    expect((circleOf(rows[1]).props.children as AnyElement).props.children).toBe(2);
    expect(circleOf(rows[1]).props.className).toContain('bg-palette-primary-main');
    expect(circleOf(rows[2]).props.className).toContain('bg-action-disabled');
  });

  // --- Colors & tone ------------------------------------------------------------------

  it('colors the active title with the tone and completed with primary text', () => {
    const rows = rowsOf(renderStepper());
    expect(titleTextOf(rows[1]).props.className).toContain('text-palette-primary-main');
    expect(titleTextOf(rows[0]).props.className).toContain('text-text-primary');
    expect(titleTextOf(rows[2]).props.className).toContain('text-text-secondary');
  });

  it('colors connector lines by completion and omits the one after the last step', () => {
    const rows = rowsOf(renderStepper());
    expect(lineOf(rows[0]).props.className).toContain('bg-palette-primary-main');
    expect(lineOf(rows[1]).props.className).toContain('bg-action-disabled');
    expect(lineOf(rows[2])).toBeNull();
  });

  it('carries the selected tone on circles, lines, and the active title', () => {
    const rows = rowsOf(renderStepper({ tone: 'success' }));
    expect(circleOf(rows[1]).props.className).toContain('bg-palette-success-main');
    expect(lineOf(rows[0]).props.className).toContain('bg-palette-success-main');
    expect(titleTextOf(rows[1]).props.className).toContain('text-palette-success-main');
  });

  it('gives the press halo the circle color per step state', () => {
    const rows = rowsOf(renderStepper());
    expect(circleOf(rows[0]).props.haloClassName).toContain('bg-palette-primary-main');
    expect(circleOf(rows[2]).props.haloClassName).toContain('bg-action-disabled');
  });

  // --- Content & layout ------------------------------------------------------------------

  it('shows step content only for the active step', () => {
    const rows = rowsOf(renderStepper());
    const activeKids = (contentOf(rows[1]).props.children as AnyElement[]).filter(Boolean);
    expect(activeKids).toHaveLength(2);
    expect(activeKids[1].props.children).toBe('VERIFY-CONTENT');

    const doneKids = (contentOf(rows[0]).props.children as AnyElement[]).filter(Boolean);
    expect(doneKids).toHaveLength(1);
  });

  it('centers the title with the circle when a step has no description', () => {
    const rows = rowsOf(renderStepper());
    // 'Done' has no description; 'Account' does.
    expect(titlePressableOf(rows[2]).props.className).toContain('justify-center');
    expect(titlePressableOf(rows[0]).props.className).toBeUndefined();
  });

  // --- Interaction & accessibility --------------------------------------------------------

  it('forwards the pressed index to onSelect from circle and title', () => {
    const onSelect = vi.fn();
    const rows = rowsOf(renderStepper({ onSelect }));
    (circleOf(rows[2]).props.onSelect as (index: number) => void)(2);
    expect(onSelect).toHaveBeenCalledWith(2);

    (titlePressableOf(rows[0]).props.onPress as () => void)();
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it('exposes button role and selected state on the step circles', () => {
    const rows = rowsOf(renderStepper());
    const active = circleOf(rows[1]);
    expect(active.props.accessibilityRole).toBe('button');
    expect(active.props.accessibilityState).toEqual({ selected: true });
    expect(circleOf(rows[2]).props.accessibilityState).toEqual({ selected: false });
  });
});
