import React from 'react';
import { shallow } from 'enzyme';

import Hour24Input from '../Hour24Input';

/* eslint-disable comma-dangle */

describe('Hour24Input', () => {
  const defaultProps = {
    className: '',
    onChange: () => {},
  };

  it('renders an input', () => {
    const component = shallow(
      <Hour24Input {...defaultProps} />
    );

    const select = component.find('input');

    expect(select).toHaveLength(1);
  });

  it('displays given value properly', () => {
    const value = 11;

    const component = shallow(
      <Hour24Input
        {...defaultProps}
        value={value}
      />
    );

    const input = component.find('input');

    expect(input.prop('value')).toBe(value);
  });

  it('allows values between 0 and 23 by default', () => {
    const component = shallow(
      <Hour24Input {...defaultProps} />
    );

    const input = component.find('input');

    expect(input.prop('min')).toBe(0);
    expect(input.prop('max')).toBe(23);
  });
});
