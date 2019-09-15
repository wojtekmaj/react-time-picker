import React from 'react';
import { mount } from 'enzyme';

import TimePicker from '../TimePicker';

/* eslint-disable comma-dangle */

describe('TimePicker', () => {
  it('passes default name to TimeInput', () => {
    const component = mount(
      <TimePicker />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.prop('name')).toBe('time');
  });

  it('passes custom name to TimeInput', () => {
    const name = 'testName';

    const component = mount(
      <TimePicker name={name} />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.prop('name')).toBe(name);
  });

  it('passes disabled flag to TimeInput', () => {
    const component = mount(
      <TimePicker disabled />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.prop('disabled')).toBeTruthy();
  });

  it('passes format to TimeInput', () => {
    const format = 'H:mm:ss';

    const component = mount(
      <TimePicker format={format} />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.prop('format')).toBe(format);
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

    const component = mount(
      <TimePicker {...ariaLabelProps} />
    );

    const clockButton = component.find('button.react-time-picker__clock-button');
    const clearButton = component.find('button.react-time-picker__clear-button');
    const timeInput = component.find('TimeInput');

    expect(clockButton.prop('aria-label')).toBe(ariaLabelProps.clockAriaLabel);
    expect(clearButton.prop('aria-label')).toBe(ariaLabelProps.clearAriaLabel);
    expect(timeInput.prop('amPmAriaLabel')).toBe(ariaLabelProps.amPmAriaLabel);
    expect(timeInput.prop('hourAriaLabel')).toBe(ariaLabelProps.hourAriaLabel);
    expect(timeInput.prop('minuteAriaLabel')).toBe(ariaLabelProps.minuteAriaLabel);
    expect(timeInput.prop('nativeInputAriaLabel')).toBe(ariaLabelProps.nativeInputAriaLabel);
    expect(timeInput.prop('secondAriaLabel')).toBe(ariaLabelProps.secondAriaLabel);
  });

  it('passes placeholder props to TimeInput', () => {
    const placeholderProps = {
      hourPlaceholder: 'hh',
      minutePlaceholder: 'mm',
      secondPlaceholder: 'ss',
    };

    const component = mount(
      <TimePicker {...placeholderProps} />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.prop('hourPlaceholder')).toBe(placeholderProps.hourPlaceholder);
    expect(timeInput.prop('minutePlaceholder')).toBe(placeholderProps.minutePlaceholder);
    expect(timeInput.prop('secondPlaceholder')).toBe(placeholderProps.secondPlaceholder);
  });

  describe('passes value to TimeInput', () => {
    it('passes single value to TimeInput', () => {
      const value = new Date(2019, 0, 1);

      const component = mount(
        <TimePicker value={value} />
      );

      const timeInput = component.find('TimeInput');

      expect(timeInput.prop('value')).toBe(value);
    });

    it('passes the first item of an array of values to TimeInput', () => {
      const value1 = new Date(2019, 0, 1);
      const value2 = new Date(2019, 6, 1);

      const component = mount(
        <TimePicker value={[value1, value2]} />
      );

      const timeInput = component.find('TimeInput');

      expect(timeInput.prop('value')).toBe(value1);
    });
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const component = mount(
      <TimePicker className={className} />
    );

    const wrapperClassName = component.prop('className');

    expect(wrapperClassName.includes(className)).toBe(true);
  });

  it('applies clockClassName to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const component = mount(
      <TimePicker
        clockClassName={clockClassName}
        isOpen
      />
    );

    const clock = component.find('Clock');
    const clockWrapperClassName = clock.prop('className');

    expect(clockWrapperClassName.includes(clockClassName)).toBe(true);
  });

  it('renders TimeInput component', () => {
    const component = mount(
      <TimePicker />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput).toHaveLength(1);
  });

  it('renders clear button', () => {
    const component = mount(
      <TimePicker />
    );

    const clearButton = component.find('button.react-time-picker__clear-button');

    expect(clearButton).toHaveLength(1);
  });

  it('renders clock button', () => {
    const component = mount(
      <TimePicker />
    );

    const clockButton = component.find('button.react-time-picker__clock-button');

    expect(clockButton).toHaveLength(1);
  });

  it('renders TimeInput and Clock component when given isOpen flag', () => {
    const component = mount(
      <TimePicker isOpen />
    );

    const timeInput = component.find('TimeInput');
    const clock = component.find('Clock');

    expect(timeInput).toHaveLength(1);
    expect(clock).toHaveLength(1);
  });

  it('does not render Clock component when given disableClock & isOpen flags', () => {
    const component = mount(
      <TimePicker disableClock isOpen />
    );

    const timeInput = component.find('TimeInput');
    const clock = component.find('Clock');

    expect(timeInput).toHaveLength(1);
    expect(clock).toHaveLength(0);
  });

  it('opens Clock component when given isOpen flag by changing props', () => {
    const component = mount(
      <TimePicker />
    );

    const clock = component.find('Clock');

    expect(clock).toHaveLength(0);

    component.setProps({ isOpen: true });
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('opens Clock component when clicking on a button', () => {
    const component = mount(
      <TimePicker />
    );

    const clock = component.find('Clock');
    const button = component.find('button.react-time-picker__clock-button');

    expect(clock).toHaveLength(0);

    button.simulate('click');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('opens Clock component when focusing on an input inside', () => {
    const component = mount(
      <TimePicker />
    );

    const clock = component.find('Clock');
    const input = component.find('input[name^="hour"]');

    expect(clock).toHaveLength(0);

    input.simulate('focus');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('closes Clock component when clicked outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <TimePicker isOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('MouseEvent');
    event.initEvent('mousedown', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('closes Clock component when focused outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <TimePicker isOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('FocusEvent');
    event.initEvent('focusin', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('closes Clock component when tapped outside', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const component = mount(
      <TimePicker isOpen />,
      { attachTo: root }
    );

    const event = document.createEvent('TouchEvent');
    event.initEvent('touchstart', true, true);
    document.body.dispatchEvent(event);
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('does not close Clock component when focused inside', () => {
    const component = mount(
      <TimePicker isOpen />
    );

    const customInputs = component.find('input[type="number"]');
    const hourInput = customInputs.at(0);
    const minuteInput = customInputs.at(1);

    hourInput.simulate('blur');
    minuteInput.simulate('focus');
    component.update();

    expect(component.state('isOpen')).toBe(true);
  });

  it('closes Clock when calling internal onChange', () => {
    const component = mount(
      <TimePicker isOpen />
    );

    const { onChange } = component.instance();

    onChange(new Date());

    expect(component.state('isOpen')).toBe(false);
  });

  it('does not close Clock when calling internal onChange with closeClock = false', () => {
    const component = mount(
      <TimePicker isOpen />
    );

    const { onChange } = component.instance();

    onChange(new Date(), false);

    expect(component.state('isOpen')).toBe(true);
  });

  it('calls onChange callback when calling internal onChange', () => {
    const nextValue = '22:41:28';
    const onChange = jest.fn();

    const component = mount(
      <TimePicker onChange={onChange} />
    );

    const { onChange: onChangeInternal } = component.instance();

    onChangeInternal(nextValue);

    expect(onChange).toHaveBeenCalledWith(nextValue);
  });

  it('clears the value when clicking on a button', () => {
    const onChange = jest.fn();

    const component = mount(
      <TimePicker onChange={onChange} />
    );

    const calendar = component.find('Calendar');
    const button = component.find('button.react-time-picker__clear-button');

    expect(calendar).toHaveLength(0);

    button.simulate('click');
    component.update();

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
