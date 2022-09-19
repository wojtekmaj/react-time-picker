import React, { createRef } from 'react';
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react';

import TimePicker from './TimePicker';

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

  // See https://github.com/jsdom/jsdom/issues/3041
  it.skip('passes autoFocus flag to TimeInput', () => {
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { container } = render(<TimePicker autoFocus />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('autofocus');
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

    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass(className);
  });

  it('applies "--open" className to its wrapper when given isOpen flag', () => {
    const { container } = render(<TimePicker isOpen />);

    const wrapper = container.firstChild;

    expect(wrapper).toHaveClass('react-time-picker--open');
  });

  it('applies clockClassName to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const { container } = render(<TimePicker clockClassName={clockClassName} isOpen />);

    const clock = container.querySelector('.react-clock');

    expect(clock).toHaveClass(clockClassName);
  });

  it('renders TimeInput component', () => {
    const { container } = render(<TimePicker />);

    const nativeInput = container.querySelector('input[type="time"]');

    expect(nativeInput).toBeInTheDocument();
  });

  it('renders clear button', () => {
    const { container } = render(<TimePicker />);

    const clearButton = container.querySelector('button.react-time-picker__clear-button');

    expect(clearButton).toBeInTheDocument();
  });

  it('renders clock button', () => {
    const { container } = render(<TimePicker />);

    const clockButton = container.querySelector('button.react-time-picker__clock-button');

    expect(clockButton).toBeInTheDocument();
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
    const button = container.querySelector('button.react-time-picker__clock-button');

    expect(clock).toBeFalsy();

    fireEvent.click(button);

    const clock2 = container.querySelector('.react-clock');

    expect(clock2).toBeInTheDocument();
  });

  describe('handles opening Clock component when focusing on an input inside properly', () => {
    it('opens Clock component when focusing on an input inside by default', () => {
      const { container } = render(<TimePicker />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('opens Clock component when focusing on an input inside given openClockOnFocus = true', () => {
      const { container } = render(<TimePicker openClockOnFocus />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeInTheDocument();
    });

    it('does not open Clock component when focusing on an input inside given openClockOnFocus = false', () => {
      const { container } = render(<TimePicker openClockOnFocus={false} />);

      const clock = container.querySelector('.react-clock');
      const input = container.querySelector('input[name^="hour"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(input);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });

    it('does not open Clock component when focusing on a select element', () => {
      const { container } = render(<TimePicker format="hh:mm:ss a" />);

      const clock = container.querySelector('.react-clock');
      const select = container.querySelector('select[name="amPm"]');

      expect(clock).toBeFalsy();

      fireEvent.focus(select);

      const clock2 = container.querySelector('.react-clock');

      expect(clock2).toBeFalsy();
    });
  });

  it('closes Clock component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<TimePicker isOpen />, { attachTo: root });

    fireEvent.mouseDown(document.body);

    waitForElementToBeRemoved(() => container.querySelector('.react-clock'));
  });

  it('closes Clock component when focused outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<TimePicker isOpen />, { attachTo: root });

    fireEvent.focusIn(document.body);

    waitForElementToBeRemoved(() => container.querySelector('.react-clock'));
  });

  it('closes Clock component when tapped outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const { container } = render(<TimePicker isOpen />, { attachTo: root });

    fireEvent.touchStart(document.body);

    waitForElementToBeRemoved(() => container.querySelector('.react-clock'));
  });

  it('does not close Clock component when focused inside', () => {
    const { container } = render(<TimePicker isOpen />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0];
    const minuteInput = customInputs[1];

    fireEvent.blur(hourInput);
    fireEvent.focus(minuteInput);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('closes Clock when calling internal onChange by default', () => {
    const instance = createRef();

    const { container } = render(<TimePicker isOpen ref={instance} />);

    const { onChange } = instance.current;

    onChange(new Date());

    waitForElementToBeRemoved(() => container.querySelector('.react-clock'));
  });

  it('does not close Clock when calling internal onChange with prop closeClock = false', () => {
    const instance = createRef();

    const { container } = render(<TimePicker closeClock={false} isOpen ref={instance} />);

    const { onChange } = instance.current;

    onChange(new Date());

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('does not close Clock when calling internal onChange with closeClock = false', () => {
    const instance = createRef();

    const { container } = render(<TimePicker isOpen ref={instance} />);

    const { onChange } = instance.current;

    onChange(new Date(), false);

    const clock = container.querySelector('.react-clock');

    expect(clock).toBeInTheDocument();
  });

  it('calls onChange callback when calling internal onChange', () => {
    const instance = createRef();
    const nextValue = '22:41:28';
    const onChange = jest.fn();

    render(<TimePicker onChange={onChange} ref={instance} />);

    const { onChange: onChangeInternal } = instance.current;

    onChangeInternal(nextValue);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('clears the value when clicking on a button', () => {
    const onChange = jest.fn();

    const { container } = render(<TimePicker onChange={onChange} />);

    const clock = container.querySelector('.react-clock');
    const button = container.querySelector('button.react-time-picker__clear-button');

    expect(clock).toBeFalsy();

    fireEvent.click(button);

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
