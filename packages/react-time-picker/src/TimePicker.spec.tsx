import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import TimePicker from './TimePicker.js';

async function waitForElementToBeRemovedOrHidden(callback: () => HTMLElement | null) {
  const element = callback();

  if (element) {
    try {
      await waitFor(() =>
        expect(element).toHaveAttribute('class', expect.stringContaining('--closed')),
      );
    } catch (error) {
      await waitForElementToBeRemoved(element);
    }
  }
}

describe('TimePicker', () => {
  it('passes default name to TimeInput', () => {
    const { container } = render(<TimePicker />);

    const nativeInput = container.querySelector('input[type="time"]');

    expect(nativeInput).toHaveAttribute('name', 'time');
  });

  it('passes custom name to TimeInput', () => {
    const name = 'testName';

    const { container } = render(<TimePicker name={name} />);

    const nativeInput = container.querySelector('input[type="time"]');

    expect(nativeInput).toHaveAttribute('name', name);
  });

  it('passes autoFocus flag to TimeInput', () => {
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { container } = render(<TimePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveFocus();
  });

  it('passes disabled flag to TimeInput', () => {
    const { container } = render(<TimePicker disabled />);

    const nativeInput = container.querySelector('input[type="time"]');

    expect(nativeInput).toBeDisabled();
  });

  it('passes format to TimeInput', () => {
    const { container } = render(<TimePicker format="ss" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs).toHaveLength(1);
    expect(customInputs[0]).toHaveAttribute('name', 'second');
  });

  it('passes aria-label props to TimeInput', () => {
    const ariaLabelProps = {
      amPmAriaLabel: 'Select AM/PM',
      clearAriaLabel: 'Clear value',
      clockAriaLabel: 'Toggle clock',
      hourAriaLabel: 'Hour',
      minuteAriaLabel: 'Minute',
      nativeInputAriaLabel: 'Time',
      secondAriaLabel: 'Second',
    };

    const { container } = render(<TimePicker {...ariaLabelProps} maxDetail="second" />);

    const clockButton = container.querySelector('button.react-time-picker__clock-button');
    const clearButton = container.querySelector('button.react-time-picker__clear-button');

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

  it('passes placeholder props to TimeInput', () => {
    const placeholderProps = {
      hourPlaceholder: 'hh',
      minutePlaceholder: 'mm',
      secondPlaceholder: 'ss',
    };

    const { container } = render(<TimePicker {...placeholderProps} maxDetail="second" />);

    const hourInput = container.querySelector('input[name="hour12"]');
    const minuteInput = container.querySelector('input[name="minute"]');
    const secondInput = container.querySelector('input[name="second"]');

    expect(hourInput).toHaveAttribute('placeholder', placeholderProps.hourPlaceholder);
    expect(minuteInput).toHaveAttribute('placeholder', placeholderProps.minutePlaceholder);
    expect(secondInput).toHaveAttribute('placeholder', placeholderProps.secondPlaceholder);
  });

  describe('passes value to TimeInput', () => {
    it('passes single value to TimeInput', () => {
      const value = new Date(2019, 0, 1);

      const { container } = render(<TimePicker value={value} />);

      const nativeInput = container.querySelector('input[type="time"]');

      expect(nativeInput).toHaveValue('00:00');
    });

    it('passes the first item of an array of values to TimeInput', () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const { container } = render(<TimePicker value={[value1, value2]} />);

      const nativeInput = container.querySelector('input[type="time"]');

      expect(nativeInput).toHaveValue('00:00');
    });
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const { container } = render(<TimePicker className={className} />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isOpen flag', () => {
    const { container } = render(<TimePicker isOpen />);

    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('react-time-picker--open');
  });

  it('applies clock className to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const { container } = render(<TimePicker clockProps={{ className: clockClassName }} isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toHaveClass(clockClassName);
  });

  it('renders TimeInput component', () => {
    const { container } = render(<TimePicker />);

    const nativeInput = container.querySelector('input[type="time"]');

    expect(nativeInput).toBeInTheDocument();
  });

  describe('renders clear button properly', () => {
    it('renders clear button', () => {
      const { container } = render(<TimePicker />);

      const clearButton = container.querySelector('button.react-time-picker__clear-button');

      expect(clearButton).toBeInTheDocument();
    });

    it('renders clear icon by default when clearIcon is not given', () => {
      const { container } = render(<TimePicker />);

      const clearButton = container.querySelector(
        'button.react-time-picker__clear-button',
      ) as HTMLButtonElement;

      const clearIcon = clearButton.querySelector('svg');

      expect(clearIcon).toBeInTheDocument();
    });

    it('renders clear icon when given clearIcon as a string', () => {
      const { container } = render(<TimePicker clearIcon="❌" />);

      const clearButton = container.querySelector('button.react-time-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a React element', () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = render(<TimePicker clearIcon={<ClearIcon />} />);

      const clearButton = container.querySelector('button.react-time-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });

    it('renders clear icon when given clearIcon as a function', () => {
      function ClearIcon() {
        return <>❌</>;
      }

      const { container } = render(<TimePicker clearIcon={ClearIcon} />);

      const clearButton = container.querySelector('button.react-time-picker__clear-button');

      expect(clearButton).toHaveTextContent('❌');
    });
  });

  describe('renders clock button properly', () => {
    it('renders clock button', () => {
      const { container } = render(<TimePicker />);

      const clockButton = container.querySelector('button.react-time-picker__clock-button');

      expect(clockButton).toBeInTheDocument();
    });

    it('renders clock icon by default when clockIcon is not given', () => {
      const { container } = render(<TimePicker />);

      const clockButton = container.querySelector(
        'button.react-time-picker__clock-button',
      ) as HTMLButtonElement;

      const clockIcon = clockButton.querySelector('svg');

      expect(clockIcon).toBeInTheDocument();
    });

    it('renders clock icon when given clockIcon as a string', () => {
      const { container } = render(<TimePicker clockIcon="🕒" />);

      const clockButton = container.querySelector('button.react-time-picker__clock-button');

      expect(clockButton).toHaveTextContent('🕒');
    });

    it('renders clock icon when given clockIcon as a React element', () => {
      function ClockIcon() {
        return <>🕒</>;
      }

      const { container } = render(<TimePicker clockIcon={<ClockIcon />} />);

      const clockButton = container.querySelector('button.react-time-picker__clock-button');

      expect(clockButton).toHaveTextContent('🕒');
    });

    it('renders clock icon when given clockIcon as a function', () => {
      function ClockIcon() {
        return <>🕒</>;
      }

      const { container } = render(<TimePicker clockIcon={ClockIcon} />);

      const clockButton = container.querySelector('button.react-time-picker__clock-button');

      expect(clockButton).toHaveTextContent('🕒');
    });
  });

  it('renders Clock component when given isOpen flag', () => {
    const { container } = render(<TimePicker isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not render Clock component when given disableClock & isOpen flags', () => {
    const { container } = render(<TimePicker disableClock isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();
  });

  it('opens Clock component when given isOpen flag by changing props', () => {
    const { container, rerender } = render(<TimePicker />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeFalsy();

    rerender(<TimePicker isOpen />);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  it('opens Clock component when clicking on a button', () => {
    const { container } = render(<TimePicker />);

    const clock = container.querySelector('.react-clock');
    const button = container.querySelector(
      'button.react-time-picker__clock-button',
    ) as HTMLButtonElement;

    expect(clock).toBeFalsy();

    fireEvent.click(button);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  describe('handles opening Clock component when focusing on an input inside properly', () => {
    it('opens Clock component when focusing on an input inside by default', () => {
      const { container } = render(<TimePicker />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('opens Clock component when focusing on an input inside given openClockOnFocus = true', () => {
      const { container } = render(<TimePicker openClockOnFocus />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('does not open Clock component when focusing on an input inside given openClockOnFocus = false', () => {
      const { container } = render(<TimePicker openClockOnFocus={false} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock when focusing on an input inside given shouldOpenCalendar function returning false', () => {
      const shouldOpenClock = () => false;

      const { container } = render(<TimePicker shouldOpenClock={shouldOpenClock} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]') as HTMLInputElement;

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on a select element', () => {
      const { container } = render(<TimePicker format="hh:mm:ss a" />);

      const clock = container.querySelector('.react-clock');
      const select = container.querySelector('select[name="amPm"]') as HTMLSelectElement;

      expect(clock).toBeFalsy();

      fireEvent.focus(select);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });
  });

  it('closes Clock component when clicked outside', async () => {
    const { container } = render(<TimePicker isOpen />);

    userEvent.click(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-time-picker__clock'),
    );
  });

  it('does not close Clock clicked outside with shouldCloseClock function returning false', () => {
    const shouldCloseClock = () => false;

    const { container } = render(<TimePicker isOpen shouldCloseClock={shouldCloseClock} />);

    userEvent.click(document.body);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock component when focused outside', async () => {
    const { container } = render(<TimePicker isOpen />);

    fireEvent.focusIn(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-time-picker__clock'),
    );
  });

  it('closes Clock component when tapped outside', async () => {
    const { container } = render(<TimePicker isOpen />);

    fireEvent.touchStart(document.body);

    await waitForElementToBeRemovedOrHidden(() =>
      container.querySelector('.react-time-picker__clock'),
    );
  });

  it('does not close Clock component when focused inside', () => {
    const { container } = render(<TimePicker isOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0] as HTMLInputElement;
    const minuteInput = customInputs[1] as HTMLInputElement;

    fireEvent.blur(hourInput);
    fireEvent.focus(minuteInput);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not close Clock when changing value', () => {
    const { container } = render(<TimePicker isOpen />);

    const hourInput = container.querySelector('input[name="hour12"]') as HTMLInputElement;

    act(() => {
      fireEvent.change(hourInput, { target: { value: '9' } });
    });

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('calls onChange callback when changing value', () => {
    const value = '22:41:28';
    const onChange = vi.fn();

    const { container } = render(
      <TimePicker maxDetail="second" onChange={onChange} value={value} />,
    );

    const hourInput = container.querySelector('input[name="hour12"]') as HTMLInputElement;

    act(() => {
      fireEvent.change(hourInput, { target: { value: '9' } });
    });

    expect(onChange).toHaveBeenCalledWith('21:41:28');
  });

  it('calls onInvalidChange callback when changing value to an invalid one', () => {
    const value = '22:41:28';
    const onInvalidChange = vi.fn();

    const { container } = render(
      <TimePicker maxDetail="second" onInvalidChange={onInvalidChange} value={value} />,
    );

    const hourInput = container.querySelector('input[name="hour12"]') as HTMLInputElement;

    act(() => {
      fireEvent.change(hourInput, { target: { value: '99' } });
    });

    expect(onInvalidChange).toHaveBeenCalled();
  });

  it('clears the value when clicking on a button', () => {
    const onChange = vi.fn();

    const { container } = render(<TimePicker onChange={onChange} />);

    const clock = container.querySelector('.react-clock');
    const button = container.querySelector(
      'button.react-time-picker__clear-button',
    ) as HTMLButtonElement;

    expect(clock).toBeFalsy();

    fireEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onClick callback when clicked a page (sample of mouse events family)', () => {
    const onClick = vi.fn();

    const { container } = render(<TimePicker onClick={onClick} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    fireEvent.click(wrapper);

    expect(onClick).toHaveBeenCalled();
  });

  it('calls onTouchStart callback when touched a page (sample of touch events family)', () => {
    const onTouchStart = vi.fn();

    const { container } = render(<TimePicker onTouchStart={onTouchStart} />);

    const wrapper = container.firstElementChild as HTMLDivElement;
    fireEvent.touchStart(wrapper);

    expect(onTouchStart).toHaveBeenCalled();
  });
});
