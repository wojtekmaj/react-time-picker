import React from 'react';
import { render } from '@testing-library/react';

import Hour24Input from './Hour24Input';

describe('Hour24Input', () => {
  const defaultProps = {
    className: '',
    onChange: () => {},
  };

  it('renders an input', () => {
    const { container } = render(<Hour24Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
  });

  it('applies given aria-label properly', () => {
    const hourAriaLabel = 'Hour';

    const { container } = render(<Hour24Input {...defaultProps} ariaLabel={hourAriaLabel} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('aria-label', hourAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const hourPlaceholder = 'Hour';

    const { container } = render(<Hour24Input {...defaultProps} placeholder={hourPlaceholder} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('placeholder', hourPlaceholder);
  });

  it('renders "0" given showLeadingZeros if hour is <10', () => {
    const { container } = render(<Hour24Input {...defaultProps} showLeadingZeros value="9" />);

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('renders "0" given showLeadingZeros if hour is 0', () => {
    const { container } = render(<Hour24Input {...defaultProps} showLeadingZeros value="0" />);

    const input = container.querySelector('input');

    expect(container).toHaveTextContent('0');
    expect(input).toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if hour is <10 with leading zero already', () => {
    const { container } = render(<Hour24Input {...defaultProps} showLeadingZeros value="09" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if hour is >=10', () => {
    const { container } = render(<Hour24Input {...defaultProps} showLeadingZeros value="10" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', () => {
    const { container } = render(<Hour24Input {...defaultProps} value="9" />);

    const input = container.querySelector('input');

    expect(container).not.toHaveTextContent('0');
    expect(input).not.toHaveClass(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('has proper name defined', () => {
    const { container } = render(<Hour24Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('name', 'hour24');
  });

  it('has proper className defined', () => {
    const className = 'react-time-picker';

    const { container } = render(<Hour24Input {...defaultProps} className={className} />);

    const input = container.querySelector('input');

    expect(input).toHaveClass('react-time-picker__input');
    expect(input).toHaveClass('react-time-picker__hour');
  });

  it('displays given value properly', () => {
    const value = '11';

    const { container } = render(<Hour24Input {...defaultProps} value={value} />);

    const input = container.querySelector('input');

    expect(input).toHaveValue(Number(value));
  });

  it('does not disable input by default', () => {
    const { container } = render(<Hour24Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeDisabled();
  });

  it('disables input given disabled flag', () => {
    const { container } = render(<Hour24Input {...defaultProps} disabled />);

    const input = container.querySelector('input');

    expect(input).toBeDisabled();
  });

  it('is not required input by default', () => {
    const { container } = render(<Hour24Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).not.toBeRequired();
  });

  it('required input given required flag', () => {
    const { container } = render(<Hour24Input {...defaultProps} required />);

    const input = container.querySelector('input');

    expect(input).toBeRequired();
  });

  it('calls inputRef properly', () => {
    const inputRef = jest.fn();

    render(<Hour24Input {...defaultProps} inputRef={inputRef} />);

    expect(inputRef).toHaveBeenCalled();
    expect(inputRef).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('has min = "0" by default', () => {
    const { container } = render(<Hour24Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '0');
  });

  it('has min = (hour in minTime) given minTime', () => {
    const { container } = render(<Hour24Input {...defaultProps} minTime="17:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('min', '17');
  });

  it('has max = "23" by default', () => {
    const { container } = render(<Hour24Input {...defaultProps} />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '23');
  });

  it('has max = (hour in maxTime) given maxTime', () => {
    const { container } = render(<Hour24Input {...defaultProps} maxTime="17:35" />);

    const input = container.querySelector('input');

    expect(input).toHaveAttribute('max', '17');
  });
});
