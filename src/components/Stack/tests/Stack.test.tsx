import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { Stack } from '../Stack';
import type { StackProps } from '../Stack';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderStack = (props: StackProps = {}) =>
  Stack({ children: ['one', 'two'], ...props }) as unknown as AnyElement;

describe('Stack', () => {
  it('stacks vertically with no extra classes by default', () => {
    const el = renderStack();
    // column / stretch / start match RN's defaults, so nothing is emitted.
    expect(el.props.className).toBe('');
    expect(el.props.children).toEqual(['one', 'two']);
  });

  it('switches to a horizontal row', () => {
    expect(renderStack({ direction: 'row' }).props.className).toBe('flex-row');
  });

  it('applies gap, alignment, and distribution from the static maps', () => {
    const el = renderStack({ gap: 4, align: 'center', justify: 'between' });
    expect(el.props.className).toBe('items-center justify-between gap-4');
  });

  it('wraps children and fills the parent when asked', () => {
    const el = renderStack({ direction: 'row', wrap: true, flex: true });
    expect(el.props.className).toBe('flex-row flex-wrap flex-1');
  });

  it('appends a consumer className last', () => {
    const el = renderStack({ gap: 2, className: 'mt-4' });
    expect(el.props.className).toBe('gap-2 mt-4');
  });
});
