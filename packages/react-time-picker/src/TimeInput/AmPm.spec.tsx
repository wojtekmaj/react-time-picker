import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import AmPm from './AmPm.js';

describe('AmPm', () => {
  const defaultProps = {
    className: '',
    onChange: () => {
      // Intentionally empty
    },
  } satisfies React.ComponentProps<typeof AmPm>;

  it('renders a select', async () => {
    await render(<AmPm {...defaultProps} />);

    const select = page.getByRole('combobox');
    expect(select).toBeInTheDocument();

    const options = select.getByRole('option');
    expect(options).toHaveLength(3);
  });

  it('applies given aria-label properly', async () => {
    const amPmAriaLabel = 'Select AM/PM';

    await render(<AmPm {...defaultProps} ariaLabel={amPmAriaLabel} />);

    const select = page.getByRole('combobox');

    expect(select).toHaveAttribute('aria-label', amPmAriaLabel);
  });

  it('has proper name defined', async () => {
    await render(<AmPm {...defaultProps} />);

    const select = page.getByRole('combobox');

    expect(select).toHaveAttribute('name', 'amPm');
  });

  it('has proper className defined', async () => {
    const className = 'react-time-picker';

    await render(<AmPm {...defaultProps} className={className} />);

    const select = page.getByRole('combobox');

    expect(select).toHaveClass('react-time-picker__input');
    expect(select).toHaveClass('react-time-picker__amPm');
  });

  it('displays given value properly', async () => {
    const value = 'pm';

    await render(<AmPm {...defaultProps} value={value} />);

    const select = page.getByRole('combobox');

    expect(select).toHaveValue(value);
  });

  it('does not disable select by default', async () => {
    await render(<AmPm {...defaultProps} />);

    const select = page.getByRole('combobox');

    expect(select).not.toBeDisabled();
  });

  it('disables input given disabled flag', async () => {
    await render(<AmPm {...defaultProps} disabled />);

    const select = page.getByRole('combobox');

    expect(select).toBeDisabled();
  });

  it('should not disable anything by default', async () => {
    await render(<AmPm {...defaultProps} />);

    const select = page.getByRole('combobox');
    const optionAm = select.element().querySelector('option[value="am"]');
    const optionPm = select.element().querySelector('option[value="pm"]');

    expect(optionAm).not.toBeDisabled();
    expect(optionPm).not.toBeDisabled();
  });

  it('should disable "pm" given maxTime before 12:00 pm', async () => {
    await render(<AmPm {...defaultProps} maxTime="11:59" />);

    const select = page.getByRole('combobox');
    const optionPm = select.element().querySelector('option[value="pm"]');

    expect(optionPm).toBeDisabled();
  });

  it('should not disable "pm" given maxTime after or equal to 12:00 pm', async () => {
    await render(<AmPm {...defaultProps} maxTime="12:00" />);

    const select = page.getByRole('combobox');
    const optionPm = select.element().querySelector('option[value="pm"]');

    expect(optionPm).not.toBeDisabled();
  });

  it('should disable "am" given minTime after or equal to 12:00 pm', async () => {
    await render(<AmPm {...defaultProps} minTime="12:00" />);

    const select = page.getByRole('combobox');
    const optionAm = select.element().querySelector('option[value="am"]');

    expect(optionAm).toBeDisabled();
  });

  it('should not disable "am" given minTime before 12:00 pm', async () => {
    await render(<AmPm {...defaultProps} minTime="11:59" />);

    const select = page.getByRole('combobox');
    const optionAm = select.element().querySelector('option[value="pm"]');

    expect(optionAm).not.toBeDisabled();
  });
});
