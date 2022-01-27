import React from 'react';
import { mount } from 'enzyme';

import TimeInput from './TimeInput';

import { muteConsole, restoreConsole } from '../test-utils';

const hasFullICU = (() => {
  try {
    const date = new Date(2018, 0, 1, 21);
    const formatter = new Intl.DateTimeFormat('de-DE', { hour: 'numeric' });
    return formatter.format(date) === '21';
  } catch (err) {
    return false;
  }
})();

const itIfFullICU = hasFullICU ? it : it.skip;

const keyCodes = {
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  '-': 189,
  '.': 190,
  '/': 191,
};

const getKey = (key) => ({
  keyCode: keyCodes[key],
  which: keyCodes[key],
  key,
});

describe('TimeInput', () => {
  const defaultProps = {
    className: 'react-time-picker__inputGroup',
  };

  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it('renders a native input and custom inputs', () => {
    const component = mount(<TimeInput {...defaultProps} />);

    const nativeInput = component.find('input[type="time"]');
    const customInputs = component.find('input[data-input]');

    expect(nativeInput).toHaveLength(1);
    expect(customInputs).toHaveLength(2);
  });

  it('does not render second input when maxDetail is "minute" or less', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="minute" />);

    const customInputs = component.find('input[data-input]');
    const secondInput = customInputs.find('input[name="second"]');
    const minuteInput = customInputs.find('input[name="minute"]');
    const hourInput = customInputs.find('input[name^="hour"]');

    expect(customInputs).toHaveLength(2);
    expect(secondInput).toHaveLength(0);
    expect(minuteInput).toHaveLength(1);
    expect(hourInput).toHaveLength(1);
  });

  it('does not render second and minute inputs when maxDetail is "hour" or less', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="hour" />);

    const customInputs = component.find('input[data-input]');
    const secondInput = customInputs.find('input[name="second"]');
    const minuteInput = customInputs.find('input[name="minute"]');
    const hourInput = customInputs.find('input[name^="hour"]');

    expect(customInputs).toHaveLength(1);
    expect(secondInput).toHaveLength(0);
    expect(minuteInput).toHaveLength(0);
    expect(hourInput).toHaveLength(1);
  });

  it('shows a given time in all inputs correctly (12-hour format)', () => {
    const date = '22:17:00';

    const component = mount(<TimeInput {...defaultProps} maxDetail="second" value={date} />);

    const nativeInput = component.find('input[type="time"]');
    const customInputs = component.find('input[data-input]');

    expect(nativeInput.prop('value')).toBe(date);
    expect(customInputs.at(0).prop('value')).toBe('10');
    expect(customInputs.at(1).prop('value')).toBe('17');
    expect(customInputs.at(2).prop('value')).toBe('0');
  });

  itIfFullICU('shows a given time in all inputs correctly (24-hour format)', () => {
    const date = '22:17:00';

    const component = mount(
      <TimeInput {...defaultProps} locale="de-DE" maxDetail="second" value={date} />,
    );

    const nativeInput = component.find('input[type="time"]');
    const customInputs = component.find('input[data-input]');

    expect(nativeInput.prop('value')).toBe(date);
    expect(customInputs.at(0).prop('value')).toBe('22');
    expect(customInputs.at(1).prop('value')).toBe('17');
    expect(customInputs.at(2).prop('value')).toBe('0');
  });

  it('shows empty value in all inputs correctly given null', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" value={null} />);

    const nativeInput = component.find('input[type="time"]');
    const customInputs = component.find('input[data-input]');

    expect(nativeInput.prop('value')).toBeFalsy();
    expect(customInputs.at(0).prop('value')).toBeFalsy();
    expect(customInputs.at(1).prop('value')).toBeFalsy();
    expect(customInputs.at(2).prop('value')).toBeFalsy();
  });

  it('clears the value correctly', () => {
    const date = '22:17:00';

    const component = mount(<TimeInput {...defaultProps} maxDetail="second" value={date} />);

    component.setProps({ value: null });

    const nativeInput = component.find('input[type="time"]');
    const customInputs = component.find('input[data-input]');

    expect(nativeInput.prop('value')).toBeFalsy();
    expect(customInputs.at(0).prop('value')).toBeFalsy();
    expect(customInputs.at(1).prop('value')).toBeFalsy();
    expect(customInputs.at(2).prop('value')).toBeFalsy();
  });

  it('renders custom inputs in a proper order (12-hour format)', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" />);

    const customInputs = component.find('input[data-input]');

    expect(customInputs.at(0).prop('name')).toBe('hour12');
    expect(customInputs.at(1).prop('name')).toBe('minute');
    expect(customInputs.at(2).prop('name')).toBe('second');
  });

  itIfFullICU('renders custom inputs in a proper order (24-hour format)', () => {
    const component = mount(<TimeInput {...defaultProps} locale="de-DE" maxDetail="second" />);

    const customInputs = component.find('input[data-input]');

    expect(customInputs.at(0).prop('name')).toBe('hour24');
    expect(customInputs.at(1).prop('name')).toBe('minute');
    expect(customInputs.at(2).prop('name')).toBe('second');
  });

  it('renders hour input without leading zero by default', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" />);

    const hourInput = component.find('Hour12Input');

    expect(hourInput.prop('showLeadingZeros')).toBeFalsy();
  });

  it('renders minute input with leading zero by default', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" />);

    const minuteInput = component.find('MinuteInput');

    expect(minuteInput.prop('showLeadingZeros')).toBeTruthy();
  });

  it('renders second input with leading zero by default', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" />);

    const secondInput = component.find('SecondInput');

    expect(secondInput.prop('showLeadingZeros')).toBeTruthy();
  });

  describe('renders custom input in a proper order given format', () => {
    it('renders "h" properly', () => {
      const component = mount(<TimeInput {...defaultProps} format="h" />);

      const componentInput = component.find('Hour12Input');
      const customInputs = component.find('input[data-input]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "hh" properly', () => {
      const component = mount(<TimeInput {...defaultProps} format="hh" />);

      const componentInput = component.find('Hour12Input');
      const customInputs = component.find('input[data-input]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "hhh"', () => {
      muteConsole();

      const renderComponent = () => mount(<TimeInput {...defaultProps} format="hhh" />);

      expect(renderComponent).toThrow('Unsupported token: hhh');

      restoreConsole();
    });

    it('renders "H" properly', () => {
      const component = mount(<TimeInput {...defaultProps} format="H" />);

      const componentInput = component.find('Hour24Input');
      const customInputs = component.find('input[data-input]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "HH" properly', () => {
      const component = mount(<TimeInput {...defaultProps} format="HH" />);

      const componentInput = component.find('Hour24Input');
      const customInputs = component.find('input[data-input]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "HHH"', () => {
      muteConsole();

      const renderComponent = () => mount(<TimeInput {...defaultProps} format="HHH" />);

      expect(renderComponent).toThrow('Unsupported token: HHH');

      restoreConsole();
    });

    it('renders "m" properly', () => {
      const component = mount(<TimeInput {...defaultProps} format="m" />);

      const componentInput = component.find('MinuteInput');
      const customInputs = component.find('input[data-input]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "mm" properly', () => {
      const component = mount(<TimeInput {...defaultProps} format="mm" />);

      const componentInput = component.find('MinuteInput');
      const customInputs = component.find('input[data-input]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "mmm"', () => {
      muteConsole();

      const renderComponent = () => mount(<TimeInput {...defaultProps} format="mmm" />);

      expect(renderComponent).toThrow('Unsupported token: mmm');

      restoreConsole();
    });

    it('renders "s" properly', () => {
      const component = mount(<TimeInput {...defaultProps} format="s" />);

      const componentInput = component.find('SecondInput');
      const customInputs = component.find('input[data-input]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
    });

    it('renders "ss" properly', () => {
      const component = mount(<TimeInput {...defaultProps} format="ss" />);

      const componentInput = component.find('SecondInput');
      const customInputs = component.find('input[data-input]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(1);
      expect(componentInput.prop('showLeadingZeros')).toBeTruthy();
    });

    it('throws error for "sss"', () => {
      muteConsole();

      const renderComponent = () => mount(<TimeInput {...defaultProps} format="sss" />);

      expect(renderComponent).toThrow('Unsupported token: sss');

      restoreConsole();
    });

    it('renders "a" properly', () => {
      const component = mount(<TimeInput {...defaultProps} format="a" />);

      const componentInput = component.find('AmPm');
      const customInputs = component.find('input[data-input]');

      expect(componentInput).toHaveLength(1);
      expect(customInputs).toHaveLength(0);
    });
  });

  it('renders proper input separators', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" />);

    const separators = component.find('.react-time-picker__inputGroup__divider');

    expect(separators).toHaveLength(3);
    expect(separators.at(0).text()).toBe(':');
    expect(separators.at(1).text()).toBe(':');
    expect(separators.at(2).text()).toBe(' ');
  });

  it('renders proper amount of separators', () => {
    const component = mount(<TimeInput {...defaultProps} />);

    const separators = component.find('.react-time-picker__inputGroup__divider');
    const customInputs = component.find('input[data-input]');
    const ampm = component.find('select');

    expect(separators).toHaveLength(customInputs.length + ampm.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" />, {
      attachTo: container,
    });

    const customInputs = component.find('input[data-input]');
    const hourInput = customInputs.at(0);
    const minuteInput = customInputs.at(1);

    hourInput.getDOMNode().focus();

    expect(document.activeElement).toBe(hourInput.getDOMNode());

    hourInput.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(minuteInput.getDOMNode());
  });

  it('jumps to the next field when separator key is pressed', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" />, {
      attachTo: container,
    });

    const customInputs = component.find('input[data-input]');
    const hourInput = customInputs.at(0);
    const minuteInput = customInputs.at(1);

    hourInput.getDOMNode().focus();

    expect(document.activeElement).toBe(hourInput.getDOMNode());

    const separators = component.find('.react-time-picker__inputGroup__divider');
    const separatorKey = separators.at(0).text();
    hourInput.simulate('keydown', getKey(separatorKey));

    expect(document.activeElement).toBe(minuteInput.getDOMNode());
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" />, {
      attachTo: container,
    });

    const select = component.find('select');

    select.getDOMNode().focus();

    expect(document.activeElement).toBe(select.getDOMNode());

    select.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(select.getDOMNode());
  });

  it('jumps to the previous field when left arrow is pressed', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" />, {
      attachTo: container,
    });

    const customInputs = component.find('input[data-input]');
    const hourInput = customInputs.at(0);
    const minuteInput = customInputs.at(1);

    minuteInput.getDOMNode().focus();

    expect(document.activeElement).toBe(minuteInput.getDOMNode());

    minuteInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(hourInput.getDOMNode());
  });

  it('does not jump to the previous field when left arrow is pressed when the first input is focused', () => {
    const component = mount(<TimeInput {...defaultProps} maxDetail="second" />, {
      attachTo: container,
    });

    const customInputs = component.find('input[data-input]');
    const hourInput = customInputs.at(0);

    hourInput.getDOMNode().focus();

    expect(document.activeElement).toBe(hourInput.getDOMNode());

    hourInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(hourInput.getDOMNode());
  });

  it("jumps to the next field when a value which can't be extended to another valid value is entered", () => {
    const component = mount(<TimeInput {...defaultProps} />, { attachTo: container });

    const customInputs = component.find('input[data-input]');
    const hourInput = customInputs.at(0);
    const minuteInput = customInputs.at(1);

    hourInput.getDOMNode().focus();
    hourInput.getDOMNode().value = '4';

    hourInput.simulate('keyup', { target: hourInput.getDOMNode(), key: '4' });

    expect(document.activeElement).toBe(minuteInput.getDOMNode());
  });

  it('jumps to the next field when a value as long as the length of maximum value is entered', () => {
    const component = mount(<TimeInput {...defaultProps} />, { attachTo: container });

    const customInputs = component.find('input[data-input]');
    const hourInput = customInputs.at(0);
    const minuteInput = customInputs.at(1);

    hourInput.getDOMNode().focus();
    hourInput.getDOMNode().value = '02';

    hourInput.simulate('keyup', { target: hourInput.getDOMNode(), key: '2' });

    expect(document.activeElement).toBe(minuteInput.getDOMNode());
  });

  it('does not jump the next field when a value which can be extended to another valid value is entered', () => {
    const component = mount(<TimeInput {...defaultProps} />, { attachTo: container });

    const customInputs = component.find('input[data-input]');
    const hourInput = customInputs.at(0);

    hourInput.getDOMNode().focus();
    hourInput.getDOMNode().value = '1';

    hourInput.simulate('keyup', { target: hourInput.getDOMNode(), key: '1' });

    expect(document.activeElement).toBe(hourInput.getDOMNode());
  });

  it('triggers onChange correctly when changed custom input', () => {
    const onChange = jest.fn();
    const date = '22:17:00';

    const component = mount(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const customInputs = component.find('input[data-input]');

    customInputs.at(0).getDOMNode().value = '20';
    customInputs.at(0).simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('20:17:00', false);
  });

  it.only('triggers onChange correctly when cleared custom inputs', () => {
    const onChange = jest.fn();
    const date = '22:17:00';

    const component = mount(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const customInputs = component.find('input[data-input]');

    customInputs.forEach((customInput) => {
      customInput.getDOMNode().value = '';
      customInput.simulate('change');
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null, false);
  });

  it('triggers onChange correctly when changed native input', () => {
    const onChange = jest.fn();
    const date = '22:17:00';

    const component = mount(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const nativeInput = component.find('input[type="time"]');

    nativeInput.getDOMNode().value = '20:17:00';
    nativeInput.simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('20:17:00', false);
  });

  it('triggers onChange correctly when cleared native input', () => {
    const onChange = jest.fn();
    const date = '22:17:00';

    const component = mount(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const nativeInput = component.find('input[type="time"]');

    nativeInput.getDOMNode().value = '';
    nativeInput.simulate('change');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null, false);
  });
});
