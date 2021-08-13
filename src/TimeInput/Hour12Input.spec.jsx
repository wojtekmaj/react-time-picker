import React from 'react';
import { mount } from 'enzyme';

import Hour12Input from './Hour12Input';

describe('Hour12Input', () => {
  const defaultProps = {
    amPm: 'am',
    className: '',
    onChange: () => {},
  };

  it('renders an input', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input).toHaveLength(1);
  });

  it('applies given aria-label properly', () => {
    const hourAriaLabel = 'Hour';

    const component = mount(
      <Hour12Input
        {...defaultProps}
        ariaLabel={hourAriaLabel}
      />,
    );

    const input = component.find('input');

    expect(input.prop('aria-label')).toBe(hourAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const hourPlaceholder = 'hh';

    const component = mount(
      <Hour12Input
        {...defaultProps}
        placeholder={hourPlaceholder}
      />,
    );

    const input = component.find('input');

    expect(input.prop('placeholder')).toBe(hourPlaceholder);
  });

  it('renders "0" given showLeadingZeros if hour is <10', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        showLeadingZeros
        value="9"
      />,
    );

    const input = component.find('input');

    expect(component.text()).toContain('0');
    expect(input.prop('className')).toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if hour is >=10', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        showLeadingZeros
        value="10"
      />,
    );

    const input = component.find('input');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" if not given showLeadingZeros', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        value="9"
      />,
    );

    const input = component.find('input');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('has proper name defined', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input.prop('name')).toBe('hour12');
  });

  it('has proper className defined', () => {
    const className = 'react-time-picker';

    const component = mount(
      <Hour12Input
        {...defaultProps}
        className={className}
      />,
    );

    const input = component.find('input');

    expect(input.hasClass('react-time-picker__input')).toBe(true);
    expect(input.hasClass('react-time-picker__hour')).toBe(true);
  });

  it('displays given value properly (am)', () => {
    const value = '11';

    const component = mount(
      <Hour12Input
        {...defaultProps}
        value={value}
      />,
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe(value);
  });

  it('displays given value properly (pm)', () => {
    const value = '22';

    const component = mount(
      <Hour12Input
        {...defaultProps}
        value={value}
      />,
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe(`${value - 12}`);
  });

  it('does not disable input by default', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeFalsy();
  });

  it('disables input given disabled flag', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        disabled
      />,
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeTruthy();
  });

  it('is not required input by default', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeFalsy();
  });

  it('required input given required flag', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        required
      />,
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeTruthy();
  });

  it('calls inputRef properly', () => {
    const inputRef = jest.fn();

    mount(
      <Hour12Input
        {...defaultProps}
        inputRef={inputRef}
      />,
    );

    expect(inputRef).toHaveBeenCalled();
    expect(inputRef).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('has min = 1 by default', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = (hour in minTime) given am minTime when amPm is am', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="am"
        minTime="5:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(5);
  });

  it('has min = (hour in minTime) given pm minTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="pm"
        minTime="17:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(5);
  });

  it('has min = 1 given am minTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="pm"
        minTime="5:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = 1 given pm minTime when amPm is am', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="am"
        minTime="17:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = 1 given 12 am minTime when amPm is am', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="am"
        minTime="00:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = 1 given 12 pm minTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="pm"
        minTime="12:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has max = 12 by default', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />,
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(12);
  });

  it('has max = (hour in maxTime) given am maxTime when amPm is am', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="am"
        maxTime="5:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(5);
  });

  it('has max = (hour in maxTime) given pm maxTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="pm"
        maxTime="17:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(5);
  });

  it('has max = 12 given am maxTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="pm"
        maxTime="5:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(12);
  });

  it('has max = 12 given pm maxTime when amPm is am', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="am"
        maxTime="17:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(12);
  });

  it('has max = 12 given 12 pm minTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        amPm="pm"
        maxTime="12:35"
      />,
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(12);
  });
});
