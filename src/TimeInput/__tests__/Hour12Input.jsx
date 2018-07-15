import React from 'react';
import { shallow } from 'enzyme';

import Hour12Input from '../Hour12Input';

/* eslint-disable comma-dangle */

describe('Hour12Input', () => {
  const defaultProps = {
    className: '',
    onChange: () => {},
  };

  it('renders an input', () => {
    const component = shallow(
      <Hour12Input {...defaultProps} />
    );

    const select = component.find('input');

    expect(select).toHaveLength(1);
  });

  it('displays given value properly (am)', () => {
    const value = 11;

    const component = shallow(
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

    const component = shallow(
      <Hour12Input
        {...defaultProps}
        value={value}
      />
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe(value - 12);
  });

  it('allows values between 1 and 12 by default', () => {
    const component = shallow(
      <Hour12Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(1);
    expect(input.prop('max')).toBe(12);
  });
});
