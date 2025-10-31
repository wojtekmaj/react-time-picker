import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createRef } from 'react';

import MinuteInput from './MinuteInput.js';

describe('MinuteInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof MinuteInput>;

  it('renders an input', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', async () => {
    const minuteAriaLabel = 'Minute';

    const { container } = await render(
      <MinuteInput {...defaultProps} ariaLabel={minuteAriaLabel} />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', minuteAriaLabel);
  });

  it('applies given placeholder properly', async () => {
    const minutePlaceholder = 'mm';

    const { container } = await render(
      <MinuteInput {...defaultProps} placeholder={minutePlaceholder} />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('placeholder', minutePlaceholder);
  });

  it('renders "0" if minute is <10', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} value="9" />);

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('renders "0" given showLeadingZeros if minute is 0', async () => {
    const { container } = await render(
      <MinuteInput {...defaultProps} showLeadingZeros value="0" />,
    );

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if minute is <10 with leading zero already', async () => {
    const { container } = await render(
      <MinuteInput {...defaultProps} showLeadingZeros value="09" />,
    );

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if minute is >=10', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} value="10" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('has proper name defined', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', 'minute');
  });

  it('has proper className defined', async () => {
    const className = 'react-time-picker';

    const { container } = await render(<MinuteInput {...defaultProps} className={className} />);

    const input = container.querySelector('input');

    expect(input).toHaveClass('react-time-picker__input');
    expect(input).toHaveClass('react-time-picker__minute');
  });

  it('displays given value properly', async () => {
    const value = '11';

    const { container } = await render(<MinuteInput {...defaultProps} value={value} />);

    const input = container.querySelector('input');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', async () => {
    const inputRef = createRef<HTMLInputElement>();

    await render(<MinuteInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "0" by default', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '0');
  });

  it('has min = "0" given minTime in a past hour', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} hour="22" minTime="21:40" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '0');
  });

  it('has min = (minute in minTime) given minTime in a current hour', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} hour="22" minTime="22:40" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '40');
  });

  it('has max = "59" by default', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '59');
  });

  it('has max = "59" given maxTime in a future hour', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} hour="22" maxTime="23:40" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '59');
  });

  it('has max = (minute in maxHour) given maxTime in a current hour', async () => {
    const { container } = await render(<MinuteInput {...defaultProps} hour="22" maxTime="22:40" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '40');
  });
});
