import { describe, expect, it } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

import NativeInput from './NativeInput.js';

describe('NativeInput', () => {
  const defaultProps = {
    onChange: () => {
      // Intentionally empty
    },
    valueType: 'second',
  } satisfies React.ComponentProps<typeof NativeInput>;

  it('renders an input', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', () => {
    const nativeInputAriaLabel = 'Date';

    const { container } = render(
      <NativeInput {...defaultProps} ariaLabel={nativeInputAriaLabel} />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', nativeInputAriaLabel);
  });

  it('has proper name defined', () => {
    const name = 'testName';

    const { container } = render(<NativeInput {...defaultProps} name={name} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', name);
  });

  it.each`
    valueType   | parsedValue
    ${'second'} | ${'22:17:41'}
    ${'minute'} | ${'22:17'}
    ${'hour'}   | ${'22:00'}
  `('displays given value properly if valueType is $valueType', ({ valueType, parsedValue }) => {
    const value = '22:17:41';

    const { container } = render(
      <NativeInput {...defaultProps} value={value} valueType={valueType} />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveValue(parsedValue);
  });

  it('does not disable input by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', () => {
    const { container } = render(<NativeInput {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', () => {
    const { container } = render(<NativeInput {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('has no min by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toHaveAttribute('min');
  });

  it.each`
    valueType   | parsedMin
    ${'second'} | ${'22:00:00'}
    ${'minute'} | ${'22:00'}
    ${'hour'}   | ${'22:00'}
  `(
    'has proper min for minTime which is a full hour if valueType is $valueType',
    ({ valueType, parsedMin }) => {
      const { container } = render(
        <NativeInput {...defaultProps} minTime="22:00:00" valueType={valueType} />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('min', parsedMin);
    },
  );

  it.each`
    valueType   | parsedMin
    ${'second'} | ${'22:17:41'}
    ${'minute'} | ${'22:17'}
    ${'hour'}   | ${'22:00'}
  `(
    'has proper min for minTime which is not a full hour if valueType is $valueType',
    ({ valueType, parsedMin }) => {
      const { container } = render(
        <NativeInput {...defaultProps} minTime="22:17:41" valueType={valueType} />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('min', parsedMin);
    },
  );

  it('has no max by default', () => {
    const { container } = render(<NativeInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toHaveAttribute('max');
  });

  it.each`
    valueType   | parsedMax
    ${'second'} | ${'22:00:00'}
    ${'minute'} | ${'22:00'}
    ${'hour'}   | ${'22:00'}
  `(
    'has proper max for maxTime which is a full hour if valueType is $valueType',
    ({ valueType, parsedMax }) => {
      const { container } = render(
        <NativeInput {...defaultProps} maxTime="22:00:00" valueType={valueType} />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('max', parsedMax);
    },
  );

  it.each`
    valueType   | parsedMax
    ${'second'} | ${'22:17:41'}
    ${'minute'} | ${'22:17'}
    ${'hour'}   | ${'22:00'}
  `(
    'has proper max for maxTime which is not a full hour if valueType is $valueType',
    ({ valueType, parsedMax }) => {
      const { container } = render(
        <NativeInput {...defaultProps} maxTime="22:17:41" valueType={valueType} />,
      );

      const input = container.querySelector('input');

      expect(input).toHaveAttribute('max', parsedMax);
    },
  );
});
