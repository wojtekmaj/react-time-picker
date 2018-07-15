import React from 'react';
import { shallow } from 'enzyme';

import AmPm from '../AmPm';

/* eslint-disable comma-dangle */

describe('AmPm', () => {
  const defaultProps = {
    className: '',
    onChange: () => {},
  };

  it('renders a select', () => {
    const component = shallow(
      <AmPm {...defaultProps} />
    );

    const select = component.find('select');
    const options = select.find('option');

    expect(select).toHaveLength(1);
    expect(options).toHaveLength(3);
  });

  it('displays given value properly', () => {
    const value = 'pm';

    const component = shallow(
      <AmPm
        {...defaultProps}
        value={value}
      />
    );

    const select = component.find('select');

    expect(select.prop('value')).toBe(value);
  });

  it('should not disable anything by default', () => {
    const component = shallow(
      <AmPm {...defaultProps} />
    );

    const select = component.find('select');
    const optionAm = select.find('option[value="am"]');
    const optionPm = select.find('option[value="pm"]');

    expect(optionAm.prop('disabled')).toBeFalsy();
    expect(optionPm.prop('disabled')).toBeFalsy();
  });

  it('should disable "pm" given maxTime before 12:00 pm', () => {
    const component = shallow(
      <AmPm
        {...defaultProps}
        maxTime="11:59"
      />
    );

    const select = component.find('select');
    const optionPm = select.find('option[value="pm"]');

    expect(optionPm.prop('disabled')).toBeTruthy();
  });

  it('should not disable "pm" given maxTime after or equal to 12:00 pm', () => {
    const component = shallow(
      <AmPm
        {...defaultProps}
        maxTime="12:00"
      />
    );

    const select = component.find('select');
    const optionPm = select.find('option[value="pm"]');

    expect(optionPm.prop('disabled')).toBeFalsy();
  });

  it('should disable "am" given minTime after or equal to 12:00 pm', () => {
    const component = shallow(
      <AmPm
        {...defaultProps}
        minTime="12:00"
      />
    );

    const select = component.find('select');
    const optionAm = select.find('option[value="am"]');

    expect(optionAm.prop('disabled')).toBeTruthy();
  });

  it('should not disable "am" given minTime before 12:00 pm', () => {
    const component = shallow(
      <AmPm
        {...defaultProps}
        minTime="11:59"
      />
    );

    const select = component.find('select');
    const optionAm = select.find('option[value="pm"]');

    expect(optionAm.prop('disabled')).toBeFalsy();
  });
});
