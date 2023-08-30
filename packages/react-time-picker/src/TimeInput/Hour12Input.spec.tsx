import { describe, expect, it } from 'vitest';
import React, { createRef } from 'react';
import { render } from '@testing-library/react';

import Hour12Input from './Hour12Input.js';

describe('Hour12Input', () => {
  const defaultProps = {
    amPm: 'am',
    className: '',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof Hour12Input>;

  it('renders an input', () => {
    const { container } = render(<Hour12Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', () => {
    const hourAriaLabel = 'Hour';

    const { container } = render(<Hour12Input {...defaultProps} ariaLabel={hourAriaLabel} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', hourAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const hourPlaceholder = 'hh';

    const { container } = render(<Hour12Input {...defaultProps} placeholder={hourPlaceholder} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('placeholder', hourPlaceholder);
  });

  it('renders "0" given showLeadingZeros if hour is <10', () => {
    const { container } = render(<Hour12Input {...defaultProps} showLeadingZeros value="9" />);

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if hour is >=10', () => {
    const { container } = render(<Hour12Input {...defaultProps} showLeadingZeros value="10" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', () => {
    const { container } = render(<Hour12Input {...defaultProps} value="9" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('has proper name defined', () => {
    const { container } = render(<Hour12Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', 'hour12');
  });

  it('has proper className defined', () => {
    const className = 'react-time-picker';

    const { container } = render(<Hour12Input {...defaultProps} className={className} />);

    const input = container.querySelector('input');

    expect(input).toHaveClass('react-time-picker__input');
    expect(input).toHaveClass('react-time-picker__hour');
  });

  it('displays given value properly (am)', () => {
    const value = '11';

    const { container } = render(<Hour12Input {...defaultProps} value={value} />);

    const input = container.querySelector('input');

    expect(input).toHaveValue(Number(value));
  });

  it('displays given value properly (pm)', () => {
    const value = '22';

    const { container } = render(<Hour12Input {...defaultProps} value={value} />);

    const input = container.querySelector('input');

    expect(input).toHaveValue(Number(value) - 12);
  });

  it('does not disable input by default', () => {
    const { container } = render(<Hour12Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', () => {
    const { container } = render(<Hour12Input {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', () => {
    const { container } = render(<Hour12Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', () => {
    const { container } = render(<Hour12Input {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', () => {
    const inputRef = createRef<HTMLInputElement>();

    render(<Hour12Input {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "1" by default', () => {
    const { container } = render(<Hour12Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = (hour in minTime) given am minTime when amPm is am', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="am" minTime="5:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '5');
  });

  it('has min = (hour in minTime) given pm minTime when amPm is pm', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="pm" minTime="17:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '5');
  });

  it('has min = "1" given am minTime when amPm is pm', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="pm" minTime="5:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = "1" given pm minTime when amPm is am', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="am" minTime="17:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = "1" given 12 am minTime when amPm is am', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="am" minTime="00:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has min = "1" given 12 pm minTime when amPm is pm', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="pm" minTime="12:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '1');
  });

  it('has max = "12" by default', () => {
    const { container } = render(<Hour12Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '12');
  });

  it('has max = (hour in maxTime) given am maxTime when amPm is am', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="am" maxTime="5:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '5');
  });

  it('has max = (hour in maxTime) given pm maxTime when amPm is pm', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="pm" maxTime="17:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '5');
  });

  it('has max = "12" given am maxTime when amPm is pm', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="pm" maxTime="5:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '12');
  });

  it('has max = "12" given pm maxTime when amPm is am', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="am" maxTime="17:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '12');
  });

  it('has max = "12" given 12 pm minTime when amPm is pm', () => {
    const { container } = render(<Hour12Input {...defaultProps} amPm="pm" maxTime="12:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '12');
  });
});
