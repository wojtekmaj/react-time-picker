import React from 'react';
import { mount } from 'enzyme';

import Hour24Input from '../Hour24Input';

/* eslint-disable comma-dangle */

describe('Hour24Input', () => {
  const defaultProps = {
    className: '',
    onChange: () => {},
  };

  it('renders an input', () => {
    const component = mount(
      <Hour24Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input).toHaveLength(1);
  });

  it('applies given aria-label properly', () => {
    const hourAriaLabel = 'Hour';

    const component = mount(
      <Hour24Input
        {...defaultProps}
        ariaLabel={hourAriaLabel}
      />
    );

    const input = component.find('input');

    expect(input.prop('aria-label')).toBe(hourAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const hourPlaceholder = 'Hour';

    const component = mount(
      <Hour24Input
        {...defaultProps}
        placeholder={hourPlaceholder}
      />
    );

    const input = component.find('input');

    expect(input.prop('placeholder')).toBe(hourPlaceholder);
  });

  it('has proper name defined', () => {
    const component = mount(
      <Hour24Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('name')).toBe('hour24');
  });

  it('has proper className defined', () => {
    const className = 'react-time-picker';

    const component = mount(
      <Hour24Input
        {...defaultProps}
        className={className}
      />
    );

    const input = component.find('input');

    expect(input.hasClass('react-time-picker__input')).toBe(true);
    expect(input.hasClass('react-time-picker__hour')).toBe(true);
  });

  it('displays given value properly', () => {
    const value = 11;

    const component = mount(
      <Hour24Input
        {...defaultProps}
        value={value}
      />
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe(value);
  });

  it('does not disable input by default', () => {
    const component = mount(
      <Hour24Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeFalsy();
  });

  it('disables input given disabled flag', () => {
    const component = mount(
      <Hour24Input
        {...defaultProps}
        disabled
      />
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeTruthy();
  });

  it('is not required input by default', () => {
    const component = mount(
      <Hour24Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeFalsy();
  });

  it('required input given required flag', () => {
    const component = mount(
      <Hour24Input
        {...defaultProps}
        required
      />
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeTruthy();
  });

  it('calls itemRef properly', () => {
    const itemRef = jest.fn();

    mount(
      <Hour24Input
        {...defaultProps}
        itemRef={itemRef}
      />
    );

    expect(itemRef).toHaveBeenCalled();
    expect(itemRef).toHaveBeenCalledWith(expect.any(HTMLInputElement), 'hour24');
  });

  it('has min = 0 by default', () => {
    const component = mount(
      <Hour24Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(0);
  });

  it('has min = (hour in minTime) given minTime', () => {
    const component = mount(
      <Hour24Input
        {...defaultProps}
        minTime="17:35"
      />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(17);
  });

  it('has max = 23 by default', () => {
    const component = mount(
      <Hour24Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(23);
  });

  it('has max = (hour in maxTime) given maxTime', () => {
    const component = mount(
      <Hour24Input
        {...defaultProps}
        maxTime="17:35"
      />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(17);
  });
});
