import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { act } from 'react-dom/test-utils';

import TimePicker from './TimePicker.js';

import type { Locator } from 'vitest/browser';

async function waitForElementToBeRemovedOrHidden(callback: () => HTMLElement | null) {
  const element = callback();

  if (element) {
    await vi.waitFor(() =>
      expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
    );
  }
}

describe('TimePicker', () => {
  const defaultProps = {
    amPmAriaLabel: 'amPm',
    hourAriaLabel: 'hour',
    minuteAriaLabel: 'minute',
    secondAriaLabel: 'second',
  };

  it('passes default name to TimeInput', async () => {
    const { container } = await render(<TimePicker {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="time"]');

    expect(nativeInput).toHaveAttribute('name', 'time');
  });

  it('passes custom name to TimeInput', async () => {
    const name = 'testName';

    const { container } = await render(<TimePicker {...defaultProps} name={name} />);

    const nativeInput = container.querySelector('input[type="time"]');

    expect(nativeInput).toHaveAttribute('name', name);
  });

  it('passes autoFocus flag to TimeInput', async () => {
    await render(<TimePicker {...defaultProps} autoFocus />);

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs.nth(0)).toHaveFocus();
  });

  it('passes disabled flag to TimeInput', async () => {
    const { container } = await render(<TimePicker {...defaultProps} disabled />);

    const nativeInput = container.querySelector('input[type="time"]');

    expect(nativeInput).toBeDisabled();
  });

  it('passes format to TimeInput', async () => {
    await render(<TimePicker {...defaultProps} format="ss" />);

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs).toHaveLength(1);
    expect(customInputs.nth(0)).toHaveAttribute('name', 'second');
  });

  it('passes aria-label props to TimeInput', async () => {
    const ariaLabelProps = {
      amPmAriaLabel: 'Select AM/PM',
      clearAriaLabel: 'Clear value',
      clockAriaLabel: 'Toggle clock',
      hourAriaLabel: 'Hour',
      minuteAriaLabel: 'Minute',
      nativeInputAriaLabel: 'Time',
      secondAriaLabel: 'Second',
    };

    const { container } = await render(<TimePicker {...ariaLabelProps} maxDetail="second" />);

    const clockButton = page.getByTestId('clock-button');
    const clearButton = page.getByTestId('clear-button');

    const nativeInput = container.querySelector('input[type="time"]');
    const amPmSelect = container.querySelector('select[name="amPm"]');

    const hourInput = container.querySelector('input[name="hour12"]');
    const minuteInput = container.querySelector('input[name="minute"]');
    const secondInput = container.querySelector('input[name="second"]');

    expect(clockButton).toHaveAttribute('aria-label', ariaLabelProps.clockAriaLabel);
    expect(clearButton).toHaveAttribute('aria-label', ariaLabelProps.clearAriaLabel);

    expect(nativeInput).toHaveAttribute('aria-label', ariaLabelProps.nativeInputAriaLabel);
    expect(amPmSelect).toHaveAttribute('aria-label', ariaLabelProps.amPmAriaLabel);

    expect(hourInput).toHaveAttribute('aria-label', ariaLabelProps.hourAriaLabel);
    expect(minuteInput).toHaveAttribute('aria-label', ariaLabelProps.minuteAriaLabel);
    expect(secondInput).toHaveAttribute('aria-label', ariaLabelProps.secondAriaLabel);
  });

  it('passes placeholder props to TimeInput', async () => {
    const placeholderProps = {
      hourPlaceholder: 'hh',
      minutePlaceholder: 'mm',
      secondPlaceholder: 'ss',
    };

    await render(<TimePicker {...defaultProps} {...placeholderProps} maxDetail="second" />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });
    const secondInput = page.getByRole('spinbutton', { name: 'second' });

    expect(hourInput).toHaveAttribute('placeholder', placeholderProps.hourPlaceholder);
    expect(minuteInput).toHaveAttribute('placeholder', placeholderProps.minutePlaceholder);
    expect(secondInput).toHaveAttribute('placeholder', placeholderProps.secondPlaceholder);
  });

  describe('passes value to TimeInput', () => {
    it('passes single value to TimeInput', async () => {
      const value = new Date(2019, 0, 1);

      const { container } = await render(<TimePicker {...defaultProps} value={value} />);

      const nativeInput = container.querySelector('input[type="time"]');

      expect(nativeInput).toHaveValue('00:00');
    });

    it('passes the first item of an array of values to TimeInput', async () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const { container } = await render(<TimePicker {...defaultProps} value={[value1, value2]} />);

      const nativeInput = container.querySelector('input[type="time"]');

      expect(nativeInput).toHaveValue('00:00');
    });
  });

  it('applies className to its wrapper when given a string', async () => {
    const className = 'testClassName';

    const { container } = await render(<TimePicker {...defaultProps} className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isOpen flag', async () => {
    const { container } = await render(<TimePicker {...defaultProps} isOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-time-picker--open');
  });

  it('applies clock className to the clock when given a string', async () => {
    const clockClassName = 'testClassName';

    const { container } = await render(
      <TimePicker {...defaultProps} clockProps={{ className: clockClassName }} isOpen />,
    );

    const clock = container.querySelector('.react-clock');

    expect(clock).toHaveClass(clockClassName);
  });

  it('renders TimeInput component', async () => {
    const { container } = await render(<TimePicker {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="time"]');

    expect(nativeInput).toBeInTheDocument();
  });

  describe('renders clear button properly', () => {
    it('renders clear button', async () => {
      await render(<TimePicker {...defaultProps} />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', async () => {
      await render(<TimePicker {...defaultProps} />);

      const clearButton = page.getByTestId('clear-button');

      const clearIcon = clearButton.element().querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a string', async () => {
      await render(<TimePicker {...defaultProps} clearIcon="❌" />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a React element', async () => {
      function ClearIcon() {
        return <>❌</>;
      }

      await render(<TimePicker {...defaultProps} clearIcon={<ClearIcon />} />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', async () => {
      function ClearIcon() {
        return <>❌</>;
      }

      await render(<TimePicker {...defaultProps} clearIcon={ClearIcon} />);

      const clearButton = page.getByTestId('clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders clock button properly', () => {
    it('renders clock button', async () => {
      await render(<TimePicker {...defaultProps} />);

      const clockButton = page.getByTestId('clock-button');

      expect(clockButton).toBeInTheDocument();
    });

    it('renders clock icon by default when clockIcon is not given', async () => {
      await render(<TimePicker {...defaultProps} />);

      const clockButton = page.getByTestId('clock-button');

      const clockIcon = clockButton.element().querySelector('svg');

      expect(clockIcon).toBeInTheDocument();
    });

    it('renders clock icon when given clockIcon as a string', async () => {
      await render(<TimePicker {...defaultProps} clockIcon="🕒" />);

      const clockButton = page.getByTestId('clock-button');

      expect(clockButton).toHaveTextContent('🕒');
    });

    it('renders clock icon when given clockIcon as a React element', async () => {
      function ClockIcon() {
        return <>🕒</>;
      }

      await render(<TimePicker {...defaultProps} clockIcon={<ClockIcon />} />);

      const clockButton = page.getByTestId('clock-button');

      expect(clockButton).toHaveTextContent('🕒');
    });

    it('renders clock icon when given clockIcon as a function', async () => {
      function ClockIcon() {
        return <>🕒</>;
      }

      await render(<TimePicker {...defaultProps} clockIcon={ClockIcon} />);

      const clockButton = page.getByTestId('clock-button');

      expect(clockButton).toHaveTextContent('🕒');
    });
  });

  it('renders Clock component when given isOpen flag', async () => {
    const { container } = await render(<TimePicker {...defaultProps} isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not render Clock component when given disableClock & isOpen flags', async () => {
    const { container } = await render(<TimePicker {...defaultProps} disableClock isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).not.toBeInTheDocument();
  });

  it('opens Clock component when given isOpen flag by changing props', async () => {
    const { container, rerender } = await render(<TimePicker {...defaultProps} />);

    const clock = container.querySelector('.react-clock');

    expect(clock).not.toBeInTheDocument();

    rerender(<TimePicker {...defaultProps} isOpen />);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  it('opens Clock component when clicking on a button', async () => {
    const { container } = await render(<TimePicker {...defaultProps} />);

    const clock = container.querySelector('.react-clock');
    const button = page.getByTestId('clock-button');

    expect(clock).not.toBeInTheDocument();

    await userEvent.click(button);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  function triggerFocusInEvent(locator: Locator) {
    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('focusin', { bubbles: true, cancelable: false, composed: true }),
    );
  }

  function triggerFocusEvent(locator: Locator) {
    triggerFocusInEvent(locator);

    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('focus', { bubbles: false, cancelable: false, composed: true }),
    );
  }

  describe('handles opening Clock component when focusing on an input inside properly', () => {
    it('opens Clock component when focusing on an input inside by default', async () => {
      const { container } = await render(<TimePicker {...defaultProps} />);

      const clock = container.querySelector('.react-clock');
      const input = page.getByRole('spinbutton', { name: /hour/ });

      expect(clock).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('opens Clock component when focusing on an input inside given openClockOnFocus = true', async () => {
      const { container } = await render(<TimePicker {...defaultProps} openClockOnFocus />);

      const clock = container.querySelector('.react-clock');
      const input = page.getByRole('spinbutton', { name: /hour/ });

      expect(clock).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('does not open Clock component when focusing on an input inside given openClockOnFocus = false', async () => {
      const { container } = await render(<TimePicker {...defaultProps} openClockOnFocus={false} />);

      const clock = container.querySelector('.react-clock');
      const input = page.getByRole('spinbutton', { name: /hour/ });

      expect(clock).not.toBeInTheDocument();

      act(() => {
        triggerFocusEvent(input);
      });

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock when focusing on an input inside given shouldOpenCalendar function returning false', async () => {
      const shouldOpenClock = () => false;

      const { container } = await render(
        <TimePicker {...defaultProps} shouldOpenClock={shouldOpenClock} />,
      );

      const clock = container.querySelector('.react-clock');
      const input = page.getByRole('spinbutton', { name: /hour/ });

      expect(clock).not.toBeInTheDocument();

      triggerFocusEvent(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on a select element', async () => {
      const { container } = await render(<TimePicker {...defaultProps} format="hh:mm:ss a" />);

      const clock = container.querySelector('.react-clock');
      const select = page.getByRole('combobox', { name: 'amPm' });

      expect(clock).not.toBeInTheDocument();

      triggerFocusEvent(select);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });
  });

  it('closes Clock component when clicked outside', async () => {
    const { container } = await render(<TimePicker {...defaultProps} isOpen />);

    await userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-time-picker__clock'),
    );
  });

  it('does not close Clock clicked outside with shouldCloseClock function returning false', async () => {
    const shouldCloseClock = () => false;

    const { container } = await render(
      <TimePicker {...defaultProps} isOpen shouldCloseClock={shouldCloseClock} />,
    );

    await userEvent.click(document.body);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock component when focused outside', async () => {
    const { container } = await render(<TimePicker {...defaultProps} isOpen />);

    triggerFocusInEvent(page.elementLocator(document.body));

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-time-picker__clock'),
    );
  });

  function triggerTouchStart(element: HTMLElement) {
    element.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
  }

  it('closes Clock component when tapped outside', async () => {
    const { container } = await render(<TimePicker {...defaultProps} isOpen />);

    triggerTouchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-time-picker__clock'),
    );
  });

  function triggerFocusOutEvent(locator: Locator) {
    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, cancelable: false, composed: true }),
    );
  }

  function triggerBlurEvent(locator: Locator) {
    triggerFocusOutEvent(locator);

    const element = locator.element();

    element.dispatchEvent(
      new FocusEvent('blur', { bubbles: false, cancelable: false, composed: true }),
    );
  }

  it('does not close Clock component when focused inside', async () => {
    const { container } = await render(<TimePicker {...defaultProps} isOpen />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });

    triggerBlurEvent(hourInput);
    triggerFocusEvent(minuteInput);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not close Clock when changing value', async () => {
    const { container } = await render(<TimePicker {...defaultProps} isOpen />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });

    await act(async () => {
      await userEvent.fill(hourInput, '9');
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('calls onChange callback when changing value', async () => {
    const value = '22:41:28';
    const onChange = vi.fn();

    await render(
      <TimePicker {...defaultProps} maxDetail="second" onChange={onChange} value={value} />,
    );

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });

    await act(async () => {
      await userEvent.fill(hourInput, '9');
    });

    expect(onChange).toHaveBeenCalledWith('21:41:28');
  });

  it('calls onInvalidChange callback when changing value to an invalid one', async () => {
    const value = '22:41:28';
    const onInvalidChange = vi.fn();

    await render(
      <TimePicker
        {...defaultProps}
        maxDetail="second"
        onInvalidChange={onInvalidChange}
        value={value}
      />,
    );

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });

    await act(async () => {
      await userEvent.fill(hourInput, '99');
    });

    expect(onInvalidChange).toHaveBeenCalled();
  });

  it('clears the value when clicking on a button', async () => {
    const onChange = vi.fn();

    const { container } = await render(<TimePicker {...defaultProps} onChange={onChange} />);

    const clock = container.querySelector('.react-clock');
    const button = page.getByTestId('clear-button');

    expect(clock).not.toBeInTheDocument();

    await userEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onClick callback when clicked a page (sample of mouse events family)', async () => {
    const onClick = vi.fn();

    const { container } = await render(<TimePicker {...defaultProps} onClick={onClick} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    await userEvent.click(wrapper);

    expect(onClick).toHaveBeenCalled();
  });

  it('calls onTouchStart callback when touched a page (sample of touch events family)', async () => {
    const onTouchStart = vi.fn();

    const { container } = await render(
      <TimePicker {...defaultProps} onTouchStart={onTouchStart} />,
    );

    const wrapper = container.firstElementChild as HTMLDivElement;

    triggerTouchStart(wrapper);

    expect(onTouchStart).toHaveBeenCalled();
  });
});
