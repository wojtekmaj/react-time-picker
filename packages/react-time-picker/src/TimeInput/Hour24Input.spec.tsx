import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { createRef } from 'react';

import Hour24Input from './Hour24Input.js';

describe('Hour24Input', () => {
  const defaultProps = {
    className: '',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof Hour24Input>;

  it('renders an input', async () => {
    await render(<Hour24Input {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', async () => {
    const hourAriaLabel = 'Hour';

    await render(<Hour24Input {...defaultProps} ariaLabel={hourAriaLabel} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('aria-label', hourAriaLabel);
  });

  it('applies given placeholder properly', async () => {
    const hourPlaceholder = 'Hour';

    await render(<Hour24Input {...defaultProps} placeholder={hourPlaceholder} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('placeholder', hourPlaceholder);
  });

  it('renders "0" given showLeadingZeros if hour is <10', async () => {
    const { container } = await render(
      <Hour24Input {...defaultProps} showLeadingZeros value="9" />,
    );

    const input = page.getByRole('spinbutton');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('renders "0" given showLeadingZeros if hour is 0', async () => {
    const { container } = await render(
      <Hour24Input {...defaultProps} showLeadingZeros value="0" />,
    );

    const input = page.getByRole('spinbutton');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if hour is <10 with leading zero already', async () => {
    const { container } = await render(
      <Hour24Input {...defaultProps} showLeadingZeros value="09" />,
    );

    const input = page.getByRole('spinbutton');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if hour is >=10', async () => {
    const { container } = await render(
      <Hour24Input {...defaultProps} showLeadingZeros value="10" />,
    );

    const input = page.getByRole('spinbutton');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', async () => {
    const { container } = await render(<Hour24Input {...defaultProps} value="9" />);

    const input = page.getByRole('spinbutton');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('has proper name defined', async () => {
    await render(<Hour24Input {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('name', 'hour24');
  });

  it('has proper className defined', async () => {
    const className = 'react-time-picker';

    await render(<Hour24Input {...defaultProps} className={className} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveClass('react-time-picker__input');
    expect(input).toHaveClass('react-time-picker__hour');
  });

  it('displays given value properly', async () => {
    const value = '11';

    await render(<Hour24Input {...defaultProps} value={value} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', async () => {
    await render(<Hour24Input {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', async () => {
    await render(<Hour24Input {...defaultProps} disabled />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', async () => {
    await render(<Hour24Input {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', async () => {
    await render(<Hour24Input {...defaultProps} required />);

    const input = page.getByRole('spinbutton');

    expect(input).toBeRequired();
  });

  it('handles inputRef properly', async () => {
    const inputRef = createRef<HTMLInputElement>();

    await render(<Hour24Input {...defaultProps} inputRef={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has min = "0" by default', async () => {
    await render(<Hour24Input {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('min', '0');
  });

  it('has min = (hour in minTime) given minTime', async () => {
    await render(<Hour24Input {...defaultProps} minTime="17:35" />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('min', '17');
  });

  it('has max = "23" by default', async () => {
    await render(<Hour24Input {...defaultProps} />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('max', '23');
  });

  it('has max = (hour in maxTime) given maxTime', async () => {
    await render(<Hour24Input {...defaultProps} maxTime="17:35" />);

    const input = page.getByRole('spinbutton');

    expect(input).toHaveAttribute('max', '17');
  });
});
