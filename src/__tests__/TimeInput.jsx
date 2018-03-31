import React from 'react';
import { mount } from 'enzyme';

import TimeInput from '../TimeInput';

/* eslint-disable comma-dangle */

const keyCodes = {
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,
  '-': 189,
  '.': 190,
  '/': 191,
};

const getKey = key => ({
  keyCode: keyCodes[key],
  which: keyCodes[key],
  key,
});

describe('TimeInput', () => {
  it('renders a native input and custom inputs', () => {
    const component = mount(
      <TimeInput />
    );

    const nativeInput = component.find('input[type="time"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput).toHaveLength(1);
    expect(customInputs).toHaveLength(2);
  });

  it('does not render second input when maxDetail is "minute" or less', () => {
    const component = mount(
      <TimeInput maxDetail="minute" />
    );

    const customInputs = component.find('input[type="number"]');
    const secondInput = customInputs.find('input[name="second"]');
    const minuteInput = customInputs.find('input[name="minute"]');
    const hourInput = customInputs.find('input[name="hour"]');

    expect(customInputs).toHaveLength(2);
    expect(secondInput).toHaveLength(0);
    expect(minuteInput).toHaveLength(1);
    expect(hourInput).toHaveLength(1);
  });

  it('does not render second and minute inputs when maxDetail is "hour" or less', () => {
    const component = mount(
      <TimeInput maxDetail="hour" />
    );

    const customInputs = component.find('input[type="number"]');
    const secondInput = customInputs.find('input[name="second"]');
    const minuteInput = customInputs.find('input[name="minute"]');
    const hourInput = customInputs.find('input[name="hour"]');

    expect(customInputs).toHaveLength(1);
    expect(secondInput).toHaveLength(0);
    expect(minuteInput).toHaveLength(0);
    expect(hourInput).toHaveLength(1);
  });

  it('shows a given time in all inputs correctly', () => {
    const date = '22:17:00';

    const component = mount(
      <TimeInput
        maxDetail="second"
        value={date}
      />
    );

    const nativeInput = component.find('input[type="time"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.getDOMNode().value).toBe(date);
    expect(customInputs.at(0).getDOMNode().value).toBe('22');
    expect(customInputs.at(1).getDOMNode().value).toBe('17');
    expect(customInputs.at(2).getDOMNode().value).toBe('0');
  });

  it('clears the value correctly', () => {
    const date = '22:17:00';

    const component = mount(
      <TimeInput
        maxDetail="second"
        value={date}
      />
    );

    component.setProps({ value: null });

    const nativeInput = component.find('input[type="time"]');
    const customInputs = component.find('input[type="number"]');

    expect(nativeInput.getDOMNode().value).toBe('');
    expect(customInputs.at(0).getDOMNode().value).toBe('');
    expect(customInputs.at(1).getDOMNode().value).toBe('');
    expect(customInputs.at(2).getDOMNode().value).toBe('');
  });

  it('renders custom inputs in a proper order', () => {
    const component = mount(
      <TimeInput maxDetail="second" />
    );

    const customInputs = component.find('input[type="number"]');

    expect(customInputs.at(0).prop('name')).toBe('hour');
    expect(customInputs.at(1).prop('name')).toBe('minute');
    expect(customInputs.at(2).prop('name')).toBe('second');
  });

  it('renders proper input separators', () => {
    const component = mount(
      <TimeInput maxDetail="second" />
    );

    const separators = component.find('.react-time-picker__button__input__divider');

    expect(separators).toHaveLength(2);
    expect(separators.at(0).text()).toBe(':');
  });

  it('renders proper amount of separators', () => {
    const component = mount(
      <TimeInput />
    );

    const separators = component.find('.react-time-picker__button__input__divider');
    const customInputs = component.find('input[type="number"]');

    expect(separators).toHaveLength(customInputs.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', () => {
    const component = mount(
      <TimeInput maxDetail="second" />
    );

    const customInputs = component.find('input[type="number"]');
    const hourInput = customInputs.at(0);
    const minuteInput = customInputs.at(1);

    hourInput.getDOMNode().focus();

    expect(document.activeElement).toBe(hourInput.getDOMNode());

    hourInput.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(minuteInput.getDOMNode());
  });

  it('jumps to the next field when separator key is pressed', () => {
    const component = mount(
      <TimeInput maxDetail="second" />
    );

    const customInputs = component.find('input[type="number"]');
    const hourInput = customInputs.at(0);
    const minuteInput = customInputs.at(1);

    hourInput.getDOMNode().focus();

    expect(document.activeElement).toBe(hourInput.getDOMNode());

    const separators = component.find('.react-time-picker__button__input__divider');
    const separatorKey = separators.at(0).text();
    hourInput.simulate('keydown', getKey(separatorKey));

    expect(document.activeElement).toBe(minuteInput.getDOMNode());
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const component = mount(
      <TimeInput maxDetail="second" />
    );

    const customInputs = component.find('input[type="number"]');
    const secondInput = customInputs.at(2);

    secondInput.getDOMNode().focus();

    expect(document.activeElement).toBe(secondInput.getDOMNode());

    secondInput.simulate('keydown', getKey('ArrowRight'));

    expect(document.activeElement).toBe(secondInput.getDOMNode());
  });

  it('jumps to the previous field when left arrow is pressed', () => {
    const component = mount(
      <TimeInput maxDetail="second" />
    );

    const customInputs = component.find('input[type="number"]');
    const hourInput = customInputs.at(0);
    const minuteInput = customInputs.at(1);

    minuteInput.getDOMNode().focus();

    expect(document.activeElement).toBe(minuteInput.getDOMNode());

    minuteInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(hourInput.getDOMNode());
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const component = mount(
      <TimeInput maxDetail="second" />
    );

    const customInputs = component.find('input[type="number"]');
    const hourInput = customInputs.at(0);

    hourInput.getDOMNode().focus();

    expect(document.activeElement).toBe(hourInput.getDOMNode());

    hourInput.simulate('keydown', getKey('ArrowLeft'));

    expect(document.activeElement).toBe(hourInput.getDOMNode());
  });
});
