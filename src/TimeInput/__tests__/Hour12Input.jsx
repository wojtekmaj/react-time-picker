import React from 'react';
import { mount } from 'enzyme';

import Hour12Input from '../Hour12Input';

/* eslint-disable comma-dangle */

describe('Hour12Input', () => {
  const defaultProps = {
    amPm: 'am',
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

  it('has min = 1 by default', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = (hour in minTime) given am minTime when amPm is am', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        minTime="5:35"
        amPm="am"
      />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(5);
  });

  it('has min = (hour in minTime) given pm minTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        minTime="17:35"
        amPm="pm"
      />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(5);
  });

  it('has min = 1 given am minTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        minTime="5:35"
        amPm="pm"
      />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = 1 given pm minTime when amPm is am', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        minTime="17:35"
        amPm="am"
      />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = 1 given 12 am minTime when amPm is am', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        minTime="00:35"
        amPm="am"
      />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has min = 1 given 12 pm minTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        minTime="12:35"
        amPm="pm"
      />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
  });

  it('has max = 12 by default', () => {
    const component = mount(
      <Hour12Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(12);
  });

  it('has max = (hour in maxTime) given am maxTime when amPm is am', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        maxTime="5:35"
        amPm="am"
      />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(5);
  });

  it('has max = (hour in maxTime) given pm maxTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        maxTime="17:35"
        amPm="pm"
      />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(5);
  });

  it('has max = 12 given am maxTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        maxTime="5:35"
        amPm="pm"
      />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(12);
  });

  it('has max = 12 given pm maxTime when amPm is am', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        maxTime="17:35"
        amPm="am"
      />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(12);
  });

  it('has max = 12 given 12 pm minTime when amPm is pm', () => {
    const component = mount(
      <Hour12Input
        {...defaultProps}
        maxTime="12:35"
        amPm="pm"
      />
    );

    const input = component.find('input');

    expect(input.prop('max')).toBe(12);
  });
});
