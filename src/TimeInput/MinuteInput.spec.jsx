import React from 'react';
import { mount } from 'enzyme';

import MinuteInput from './MinuteInput';

describe('MinuteInput', () => {
  const defaultProps = {
    className: 'className',
    onChange: () => {},
  };

  it('renders an input', () => {
    const component = mount(<MinuteInput {...defaultProps} />);

    const input = component.find('input');

    expect(input).toHaveLength(1);
  });

  it('applies given aria-label properly', () => {
    const minuteAriaLabel = 'Minute';

    const component = mount(<MinuteInput {...defaultProps} ariaLabel={minuteAriaLabel} />);

    const input = component.find('input');

    expect(input.prop('aria-label')).toBe(minuteAriaLabel);
  });

  it('applies given placeholder properly', () => {
    const minutePlaceholder = 'mm';

    const component = mount(<MinuteInput {...defaultProps} placeholder={minutePlaceholder} />);

    const input = component.find('input');

    expect(input.prop('placeholder')).toBe(minutePlaceholder);
  });

  it('renders "0" if minute is <10', () => {
    const component = mount(<MinuteInput {...defaultProps} value="9" />);

    const input = component.find('input');

    expect(component.text()).toContain('0');
    expect(input.prop('className')).toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('renders "0" given showLeadingZeros if minute is 0', () => {
    const component = mount(<MinuteInput {...defaultProps} showLeadingZeros value="0" />);

    const input = component.find('input');

    expect(component.text()).toContain('0');
    expect(input.prop('className')).toContain(`${defaultProps.className}__input--hasLeadingZero`);
  });

  it('does not render "0" given showLeadingZeros if minute is <10 with leading zero already', () => {
    const component = mount(<MinuteInput {...defaultProps} showLeadingZeros value="09" />);

    const input = component.find('input');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(
      `${defaultProps.className}__input--hasLeadingZero`,
    );
  });

  it('does not render "0" if minute is >=10', () => {
    const component = mount(<MinuteInput {...defaultProps} value="10" />);

    const input = component.find('input');

    expect(component.text()).not.toContain('0');
    expect(input.prop('className')).not.toContain(
      `${defaultProps.className}__input--hasLeadingZero`,
    );
  });

  it('has proper name defined', () => {
    const component = mount(<MinuteInput {...defaultProps} />);

    const input = component.find('input');

    expect(input.prop('name')).toBe('minute');
  });

  it('has proper className defined', () => {
    const className = 'react-time-picker';

    const component = mount(<MinuteInput {...defaultProps} className={className} />);

    const input = component.find('input');

    expect(input.hasClass('react-time-picker__input')).toBe(true);
    expect(input.hasClass('react-time-picker__minute')).toBe(true);
  });

  it('displays given value properly', () => {
    const value = '11';

    const component = mount(<MinuteInput {...defaultProps} value={value} />);

    const input = component.find('input');

    expect(input.prop('value')).toBe(value);
  });

  it('does not disable input by default', () => {
    const component = mount(<MinuteInput {...defaultProps} />);

    const input = component.find('input');

    expect(input.prop('disabled')).toBeFalsy();
  });

  it('disables input given disabled flag', () => {
    const component = mount(<MinuteInput {...defaultProps} disabled />);

    const input = component.find('input');

    expect(input.prop('disabled')).toBeTruthy();
  });

  it('is not required input by default', () => {
    const component = mount(<MinuteInput {...defaultProps} />);

    const input = component.find('input');

    expect(input.prop('required')).toBeFalsy();
  });

  it('required input given required flag', () => {
    const component = mount(<MinuteInput {...defaultProps} required />);

    const input = component.find('input');

    expect(input.prop('required')).toBeTruthy();
  });

  it('calls inputRef properly', () => {
    const inputRef = jest.fn();

    mount(<MinuteInput {...defaultProps} inputRef={inputRef} />);

    expect(inputRef).toHaveBeenCalled();
    expect(inputRef).toHaveBeenCalledWith(expect.any(HTMLInputElement));
  });

  it('has min = 0 by default', () => {
    const component = mount(<MinuteInput {...defaultProps} />);

    const input = component.find('input');

    expect(input.prop('min')).toBe(0);
  });

  it('has min = 0 given minTime in a past hour', () => {
    const component = mount(<MinuteInput {...defaultProps} hour="22" minTime="21:40" />);

    const input = component.find('input');

    expect(input.prop('min')).toBe(0);
  });

  it('has min = (minute in minTime) given minTime in a current hour', () => {
    const component = mount(<MinuteInput {...defaultProps} hour="22" minTime="22:40" />);

    const input = component.find('input');

    expect(input.prop('min')).toBe(40);
  });

  it('has max = 59 by default', () => {
    const component = mount(<MinuteInput {...defaultProps} />);

    const input = component.find('input');

    expect(input.prop('max')).toBe(59);
  });

  it('has max = 59 given maxTime in a future hour', () => {
    const component = mount(<MinuteInput {...defaultProps} hour="22" maxTime="23:40" />);

    const input = component.find('input');

    expect(input.prop('max')).toBe(59);
  });

  it('has max = (minute in maxHour) given maxTime in a current hour', () => {
    const component = mount(<MinuteInput {...defaultProps} hour="22" maxTime="22:40" />);

    const input = component.find('input');

    expect(input.prop('max')).toBe(40);
  });
});
