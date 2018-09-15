import React from 'react';
import { mount } from 'enzyme';

import TimePicker from '../TimePicker';

/* eslint-disable comma-dangle */

const mockDocumentListeners = () => {
  const eventMap = {};
  document.addEventListener = jest.fn((method, cb) => {
    if (!eventMap[method]) {
      eventMap[method] = [];
    }
    eventMap[method].push(cb);
  });

  return {
    simulate: (method, args) => {
      eventMap[method].forEach(cb => cb(args));
    },
  };
};

describe('TimePicker', () => {
  it('passes default name to TimeInput', () => {
    const component = mount(
      <TimePicker />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.prop('name')).toBe('time');
  });

  it('passes custom name to TimeInput', () => {
    const name = 'testName';

    const component = mount(
      <TimePicker name={name} />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput.prop('name')).toBe(name);
  });

  it('applies className to its wrapper when given a string', () => {
    const className = 'testClassName';

    const component = mount(
      <TimePicker className={className} />
    );

    const wrapperClassName = component.prop('className');

    expect(wrapperClassName.includes(className)).toBe(true);
  });

  it('applies clockClassName to the clock when given a string', () => {
    const clockClassName = 'testClassName';

    const component = mount(
      <TimePicker
        clockClassName={clockClassName}
        isOpen
      />
    );

    const clock = component.find('Clock');
    const clockWrapperClassName = clock.prop('className');

    expect(clockWrapperClassName.includes(clockClassName)).toBe(true);
  });

  it('renders TimeInput component', () => {
    const component = mount(
      <TimePicker />
    );

    const timeInput = component.find('TimeInput');

    expect(timeInput).toHaveLength(1);
  });

  it('renders clear button', () => {
    const component = mount(
      <TimePicker />
    );

    const clearButton = component.find('button.react-time-picker__clear-button');

    expect(clearButton).toHaveLength(1);
  });

  it('renders clock button', () => {
    const component = mount(
      <TimePicker />
    );

    const clockButton = component.find('button.react-time-picker__clock-button');

    expect(clockButton).toHaveLength(1);
  });

  it('renders TimeInput and Clock component when given isOpen flag', () => {
    const component = mount(
      <TimePicker isOpen />
    );

    const timeInput = component.find('TimeInput');
    const clock = component.find('Clock');

    expect(timeInput).toHaveLength(1);
    expect(clock).toHaveLength(1);
  });

  it('does not render Clock component when given disableClock & isOpen flags', () => {
    const component = mount(
      <TimePicker disableClock isOpen />
    );

    const timeInput = component.find('TimeInput');
    const clock = component.find('Clock');

    expect(timeInput).toHaveLength(1);
    expect(clock).toHaveLength(0);
  });

  it('opens Clock component when given isOpen flag by changing props', () => {
    const component = mount(
      <TimePicker />
    );

    const clock = component.find('Clock');

    expect(clock).toHaveLength(0);

    component.setProps({ isOpen: true });
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('opens Clock component when clicking on a button', () => {
    const component = mount(
      <TimePicker />
    );

    const clock = component.find('Clock');
    const button = component.find('button.react-time-picker__clock-button');

    expect(clock).toHaveLength(0);

    button.simulate('click');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('opens Clock component when focusing on an input inside', () => {
    const component = mount(
      <TimePicker />
    );

    const clock = component.find('Clock');
    const input = component.find('input[name^="hour"]');

    expect(clock).toHaveLength(0);

    input.simulate('focus');
    component.update();

    const clock2 = component.find('Clock');

    expect(clock2).toHaveLength(1);
  });

  it('closes Calendar component when clicked outside', () => {
    const { simulate } = mockDocumentListeners();

    const component = mount(
      <TimePicker isOpen />
    );

    simulate('mousedown', {
      target: document,
    });
    component.update();

    expect(component.state('isOpen')).toBe(false);
  });

  it('does not close Calendar component when clicked inside', () => {
    const { simulate } = mockDocumentListeners();

    const component = mount(
      <TimePicker isOpen />
    );

    simulate('mousedown', {
      target: component.getDOMNode(),
    });
    component.update();

    expect(component.state('isOpen')).toBe(true);
  });
});
