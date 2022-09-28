import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import TimeInput from './TimeInput';

import { muteConsole, restoreConsole } from '../test-utils';

const hasFullICU = (() => {
  try {
    const date = new Date(2018, 0, 1, 21);
    const formatter = new Intl.DateTimeFormat('de-DE', { hour: 'numeric' });
    return formatter.format(date).includes('21');
  } catch (err) {
    return false;
  }
})();

const itIfFullICU = hasFullICU ? it : it.skip;

const keyCodes = {
  'ArrowLeft': 37,
  'ArrowUp': 38,
  'ArrowRight': 39,
  'ArrowDown': 40,
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

  it('renders a native input and custom inputs', () => {
    const { container } = render(<TimeInput {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="time"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toBeInTheDocument();
    expect(customInputs).toHaveLength(2);
  });

  it('does not render second input when maxDetail is "minute" or less', () => {
    const { container } = render(<TimeInput {...defaultProps} maxDetail="minute" />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const secondInput = container.querySelector('input[name="second"]');
    const minuteInput = container.querySelector('input[name="minute"]');
    const hourInput = container.querySelector('input[name^="hour"]');

    expect(customInputs).toHaveLength(2);
    expect(secondInput).toBeFalsy();
    expect(minuteInput).toBeInTheDocument();
    expect(hourInput).toBeInTheDocument();
  });

  it('does not render second and minute inputs when maxDetail is "hour" or less', () => {
    const { container } = render(<TimeInput {...defaultProps} maxDetail="hour" />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const secondInput = container.querySelector('input[name="second"]');
    const minuteInput = container.querySelector('input[name="minute"]');
    const hourInput = container.querySelector('input[name^="hour"]');

    expect(customInputs).toHaveLength(1);
    expect(secondInput).toBeFalsy();
    expect(minuteInput).toBeFalsy();
    expect(hourInput).toBeInTheDocument();
  });

  it('shows a given time in all inputs correctly (12-hour format)', () => {
    const date = '22:17:00';

    const { container } = render(<TimeInput {...defaultProps} maxDetail="second" value={date} />);

    const nativeInput = container.querySelector('input[type="time"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveValue(date);
    expect(customInputs[0]).toHaveValue(10);
    expect(customInputs[1]).toHaveValue(17);
    expect(customInputs[2]).toHaveValue(0);
  });

  itIfFullICU('shows a given time in all inputs correctly (24-hour format)', () => {
    const date = '22:17:00';

    const { container } = render(
      <TimeInput {...defaultProps} locale="de-DE" maxDetail="second" value={date} />,
    );

    const nativeInput = container.querySelector('input[type="time"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveValue(date);
    expect(customInputs[0]).toHaveValue(22);
    expect(customInputs[1]).toHaveValue(17);
    expect(customInputs[2]).toHaveValue(0);
  });

  it('shows empty value in all inputs correctly given null', () => {
    const { container } = render(<TimeInput {...defaultProps} maxDetail="second" value={null} />);

    const nativeInput = container.querySelector('input[type="time"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs[0]).toHaveAttribute('value', '');
    expect(customInputs[1]).toHaveAttribute('value', '');
    expect(customInputs[2]).toHaveAttribute('value', '');
  });

  it('clears the value correctly', () => {
    const date = '22:17:00';

    const { container, rerender } = render(
      <TimeInput {...defaultProps} maxDetail="second" value={date} />,
    );

    rerender(<TimeInput {...defaultProps} maxDetail="second" value={null} />);

    const nativeInput = container.querySelector('input[type="time"]');
    const customInputs = container.querySelectorAll('input[data-input]');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs[0]).toHaveAttribute('value', '');
    expect(customInputs[1]).toHaveAttribute('value', '');
    expect(customInputs[2]).toHaveAttribute('value', '');
  });

  it('renders custom inputs in a proper order (12-hour format)', () => {
    const { container } = render(<TimeInput {...defaultProps} maxDetail="second" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('name', 'hour12');
    expect(customInputs[1]).toHaveAttribute('name', 'minute');
    expect(customInputs[2]).toHaveAttribute('name', 'second');
  });

  itIfFullICU('renders custom inputs in a proper order (24-hour format)', () => {
    const { container } = render(<TimeInput {...defaultProps} locale="de-DE" maxDetail="second" />);

    const customInputs = container.querySelectorAll('input[data-input]');

    expect(customInputs[0]).toHaveAttribute('name', 'hour24');
    expect(customInputs[1]).toHaveAttribute('name', 'minute');
    expect(customInputs[2]).toHaveAttribute('name', 'second');
  });

  it.todo('renders hour input without leading zero by default');

  it.todo('renders minute input with leading zero by default');

  it.todo('renders second input with leading zero by default');

  describe('renders custom input in a proper order given format', () => {
    it('renders "h" properly', () => {
      const { container } = render(<TimeInput {...defaultProps} format="h" />);

      const componentInput = container.querySelector('input[name="hour12"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "hh" properly', () => {
      const { container } = render(<TimeInput {...defaultProps} format="hh" />);

      const componentInput = container.querySelector('input[name="hour12"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "hhh"', () => {
      muteConsole();

      const renderComponent = () => render(<TimeInput {...defaultProps} format="hhh" />);

      expect(renderComponent).toThrow('Unsupported token: hhh');

      restoreConsole();
    });

    it('renders "H" properly', () => {
      const { container } = render(<TimeInput {...defaultProps} format="H" />);

      const componentInput = container.querySelector('input[name="hour24"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "HH" properly', () => {
      const { container } = render(<TimeInput {...defaultProps} format="HH" />);

      const componentInput = container.querySelector('input[name="hour24"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "HHH"', () => {
      muteConsole();

      const renderComponent = () => render(<TimeInput {...defaultProps} format="HHH" />);

      expect(renderComponent).toThrow('Unsupported token: HHH');

      restoreConsole();
    });

    it('renders "m" properly', () => {
      const { container } = render(<TimeInput {...defaultProps} format="m" />);

      const componentInput = container.querySelector('input[name="minute"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "mm" properly', () => {
      const { container } = render(<TimeInput {...defaultProps} format="mm" />);

      const componentInput = container.querySelector('input[name="minute"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "mmm"', () => {
      muteConsole();

      const renderComponent = () => render(<TimeInput {...defaultProps} format="mmm" />);

      expect(renderComponent).toThrow('Unsupported token: mmm');

      restoreConsole();
    });

    it('renders "s" properly', () => {
      const { container } = render(<TimeInput {...defaultProps} format="s" />);

      const componentInput = container.querySelector('input[name="second"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "ss" properly', () => {
      const { container } = render(<TimeInput {...defaultProps} format="ss" />);

      const componentInput = container.querySelector('input[name="second"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "sss"', () => {
      muteConsole();

      const renderComponent = () => render(<TimeInput {...defaultProps} format="sss" />);

      expect(renderComponent).toThrow('Unsupported token: sss');

      restoreConsole();
    });

    it('renders "a" properly', () => {
      const { container } = render(<TimeInput {...defaultProps} format="a" />);

      const componentSelect = container.querySelector('select[name="amPm"]');
      const customInputs = container.querySelectorAll('input[data-input]');

      expect(componentSelect).toBeInTheDocument();
      expect(customInputs).toHaveLength(0);
    });
  });

  it('renders proper input separators', () => {
    const { container } = render(<TimeInput {...defaultProps} maxDetail="second" />);

    const separators = container.querySelectorAll('.react-time-picker__inputGroup__divider');

    expect(separators).toHaveLength(3);
    expect(separators[0]).toHaveTextContent(':');
    expect(separators[1]).toHaveTextContent(':');
    expect(separators[2]).toHaveTextContent(''); // Non-breaking space
  });

  it('renders proper amount of separators', () => {
    const { container } = render(<TimeInput {...defaultProps} />);

    const separators = container.querySelectorAll('.react-time-picker__inputGroup__divider');
    const customInputs = container.querySelectorAll('input[data-input]');
    const ampm = container.querySelectorAll('select');

    expect(separators).toHaveLength(customInputs.length + ampm.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', () => {
    const { container } = render(<TimeInput {...defaultProps} maxDetail="second" />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0];
    const minuteInput = customInputs[1];

    fireEvent.focus(hourInput);
    hourInput.focus();

    expect(hourInput).toHaveFocus();

    fireEvent.keyDown(hourInput, getKey('ArrowRight'));

    expect(minuteInput).toHaveFocus();
  });

  it('jumps to the next field when separator key is pressed', () => {
    const { container } = render(<TimeInput {...defaultProps} maxDetail="second" />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0];
    const minuteInput = customInputs[1];

    fireEvent.focus(hourInput);
    hourInput.focus();

    expect(hourInput).toHaveFocus();

    const separators = container.querySelectorAll('.react-time-picker__inputGroup__divider');
    const separatorKey = separators[0].textContent;
    fireEvent.keyDown(hourInput, getKey(separatorKey));

    expect(minuteInput).toHaveFocus();
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', () => {
    const { container } = render(<TimeInput {...defaultProps} maxDetail="second" />);

    const select = container.querySelector('select');

    select.focus();

    expect(select).toHaveFocus();

    fireEvent.keyDown(select, getKey('ArrowRight'));

    expect(select).toHaveFocus();
  });

  it('jumps to the previous field when left arrow is pressed', () => {
    const { container } = render(<TimeInput {...defaultProps} maxDetail="second" />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0];
    const minuteInput = customInputs[1];

    fireEvent.focus(minuteInput);
    minuteInput.focus();

    expect(minuteInput).toHaveFocus();

    fireEvent.keyDown(minuteInput, getKey('ArrowLeft'));

    expect(hourInput).toHaveFocus();
  });

  it('does not jump to the previous field when left arrow is pressed when the first input is focused', () => {
    const { container } = render(<TimeInput {...defaultProps} maxDetail="second" />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0];

    fireEvent.focus(hourInput);
    hourInput.focus();

    expect(hourInput).toHaveFocus();

    fireEvent.keyDown(hourInput, getKey('ArrowLeft'));

    expect(hourInput).toHaveFocus();
  });

  it("jumps to the next field when a value which can't be extended to another valid value is entered", () => {
    const { container } = render(<TimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0];
    const minuteInput = customInputs[1];

    fireEvent.focus(hourInput);

    hourInput.value = '4';
    fireEvent.keyUp(hourInput, { key: '4' });

    expect(minuteInput).toHaveFocus();
  });

  it('jumps to the next field when a value as long as the length of maximum value is entered', () => {
    const { container } = render(<TimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0];
    const minuteInput = customInputs[1];

    fireEvent.focus(hourInput);

    hourInput.value = '02';
    fireEvent.keyUp(hourInput, { key: '2' });

    expect(minuteInput).toHaveFocus();
  });

  it('does not jump the next field when a value which can be extended to another valid value is entered', () => {
    const { container } = render(<TimeInput {...defaultProps} />);

    const customInputs = container.querySelectorAll('input[data-input]');
    const hourInput = customInputs[0];

    fireEvent.focus(hourInput);
    hourInput.focus();

    hourInput.value = '1';
    fireEvent.keyUp(hourInput, { key: '1' });

    expect(hourInput).toHaveFocus();
  });

  it('triggers onChange correctly when changed custom input', () => {
    const onChange = jest.fn();
    const date = '22:17:00';

    const { container } = render(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');

    fireEvent.change(customInputs[0], { target: { value: '20' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('20:17:00', false);
  });

  it('triggers onChange correctly when cleared custom inputs', () => {
    const onChange = jest.fn();
    const date = '22:17:00';

    const { container } = render(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const customInputs = container.querySelectorAll('input[data-input]');

    customInputs.forEach((customInput) => {
      fireEvent.change(customInput, { target: { value: '' } });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null, false);
  });

  it('triggers onChange correctly when changed native input', () => {
    const onChange = jest.fn();
    const date = '22:17:00';

    const { container } = render(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="time"]');

    fireEvent.change(nativeInput, { target: { value: '20:17:00' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('20:17:00', false);
  });

  it('triggers onChange correctly when cleared native input', () => {
    const onChange = jest.fn();
    const date = '22:17:00';

    const { container } = render(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="time"]');

    fireEvent.change(nativeInput, { target: { value: '' } });

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null, false);
  });
});
