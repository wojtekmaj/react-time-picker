import { describe, expect, it } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';

import AmPm from './AmPm.js';

describe('AmPm', () => {
  const defaultProps = {
    className: '',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof AmPm>;

  it('renders a select', () => {
    const { container } = render(<AmPm {...defaultProps} />);

    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select).toBeInTheDocument();

    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(3);
  });

  it('applies given aria-label properly', () => {
    const amPmAriaLabel = 'Select AM/PM';

    const { container } = render(<AmPm {...defaultProps} ariaLabel={amPmAriaLabel} />);

    const select = container.querySelector('select');

    expect(select).toHaveAttribute('aria-label', amPmAriaLabel);
  });

  it('has proper name defined', () => {
    const { container } = render(<AmPm {...defaultProps} />);

    const select = container.querySelector('select');

    expect(select).toHaveAttribute('name', 'amPm');
  });

  it('has proper className defined', () => {
    const className = 'react-time-picker';

    const { container } = render(<AmPm {...defaultProps} className={className} />);

    const select = container.querySelector('select');

    expect(select).toHaveClass('react-time-picker__input');
    expect(select).toHaveClass('react-time-picker__amPm');
  });

  it('displays given value properly', () => {
    const value = 'pm';

    const { container } = render(<AmPm {...defaultProps} value={value} />);

    const select = container.querySelector('select');

    expect(select).toHaveValue(value);
  });

  it('does not disable select by default', () => {
    const { container } = render(<AmPm {...defaultProps} />);

    const select = container.querySelector('select');

    expect(select).not.toBeDisabled();
  });

  it('disables input given disabled flag', () => {
    const { container } = render(<AmPm {...defaultProps} disabled />);

    const select = container.querySelector('select');

    expect(select).toBeDisabled();
  });

  it('should not disable anything by default', () => {
    const { container } = render(<AmPm {...defaultProps} />);

    const select = container.querySelector('select') as HTMLSelectElement;
    const optionAm = select.querySelector('option[value="am"]');
    const optionPm = select.querySelector('option[value="pm"]');

    expect(optionAm).not.toBeDisabled();
    expect(optionPm).not.toBeDisabled();
  });

  it('should disable "pm" given maxTime before 12:00 pm', () => {
    const { container } = render(<AmPm {...defaultProps} maxTime="11:59" />);

    const select = container.querySelector('select') as HTMLSelectElement;
    const optionPm = select.querySelector('option[value="pm"]');

    expect(optionPm).toBeDisabled();
  });

  it('should not disable "pm" given maxTime after or equal to 12:00 pm', () => {
    const { container } = render(<AmPm {...defaultProps} maxTime="12:00" />);

    const select = container.querySelector('select') as HTMLSelectElement;
    const optionPm = select.querySelector('option[value="pm"]');

    expect(optionPm).not.toBeDisabled();
  });

  it('should disable "am" given minTime after or equal to 12:00 pm', () => {
    const { container } = render(<AmPm {...defaultProps} minTime="12:00" />);

    const select = container.querySelector('select') as HTMLSelectElement;
    const optionAm = select.querySelector('option[value="am"]');

    expect(optionAm).toBeDisabled();
  });

  it('should not disable "am" given minTime before 12:00 pm', () => {
    const { container } = render(<AmPm {...defaultProps} minTime="11:59" />);

    const select = container.querySelector('select') as HTMLSelectElement;
    const optionAm = select.querySelector('option[value="pm"]');

    expect(optionAm).not.toBeDisabled();
  });
});
