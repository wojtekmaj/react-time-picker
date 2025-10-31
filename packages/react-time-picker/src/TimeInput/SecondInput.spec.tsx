import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
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
    await render(<SecondInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', async () => {
    const secondAriaLabel = 'Second';

    await render(<SecondInput {...defaultProps} ariaLabel={secondAriaLabel} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('aria-label', secondAriaLabel);
  });

  it('applies given placeholder properly', async () => {
    const secondPlaceholder = 'ss';

    await render(<SecondInput {...defaultProps} placeholder={secondPlaceholder} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('placeholder', secondPlaceholder);
  });

  it('renders "0" if second is <10', async () => {
    const { container } = await render(<SecondInput {...defaultProps} value="9" />);

    const input = page.getByRole('spinbutton');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('renders "0" given showLeadingZeros if second is 0', async () => {
    const { container } = await render(
      <SecondInput {...defaultProps} showLeadingZeros value="0" />,
    );

    const input = page.getByRole('spinbutton');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if second is <10 with leading zero already', async () => {
    const { container } = await render(
      <SecondInput {...defaultProps} showLeadingZeros value="09" />,
    );

    const input = page.getByRole('spinbutton');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if second is >=10', async () => {
    const { container } = await render(<SecondInput {...defaultProps} value="10" />);

    const input = page.getByRole('spinbutton');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('has proper name defined', async () => {
    await render(<SecondInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('name', 'second');
  });

  it('has proper className defined', async () => {
    const className = 'react-time-picker';

    await render(<SecondInput {...defaultProps} className={className} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveClass('react-time-picker__input');
    expect(input).toHaveClass('react-time-picker__second');
  });

  it('displays given value properly', async () => {
    const value = '11';

    await render(<SecondInput {...defaultProps} value={value} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', async () => {
    await render(<SecondInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', async () => {
    await render(<SecondInput {...defaultProps} disabled />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', async () => {
    await render(<SecondInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', async () => {
    await render(<SecondInput {...defaultProps} required />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', async () => {
    const inputRef = createRef<HTMLInputElement>();

    await render(<SecondInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "0" by default', async () => {
    await render(<SecondInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('min', '0');
  });

  it('has min = "0" given minDate in a past minute', async () => {
    await render(<SecondInput {...defaultProps} hour="22" minTime="21:40:15" minute="40" />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('min', '0');
  });

  it('has min = (second in minTime) given minTime in a current minute', async () => {
    await render(<SecondInput {...defaultProps} hour="22" minTime="22:40:15" minute="40" />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('min', '15');
  });

  it('has max = "59" by default', async () => {
    await render(<SecondInput {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('max', '59');
  });

  it('has max = "59" given maxTime in a future minute', async () => {
    await render(<SecondInput {...defaultProps} hour="22" maxTime="23:40:15" minute="40" />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('max', '59');
  });

  it('has max = (second in maxHour) given maxTime in a current minute', async () => {
    await render(<SecondInput {...defaultProps} hour="22" maxTime="22:40:15" minute="40" />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('max', '15');
  });
});
