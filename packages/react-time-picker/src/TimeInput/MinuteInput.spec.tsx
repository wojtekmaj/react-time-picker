import { describe, expect, it } from 'vitest';
import React, { createRef } from 'react';
import { render } from '@testing-library/react';

import MinuteInput from './MinuteInput.js';

describe('MinuteInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof MinuteInput>;

  it('renders an input', () => {
    const { container } = render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', () => {
    const minuteAriaLabel = 'Minute';

    const { container } = render(<MinuteInput {...defaultProps} ariaLabel={minuteAriaLabel} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', minuteAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const minutePlaceholder = 'mm';

    const { container } = render(<MinuteInput {...defaultProps} placeholder={minutePlaceholder} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('placeholder', minutePlaceholder);
  });

  it('renders "0" if minute is <10', () => {
    const { container } = render(<MinuteInput {...defaultProps} value="9" />);

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('renders "0" given showLeadingZeros if minute is 0', () => {
    const { container } = render(<MinuteInput {...defaultProps} showLeadingZeros value="0" />);

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if minute is <10 with leading zero already', () => {
    const { container } = render(<MinuteInput {...defaultProps} showLeadingZeros value="09" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if minute is >=10', () => {
    const { container } = render(<MinuteInput {...defaultProps} value="10" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('has proper name defined', () => {
    const { container } = render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', 'minute');
  });

  it('has proper className defined', () => {
    const className = 'react-time-picker';

    const { container } = render(<MinuteInput {...defaultProps} className={className} />);

    const input = container.querySelector('input');

    expect(input).toHaveClass('react-time-picker__input');
    expect(input).toHaveClass('react-time-picker__minute');
  });

  it('displays given value properly', () => {
    const value = '11';

    const { container } = render(<MinuteInput {...defaultProps} value={value} />);

    const input = container.querySelector('input');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', () => {
    const { container } = render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', () => {
    const { container } = render(<MinuteInput {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', () => {
    const { container } = render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', () => {
    const { container } = render(<MinuteInput {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', () => {
    const inputRef = createRef<HTMLInputElement>();

    render(<MinuteInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "0" by default', () => {
    const { container } = render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '0');
  });

  it('has min = "0" given minTime in a past hour', () => {
    const { container } = render(<MinuteInput {...defaultProps} hour="22" minTime="21:40" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '0');
  });

  it('has min = (minute in minTime) given minTime in a current hour', () => {
    const { container } = render(<MinuteInput {...defaultProps} hour="22" minTime="22:40" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '40');
  });

  it('has max = "59" by default', () => {
    const { container } = render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '59');
  });

  it('has max = "59" given maxTime in a future hour', () => {
    const { container } = render(<MinuteInput {...defaultProps} hour="22" maxTime="23:40" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '59');
  });

  it('has max = (minute in maxHour) given maxTime in a current hour', () => {
    const { container } = render(<MinuteInput {...defaultProps} hour="22" maxTime="22:40" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '40');
  });
});
