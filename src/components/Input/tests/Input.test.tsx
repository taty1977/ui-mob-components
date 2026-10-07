import { Fragment, type ReactElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { InputView, LabelText } from '../Input';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderedChildren = (node: unknown): unknown[] =>
  [(node as AnyElement).props?.children]
    .flat()
    .filter(Boolean)
    .flatMap((child) =>
      typeof child === 'object' && child !== null && (child as AnyElement).type === Fragment
        ? renderedChildren(child)
        : [child]
    );

const isTextInput = (child: unknown): child is AnyElement =>
  typeof child === 'object' &&
  child !== null &&
  'placeholderClassName' in (child as AnyElement).props;

// The TextInput is the only child carrying placeholderClassName.
const findTextInput = (fieldRow: unknown): AnyElement =>
  renderedChildren(fieldRow).find(isTextInput) as AnyElement;

// The field row is the wrapper child that contains the TextInput.
const findFieldRow = (element: unknown): AnyElement =>
  (renderedChildren(element) as AnyElement[]).find((child) =>
    renderedChildren(child).some(isTextInput)
  ) as AnyElement;

// LabelText elements are the only children carrying a `text` prop.
const isLabelText = (child: unknown): child is AnyElement =>
  typeof child === 'object' && child !== null && 'text' in (child as AnyElement).props;

const findLabel = (element: unknown): AnyElement => {
  const direct = (renderedChildren(element) as AnyElement[]).find(isLabelText);
  if (direct) return direct;
  for (const child of renderedChildren(findFieldRow(element)) as AnyElement[]) {
    const nested = (renderedChildren(child) as AnyElement[]).find(isLabelText);
    if (nested) return nested;
  }
  throw new Error('Label not found');
};

// The wrapper View positioning an in-field label (notch, filled top, unshrunk).
const findLabelWrapper = (element: unknown): AnyElement | undefined =>
  (renderedChildren(findFieldRow(element)) as AnyElement[]).find((child) =>
    (renderedChildren(child) as AnyElement[]).some(isLabelText)
  );

const isBorderPiece = (child: AnyElement) =>
  child.props.pointerEvents === 'none' &&
  !(renderedChildren(child) as AnyElement[]).some(isLabelText);

const findBorderPieces = (element: unknown): AnyElement[] =>
  (renderedChildren(findFieldRow(element)) as AnyElement[]).filter(isBorderPiece);

const renderView = (props: Parameters<typeof InputView>[0]) =>
  InputView(props) as unknown as AnyElement;

describe('Input', () => {
  it('shrinks the label above the field for the standard variant once filled', () => {
    const element = renderView({ label: 'Email', variant: 'standard', focused: false, filled: true });
    const labelEl = findLabel(element);
    expect(labelEl.props.text).toBe('Email');
    expect(labelEl.props.className).toContain('mb-1');
  });

  it('shrinks the label to the top inside the box for the filled variant', () => {
    const element = renderView({ label: 'Email', variant: 'filled', focused: false, filled: true });
    const fieldRow = findFieldRow(element);
    // Nothing above the field for filled — the label sits inside the box.
    expect((renderedChildren(element) as AnyElement[])[0]).toBe(fieldRow);

    const wrapper = findLabelWrapper(element);
    expect(wrapper?.props.className).toContain('top-1');
    const labelText = (renderedChildren(wrapper) as AnyElement[])[0];
    expect(labelText.props.text).toBe('Email');
    // The input reserves room below the shrunk label.
    expect(findTextInput(fieldRow).props.className).toContain('pt-5');
  });

  it('keeps the label inside filled and standard fields while empty', () => {
    for (const variant of ['filled', 'standard'] as const) {
      const element = renderView({ label: 'Email', variant, focused: false });
      expect(findLabelWrapper(element)).toBeTruthy();
    }
  });

  it('places the label on the border notch for the outlined variant once filled', () => {
    const element = renderView({ label: 'Email', variant: 'outlined', focused: false, filled: true });
    const fieldRow = findFieldRow(element);
    // Nothing precedes the field row — the label is not rendered above it.
    expect((renderedChildren(element) as AnyElement[])[0]).toBe(fieldRow);

    const wrapper = findLabelWrapper(element);
    expect(wrapper?.props.className).toContain('absolute');
    expect(wrapper?.props.className).toContain('bg-background-surface');
    expect(findLabel(element).props.text).toBe('Email');
  });

  it('splits the border into segments around the measured transparent label', () => {
    const element = renderView({
      label: 'Email',
      variant: 'outlined',
      focused: false,
      filled: true,
      notchWidth: 48,
    });
    const pieces = findBorderPieces(element);
    expect(pieces).toHaveLength(3);
    for (const piece of pieces) {
      expect(piece.props.className).toContain('border-palette-primary-main');
    }
    // The right segment starts after the measured label box: left-3 (12px) + 48px.
    expect(pieces[2].props.style).toEqual({ left: 60 });

    // Once measured, the label wrapper is transparent — a real gap, not a cover.
    expect(findLabelWrapper(element)?.props.className).not.toContain('bg-background-surface');
  });

  it('thickens the notch border segments on keyboard focus', () => {
    const element = renderView({
      label: 'Email',
      variant: 'outlined',
      focused: true,
      focusVisible: true,
      filled: true,
      notchWidth: 48,
    });
    const pieces = findBorderPieces(element);
    expect(pieces).toHaveLength(3);
    expect(pieces[0].props.className).toContain('border-t-2');
    expect(pieces[1].props.className).toContain('border-b-2');
    expect(pieces[2].props.className).toContain('border-t-2');
  });

  it('renders helper text below the field', () => {
    const element = renderView({ helperText: 'We never share it.', focused: false });
    const kids = renderedChildren(element) as AnyElement[];
    const helper = kids[kids.length - 1];
    expect(helper.props.children).toBe('We never share it.');
    expect(helper.props.className).toContain('text-text-secondary');
  });

  it('applies the error tone to the border, label, and helper text', () => {
    const element = renderView({
      label: 'Email',
      helperText: 'Invalid address',
      error: true,
      focused: false,
      filled: true,
    });
    const kids = renderedChildren(element) as AnyElement[];
    const labelEl = findLabel(element);
    const helperEl = kids[kids.length - 1];
    const fieldClasses = String(findFieldRow(element).props.className).split(' ');
    expect(fieldClasses).toContain('border-palette-error-main');

    // The error border wins even when focus arrives via keyboard on a toned field.
    const keyboardFocus = renderView({
      label: 'Email',
      error: true,
      tone: 'success',
      focused: true,
      focusVisible: true,
      filled: true,
    });
    expect(String(findFieldRow(keyboardFocus).props.className).split(' ')).toContain(
      'border-palette-error-main'
    );
    expect(labelEl.props.className).toContain('text-palette-error-main');
    expect(helperEl.props.className).toContain('text-palette-error-main');
  });

  it('thickens the tone border on any focus and deepens it for keyboard focus', () => {
    const pointerFocus = renderView({ label: 'Email', focused: true, focusVisible: false, filled: true });
    const pointerClasses = String(findFieldRow(pointerFocus).props.className).split(' ');
    expect(pointerClasses).toContain('border-palette-primary-main');
    expect(pointerClasses).toContain('border-2');
    expect(pointerClasses).not.toContain('border-palette-primary-dark');

    const keyboardFocus = renderView({ label: 'Email', focused: true, focusVisible: true, filled: true });
    const keyboardClasses = String(findFieldRow(keyboardFocus).props.className).split(' ');
    expect(keyboardClasses).toContain('border-palette-primary-dark');
    expect(keyboardClasses).toContain('border-2');

    const labelEl = findLabel(pointerFocus);
    expect(labelEl.props.className).toContain('text-palette-primary-main');
  });

  it('deepens the selected tone on the keyboard-focus border and tints the label', () => {
    const element = renderView({ label: 'Email', tone: 'success', focused: true, focusVisible: true, filled: true });
    const fieldClasses = String(findFieldRow(element).props.className).split(' ');
    expect(fieldClasses).toContain('border-palette-success-dark');
    expect(fieldClasses).toContain('border-2');
    const labelEl = findLabel(element);
    expect(labelEl.props.className).toContain('text-palette-success-main');
  });

  it('colors resting borders with the selected tone', () => {
    for (const variant of ['outlined', 'filled', 'standard'] as const) {
      const element = renderView({ variant, tone: 'info', focused: false });
      expect(findFieldRow(element).props.className).toContain('border-palette-info-main');
    }
  });

  it('disables the text input and tones down its text when disabled', () => {
    const element = renderView({ label: 'Email', disabled: true, focused: false });
    const fieldRow = findFieldRow(element);
    const input = findTextInput(fieldRow);
    expect(input.props.editable).toBe(false);
    expect(input.props.className).toContain('text-text-disabled');
    expect(fieldRow.props.className).toContain('border-text-disabled');
  });

  it('renders adornment icons inside the field row', () => {
    const element = renderView({ iconLeft: '🔍', iconRight: '⌄', focused: false });
    const kids = renderedChildren(findFieldRow(element));
    expect(kids[0]).toBe('🔍');
    expect(kids[kids.length - 1]).toBe('⌄');
  });

  it('wires the label as the accessibility label unless one is provided', () => {
    const implicit = renderView({ label: 'Email', focused: false });
    expect(findTextInput(findFieldRow(implicit)).props.accessibilityLabel).toBe('Email');

    const explicit = renderView({
      label: 'Email',
      accessibilityLabel: 'Work email address',
      focused: false,
    });
    expect(findTextInput(findFieldRow(explicit)).props.accessibilityLabel).toBe('Work email address');
  });

  it('appends an error-toned asterisk to the label when required', () => {
    const element = renderView({ label: 'Email', required: true, variant: 'standard', focused: false, filled: true });
    expect(findLabel(element).props.required).toBe(true);

    const labelText = LabelText({ text: 'Email', required: true, className: '' }) as unknown as AnyElement;
    const asterisk = [labelText.props.children as ReactNode]
      .flat()
      .filter(Boolean)
      .find((child) => typeof child === 'object') as AnyElement;
    expect(asterisk.props.children).toBe(' *');
    expect(asterisk.props.className).toContain('text-palette-error-main');
  });

  it('keeps the label inside the field while empty (MUI unshrunk label)', () => {
    const element = renderView({ label: 'Email', variant: 'outlined', focused: false });
    const fieldRow = findFieldRow(element);
    const input = findTextInput(fieldRow);
    expect(input.props.placeholder).toBeUndefined();

    const overlay = findLabelWrapper(element);
    expect(overlay).toBeTruthy();
    expect(overlay?.props.pointerEvents).toBe('none');
    const labelText = (renderedChildren(overlay) as AnyElement[])[0];
    expect(labelText.props.text).toBe('Email');
    expect(labelText.props.className).toContain('text-text-secondary');
  });

  it('passes an explicit placeholder through to the TextInput untouched', () => {
    const element = renderView({
      label: 'Email',
      placeholder: 'you@example.com',
      focused: false,
    });
    expect(findTextInput(findFieldRow(element)).props.placeholder).toBe('you@example.com');
  });

  it('hides the unshrunk label when a placeholder occupies the empty field', () => {
    const element = renderView({
      label: 'Email',
      placeholder: 'you@example.com',
      focused: false,
    });
    expect(findLabelWrapper(element)).toBeUndefined();
  });

  it('shows the shrunk label once filled even when a placeholder is set', () => {
    const element = renderView({
      label: 'Email',
      placeholder: 'you@example.com',
      focused: false,
      filled: true,
    });
    // The notch label renders inside the field row once the field has a value.
    const labelEl = findLabel(element);
    expect(labelEl.props.text).toBe('Email');
  });

  it('marks the unshrunk label with an asterisk when required and empty', () => {
    const element = renderView({ label: 'Email', required: true, focused: false });
    const overlay = findLabelWrapper(element);
    const labelText = (renderedChildren(overlay) as AnyElement[])[0];
    expect(labelText.props.text).toBe('Email');
    expect(labelText.props.required).toBe(true);
  });

  it('applies the small frame and text size', () => {
    const element = renderView({ size: 'small', focused: false });
    const fieldRow = findFieldRow(element);
    const classes = String(fieldRow.props.className).split(' ');
    expect(fieldRow.props.className).toContain('min-h-11 py-2');
    expect(classes).toContain('pl-4');
    expect(classes).toContain('pr-4');
    expect(findTextInput(fieldRow).props.className).toContain('text-15');
  });

  it('matches field frames per variant and size', () => {
    const frames = {
      outlined: { small: 'min-h-11 py-2', normal: 'min-h-12 py-2' },
      filled: { small: 'min-h-11', normal: 'min-h-12' },
      standard: { small: 'min-h-11 py-1', normal: 'min-h-12 py-1' },
    } as const;
    for (const variant of ['outlined', 'filled', 'standard'] as const) {
      for (const size of ['small', 'normal'] as const) {
        const element = renderView({ variant, size, focused: false });
        expect(findFieldRow(element).props.className).toContain(frames[variant][size]);
      }
    }
  });

  it('takes 50% off both sides when both adornments are present', () => {
    const element = renderView({ iconLeft: '🔍', iconRight: '⌄', size: 'small', focused: false });
    const classes = String(findFieldRow(element).props.className).split(' ');
    expect(classes).toContain('pl-2');
    expect(classes).toContain('pr-2');
  });

  it('takes 50% off only the side that carries an adornment', () => {
    const leftOnly = renderView({ iconLeft: '🔍', focused: false });
    const leftClasses = String(findFieldRow(leftOnly).props.className).split(' ');
    expect(leftClasses).toContain('pl-3');
    expect(leftClasses).toContain('pr-6');

    const rightOnly = renderView({ iconRight: '⌄', focused: false });
    const rightClasses = String(findFieldRow(rightOnly).props.className).split(' ');
    expect(rightClasses).toContain('pl-6');
    expect(rightClasses).toContain('pr-3');
  });

  it('applies the same reduced icon padding for the standard variant', () => {
    const element = renderView({ variant: 'standard', iconLeft: '🔍', focused: false });
    const classes = String(findFieldRow(element).props.className).split(' ');
    expect(classes).toContain('pl-3');
    expect(classes).not.toContain('pr-3');
    expect(classes).not.toContain('pr-6');
  });

  it('distinguishes variant chrome: outlined, filled, and standard', () => {
    const outlined = renderView({ variant: 'outlined', focused: false });
    const outlinedClasses = String(findFieldRow(outlined).props.className).split(' ');
    expect(outlinedClasses).toContain('rounded-md');
    expect(outlinedClasses).toContain('border');
    expect(outlinedClasses).toContain('bg-background-surface');

    const filled = renderView({ variant: 'filled', focused: false });
    const filledClasses = String(findFieldRow(filled).props.className).split(' ');
    expect(filledClasses).toContain('bg-action-hover');
    expect(filledClasses).toContain('border-b');

    const standard = renderView({ variant: 'standard', focused: false });
    const standardClasses = String(findFieldRow(standard).props.className).split(' ');
    expect(standardClasses).toContain('border-b');
    expect(standardClasses).toContain('bg-transparent');
  });
});
