import React from 'react';
import { shallow } from 'enzyme';

import NativeInput from './NativeInput';

describe('NativeInput', () => {
  const defaultProps = {
    onChange: () => {},
    valueType: 'second',
  };

  it('renders an input', () => {
    const component = shallow(<NativeInput {...defaultProps} />);

    const input = component.find('input');

    expect(input).toHaveLength(1);
  });

  it('applies given aria-label properly', () => {
    const nativeInputAriaLabel = 'Time';

    const component = shallow(<NativeInput {...defaultProps} ariaLabel={nativeInputAriaLabel} />);

    const select = component.find('input');

    expect(select.prop('aria-label')).toBe(nativeInputAriaLabel);
  });

  it('has proper name defined', () => {
    const name = 'testName';

    const component = shallow(<NativeInput {...defaultProps} name={name} />);

    const input = component.find('input');

    expect(input.prop('name')).toBe(name);
  });

  it.each`
    valueType   | parsedValue
    ${'second'} | ${'22:17:41'}
    ${'minute'} | ${'22:17'}
    ${'hour'}   | ${'22:00'}
  `('displays given value properly if valueType is $valueType', ({ valueType, parsedValue }) => {
    const value = '22:17:41';

    const component = shallow(
      <NativeInput {...defaultProps} value={value} valueType={valueType} />,
    );

    const input = component.find('input');

    expect(input.prop('value').toString()).toBe(parsedValue);
  });
  /* eslint-enable indent */

  it('does not disable input by default', () => {
    const component = shallow(<NativeInput {...defaultProps} />);

    const input = component.find('input');

    expect(input.prop('disabled')).toBeFalsy();
  });

  it('disables input given disabled flag', () => {
    const component = shallow(<NativeInput {...defaultProps} disabled />);

    const input = component.find('input');

    expect(input.prop('disabled')).toBeTruthy();
  });

  it('is not required input by default', () => {
    const component = shallow(<NativeInput {...defaultProps} />);

    const input = component.find('input');

    expect(input.prop('required')).toBeFalsy();
  });

  it('required input given required flag', () => {
    const component = shallow(<NativeInput {...defaultProps} required />);

    const input = component.find('input');

    expect(input.prop('required')).toBeTruthy();
  });

  it('has no min by default', () => {
    const component = shallow(<NativeInput {...defaultProps} />);

    const input = component.find('input');

    expect(input.prop('min')).toBeFalsy();
  });

  it.each`
    valueType   | parsedMin
    ${'second'} | ${'22:00:00'}
    ${'minute'} | ${'22:00'}
    ${'hour'}   | ${'22:00'}
  `(
    'has proper min for minTime which is a full hour if valueType is $valueType',
    ({ valueType, parsedMin }) => {
      const component = shallow(
        <NativeInput {...defaultProps} minTime="22:00:00" valueType={valueType} />,
      );

      const input = component.find('input');

      expect(input.prop('min').toString()).toBe(parsedMin);
    },
  );

  it.each`
    valueType   | parsedMin
    ${'second'} | ${'22:17:41'}
    ${'minute'} | ${'22:17'}
    ${'hour'}   | ${'22:00'}
  `(
    'has proper min for minTime which is not a full hour if valueType is $valueType',
    ({ valueType, parsedMin }) => {
      const component = shallow(
        <NativeInput {...defaultProps} minTime="22:17:41" valueType={valueType} />,
      );

      const input = component.find('input');

      expect(input.prop('min').toString()).toBe(parsedMin);
    },
  );

  it('has no max by default', () => {
    const component = shallow(<NativeInput {...defaultProps} />);

    const input = component.find('input');

    expect(input.prop('max')).toBeFalsy();
  });

  it.each`
    valueType   | parsedMax
    ${'second'} | ${'22:00:00'}
    ${'minute'} | ${'22:00'}
    ${'hour'}   | ${'22:00'}
  `(
    'has proper max for maxTime which is a full hour if valueType is $valueType',
    ({ valueType, parsedMax }) => {
      const component = shallow(
        <NativeInput {...defaultProps} maxTime="22:00:00" valueType={valueType} />,
      );

      const input = component.find('input');

      expect(input.prop('max').toString()).toBe(parsedMax);
    },
  );

  it.each`
    valueType   | parsedMax
    ${'second'} | ${'22:17:41'}
    ${'minute'} | ${'22:17'}
    ${'hour'}   | ${'22:00'}
  `(
    'has proper max for maxTime which is not a full hour if valueType is $valueType',
    ({ valueType, parsedMax }) => {
      const component = shallow(
        <NativeInput {...defaultProps} maxTime="22:17:41" valueType={valueType} />,
      );

      const input = component.find('input');

      expect(input.prop('max').toString()).toBe(parsedMax);
    },
  );
});
