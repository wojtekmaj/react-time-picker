import React from 'react';
import { mount } from 'enzyme';

import Hour12Input from '../Hour12Input';

/* eslint-disable comma-dangle */

describe('Hour12Input', () => {
  const defaultProps = {
    className: '',
    onChange: () => {},
  };

  it('renders an input', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input).toHaveLength(1);
  });

  it('has proper name defined', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('name')).toBe('hour12');
  });

  it('displays given value properly (am)', () => {
    const value = 11;

    const component = mount(
      <Hour12Input
        {...defaultProps}
        value={value}
      />
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe(value);
  });

  it('displays given value properly (pm)', () => {
    const value = 22;

    const component = mount(
      <Hour12Input
        {...defaultProps}
        value={value}
      />
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe(value - 12);
  });

  it('does not disable input by default', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeFalsy();
  });

  it('disables input given disabled flag', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        disabled
      />
    );

    const input = component.find('input');

    expect(input.prop('disabled')).toBeTruthy();
  });

  it('is not required input by default', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('required')).toBeFalsy();
  });

  it('required input given required flag', () => {
    const component = mount(
      <Hour12Input
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
      <Hour12Input
        {...defaultProps}
        itemRef={itemRef}
      />
    );

    expect(itemRef).toHaveBeenCalled();
    expect(itemRef).toHaveBeenCalledWith(expect.any(HTMLInputElement), 'hour12');
  });

  it('allows values between 1 and 12 by default', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
    expect(input.prop('max')).toBe(12);
  });
});
