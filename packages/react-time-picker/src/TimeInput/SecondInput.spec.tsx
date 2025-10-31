import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import { createRef } from 'react';

import SecondInput from './SecondInput.js';

describe('SecondInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof SecondInput>;

  it('renders an input', async () => {
    const { container } = await render(<SecondInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', async () => {
    const secondAriaLabel = 'Second';

    const { container } = await render(
      <SecondInput {...defaultProps} ariaLabel={secondAriaLabel} />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', secondAriaLabel);
  });

  it('applies given placeholder properly', async () => {
    const secondPlaceholder = 'ss';

    const { container } = await render(
      <SecondInput {...defaultProps} placeholder={secondPlaceholder} />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('placeholder', secondPlaceholder);
  });

  it('renders "0" if second is <10', async () => {
    const { container } = await render(<SecondInput {...defaultProps} value="9" />);

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('renders "0" given showLeadingZeros if second is 0', async () => {
    const { container } = await render(
      <SecondInput {...defaultProps} showLeadingZeros value="0" />,
    );

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if second is <10 with leading zero already', async () => {
    const { container } = await render(
      <SecondInput {...defaultProps} showLeadingZeros value="09" />,
    );

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if second is >=10', async () => {
    const { container } = await render(<SecondInput {...defaultProps} value="10" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('has proper name defined', async () => {
    const { container } = await render(<SecondInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', 'second');
  });

  it('has proper className defined', async () => {
    const className = 'react-time-picker';

    const { container } = await render(<SecondInput {...defaultProps} className={className} />);

    const input = container.querySelector('input');

    expect(input).toHaveClass('react-time-picker__input');
    expect(input).toHaveClass('react-time-picker__second');
  });

  it('displays given value properly', async () => {
    const value = '11';

    const { container } = await render(<SecondInput {...defaultProps} value={value} />);

    const input = container.querySelector('input');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', async () => {
    const { container } = await render(<SecondInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', async () => {
    const { container } = await render(<SecondInput {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', async () => {
    const { container } = await render(<SecondInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', async () => {
    const { container } = await render(<SecondInput {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', async () => {
    const inputRef = createRef<HTMLInputElement>();

    await render(<SecondInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "0" by default', async () => {
    const { container } = await render(<SecondInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '0');
  });

  it('has min = "0" given minDate in a past minute', async () => {
    const { container } = await render(
      <SecondInput {...defaultProps} hour="22" minTime="21:40:15" minute="40" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '0');
  });

  it('has min = (second in minTime) given minTime in a current minute', async () => {
    const { container } = await render(
      <SecondInput {...defaultProps} hour="22" minTime="22:40:15" minute="40" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '15');
  });

  it('has max = "59" by default', async () => {
    const { container } = await render(<SecondInput {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '59');
  });

  it('has max = "59" given maxTime in a future minute', async () => {
    const { container } = await render(
      <SecondInput {...defaultProps} hour="22" maxTime="23:40:15" minute="40" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '59');
  });

  it('has max = (second in maxHour) given maxTime in a current minute', async () => {
    const { container } = await render(
      <SecondInput {...defaultProps} hour="22" maxTime="22:40:15" minute="40" />,
    );

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '15');
  });
});
