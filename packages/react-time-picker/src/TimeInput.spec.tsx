import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';

import TimeInput from './TimeInput.js';

import { muteConsole, restoreConsole } from '../../../test-utils.js';

vi.useFakeTimers();

const hasFullICU = (() => {
  try {
    const date = new Date(2018, 0, 1, 21);
    const formatter = new Intl.DateTimeFormat('de-DE', { hour: 'numeric' });
    return formatter.format(date).includes('21');
  } catch {
    return false;
  }
})();

const itIfFullICU = it.skipIf(!hasFullICU);

describe('TimeInput', () => {
  const defaultProps = {
    amPmAriaLabel: 'amPm',
    className: 'react-time-picker__inputGroup',
    hourAriaLabel: 'hour',
    minuteAriaLabel: 'minute',
    secondAriaLabel: 'second',
  };

  it('renders a native input and custom inputs', async () => {
    const { container } = await render(<TimeInput {...defaultProps} />);

    const nativeInput = container.querySelector('input[type="time"]');
    const customInputs = page.getByRole('spinbutton');

    expect(nativeInput).toBeInTheDocument();
    expect(customInputs).toHaveLength(2);
  });

  it('does not render second input when maxDetail is "minute" or less', async () => {
    await render(<TimeInput {...defaultProps} maxDetail="minute" />);

    const customInputs = page.getByRole('spinbutton');
    const secondInput = page.getByRole('spinbutton', { name: 'second' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });
    const hourInput = page.getByRole('spinbutton', { name: 'hour' });

    expect(customInputs).toHaveLength(2);
    expect(secondInput).not.toBeInTheDocument();
    expect(minuteInput).toBeInTheDocument();
    expect(hourInput).toBeInTheDocument();
  });

  it('does not render second and minute inputs when maxDetail is "hour" or less', async () => {
    await render(<TimeInput {...defaultProps} maxDetail="hour" />);

    const customInputs = page.getByRole('spinbutton');
    const secondInput = page.getByRole('spinbutton', { name: 'second' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });
    const hourInput = page.getByRole('spinbutton', { name: 'hour' });

    expect(customInputs).toHaveLength(1);
    expect(secondInput).not.toBeInTheDocument();
    expect(minuteInput).not.toBeInTheDocument();
    expect(hourInput).toBeInTheDocument();
  });

  it('shows a given time in all inputs correctly (12-hour format)', async () => {
    const date = '22:17:03';

    const { container } = await render(
      <TimeInput {...defaultProps} maxDetail="second" value={date} />,
    );

    const nativeInput = container.querySelector('input[type="time"]');
    const customInputs = page.getByRole('spinbutton');

    expect(nativeInput).toHaveValue(date);
    expect(customInputs.nth(0)).toHaveValue(10);
    expect(customInputs.nth(1)).toHaveValue(17);
    expect(customInputs.nth(2)).toHaveValue(3);
  });

  itIfFullICU('shows a given time in all inputs correctly (24-hour format)', async () => {
    const date = '22:17:03';

    const { container } = await render(
      <TimeInput {...defaultProps} locale="de-DE" maxDetail="second" value={date} />,
    );

    const nativeInput = container.querySelector('input[type="time"]');
    const customInputs = page.getByRole('spinbutton');

    expect(nativeInput).toHaveValue(date);
    expect(customInputs.nth(0)).toHaveValue(22);
    expect(customInputs.nth(1)).toHaveValue(17);
    expect(customInputs.nth(2)).toHaveValue(3);
  });

  it('shows empty value in all inputs correctly given null', async () => {
    const { container } = await render(
      <TimeInput {...defaultProps} maxDetail="second" value={null} />,
    );

    const nativeInput = container.querySelector('input[type="time"]');
    const customInputs = page.getByRole('spinbutton');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs.nth(0)).toHaveAttribute('value', '');
    expect(customInputs.nth(1)).toHaveAttribute('value', '');
    expect(customInputs.nth(2)).toHaveAttribute('value', '');
  });

  it('clears the value correctly', async () => {
    const date = '22:17:03';

    const { container, rerender } = await render(
      <TimeInput {...defaultProps} maxDetail="second" value={date} />,
    );

    rerender(<TimeInput {...defaultProps} maxDetail="second" value={null} />);

    const nativeInput = container.querySelector('input[type="time"]');
    const customInputs = page.getByRole('spinbutton');

    expect(nativeInput).toHaveAttribute('value', '');
    expect(customInputs.nth(0)).toHaveAttribute('value', '');
    expect(customInputs.nth(1)).toHaveAttribute('value', '');
    expect(customInputs.nth(2)).toHaveAttribute('value', '');
  });

  it('renders custom inputs in a proper order (12-hour format)', async () => {
    await render(<TimeInput {...defaultProps} maxDetail="second" />);

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs.nth(0)).toHaveAttribute('name', 'hour12');
    expect(customInputs.nth(1)).toHaveAttribute('name', 'minute');
    expect(customInputs.nth(2)).toHaveAttribute('name', 'second');
  });

  itIfFullICU('renders custom inputs in a proper order (24-hour format)', async () => {
    await render(<TimeInput {...defaultProps} locale="de-DE" maxDetail="second" />);

    const customInputs = page.getByRole('spinbutton');

    expect(customInputs.nth(0)).toHaveAttribute('name', 'hour24');
    expect(customInputs.nth(1)).toHaveAttribute('name', 'minute');
    expect(customInputs.nth(2)).toHaveAttribute('name', 'second');
  });

  it.todo('renders hour input without leading zero by default');

  it.todo('renders minute input with leading zero by default');

  it.todo('renders second input with leading zero by default');

  describe('renders custom input in a proper order given format', () => {
    it('renders "h" properly', async () => {
      await render(<TimeInput {...defaultProps} format="h" />);

      const componentInput = page.getByRole('spinbutton', { name: 'hour' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "hh" properly', async () => {
      await render(<TimeInput {...defaultProps} format="hh" />);

      const componentInput = page.getByRole('spinbutton', { name: 'hour' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "hhh"', async () => {
      muteConsole();

      const renderComponent = () => render(<TimeInput {...defaultProps} format="hhh" />);

      await expect(renderComponent).rejects.toThrowError('Unsupported token: hhh');

      restoreConsole();
    });

    it('renders "H" properly', async () => {
      await render(<TimeInput {...defaultProps} format="H" />);

      const componentInput = page.getByRole('spinbutton', { name: 'hour' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "HH" properly', async () => {
      await render(<TimeInput {...defaultProps} format="HH" />);

      const componentInput = page.getByRole('spinbutton', { name: 'hour' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "HHH"', async () => {
      muteConsole();

      const renderComponent = () => render(<TimeInput {...defaultProps} format="HHH" />);

      await expect(renderComponent).rejects.toThrowError('Unsupported token: HHH');

      restoreConsole();
    });

    it('renders "m" properly', async () => {
      await render(<TimeInput {...defaultProps} format="m" />);

      const componentInput = page.getByRole('spinbutton', { name: 'minute' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "mm" properly', async () => {
      await render(<TimeInput {...defaultProps} format="mm" />);

      const componentInput = page.getByRole('spinbutton', { name: 'minute' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "mmm"', async () => {
      muteConsole();

      const renderComponent = () => render(<TimeInput {...defaultProps} format="mmm" />);

      await expect(renderComponent).rejects.toThrowError('Unsupported token: mmm');

      restoreConsole();
    });

    it('renders "s" properly', async () => {
      await render(<TimeInput {...defaultProps} format="s" />);

      const componentInput = page.getByRole('spinbutton', { name: 'second' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('renders "ss" properly', async () => {
      await render(<TimeInput {...defaultProps} format="ss" />);

      const componentInput = page.getByRole('spinbutton', { name: 'second' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentInput).toBeInTheDocument();
      expect(customInputs).toHaveLength(1);
    });

    it('throws error for "sss"', async () => {
      muteConsole();

      const renderComponent = () => render(<TimeInput {...defaultProps} format="sss" />);

      await expect(renderComponent).rejects.toThrowError('Unsupported token: sss');

      restoreConsole();
    });

    it('renders "a" properly', async () => {
      await render(<TimeInput {...defaultProps} format="a" />);

      const componentSelect = page.getByRole('combobox', { name: 'amPm' });
      const customInputs = page.getByRole('spinbutton');

      expect(componentSelect).toBeInTheDocument();
      expect(customInputs).toHaveLength(0);
    });
  });

  it('renders proper input separators', async () => {
    await render(<TimeInput {...defaultProps} maxDetail="second" />);

    const separators = page.getByTestId('divider');

    expect(separators).toHaveLength(3);
    expect(separators.nth(0)).toHaveTextContent(':');
    expect(separators.nth(1)).toHaveTextContent(':');
    expect(separators.nth(2)).toHaveTextContent(''); // Non-breaking space
  });

  it('renders proper amount of separators', async () => {
    await render(<TimeInput {...defaultProps} />);

    const separators = page.getByTestId('divider');
    const customInputs = page.getByRole('spinbutton');
    const ampm = page.getByRole('combobox', { name: 'amPm' });

    expect(separators).toHaveLength(customInputs.length + ampm.length - 1);
  });

  it('jumps to the next field when right arrow is pressed', async () => {
    await render(<TimeInput {...defaultProps} maxDetail="second" />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });

    await userEvent.type(hourInput, '{arrowright}');

    expect(minuteInput).toHaveFocus();
  });

  it('jumps to the next field when separator key is pressed', async () => {
    await render(<TimeInput {...defaultProps} maxDetail="second" />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });

    const separator = page.getByTestId('divider').first();
    const separatorKey = separator.element().textContent;

    await userEvent.type(hourInput, separatorKey);

    expect(minuteInput).toHaveFocus();
  });

  it('does not jump to the next field when right arrow is pressed when the last input is focused', async () => {
    await render(<TimeInput {...defaultProps} maxDetail="second" />);

    const select = page.getByRole('combobox');

    await userEvent.type(select, '{arrowright}');

    expect(select).toHaveFocus();
  });

  it('jumps to the previous field when left arrow is pressed', async () => {
    await render(<TimeInput {...defaultProps} maxDetail="second" />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });

    await userEvent.type(minuteInput, '{arrowleft}');

    expect(hourInput).toHaveFocus();
  });

  it('does not jump to the previous field when left arrow is pressed when the first input is focused', async () => {
    await render(<TimeInput {...defaultProps} maxDetail="second" />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });

    await userEvent.type(hourInput, '{arrowleft}');

    expect(hourInput).toHaveFocus();
  });

  it("jumps to the next field when a value which can't be extended to another valid value is entered", async () => {
    await render(<TimeInput {...defaultProps} />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });

    await userEvent.type(hourInput, '4');

    expect(minuteInput).toHaveFocus();
  });

  it('jumps to the next field when a value as long as the length of maximum value is entered', async () => {
    await render(<TimeInput {...defaultProps} />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });

    await userEvent.type(hourInput, '03');

    expect(minuteInput).toHaveFocus();
  });

  function triggerKeyDown(element: HTMLElement, { key }: { key: string }) {
    element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  }

  function triggerKeyPress(element: HTMLElement, { key }: { key: string }) {
    element.dispatchEvent(new KeyboardEvent('keypress', { key, bubbles: true, cancelable: true }));
  }

  function triggerKeyUp(element: HTMLElement, { key }: { key: string }) {
    element.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true }));
  }

  it("jumps to the next field when a value which can't be extended to another valid value is entered by typing with multiple keys", async () => {
    function getActiveElement() {
      return document.activeElement as HTMLInputElement;
    }

    function keyDown(key: string, initial = false) {
      const element = getActiveElement();
      triggerKeyDown(element, { key });
      triggerKeyPress(element, { key });
      element.value = (initial ? '' : element.value) + key;
    }

    function keyUp(key: string) {
      triggerKeyUp(getActiveElement(), { key });
    }

    const date = '22:17:03';

    await render(<TimeInput {...defaultProps} value={date} />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });
    const minuteInput = page.getByRole('spinbutton', { name: 'minute' });

    hourInput.element().focus();
    expect(hourInput).toHaveFocus();

    keyDown('1', true);
    keyDown('2');

    keyUp('1');
    expect(hourInput).toHaveFocus();

    keyUp('2');
    expect(minuteInput).toHaveFocus();
  });

  it('does not jump the next field when a value which can be extended to another valid value is entered', async () => {
    await render(<TimeInput {...defaultProps} />);

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });

    await userEvent.type(hourInput, '1');

    expect(hourInput).toHaveFocus();
  });

  it('triggers onChange correctly when changed custom input', async () => {
    const onChange = vi.fn();
    const date = '22:17:03';

    await render(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const hourInput = page.getByRole('spinbutton', { name: 'hour' });

    await userEvent.fill(hourInput, '8');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('20:17:03', false);
  });

  it('triggers onChange correctly when cleared custom inputs', async () => {
    const onChange = vi.fn();
    const date = '22:17:03';

    await render(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const customInputs = page.getByRole('spinbutton').elements();

    for (const customInput of customInputs) {
      await userEvent.clear(customInput);
    }

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(null, false);
  });

  function setNativeValue(element: HTMLInputElement, value: string) {
    const prototype = Object.getPrototypeOf(element);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(prototype, 'value');
    const prototypeValueSetter = propertyDescriptor?.set;

    if (prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    }
  }

  function triggerChange(element: HTMLInputElement, value: string) {
    setNativeValue(element, value);
    element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  }

  it('triggers onChange correctly when changed native input', async () => {
    const onChange = vi.fn();
    const date = '22:17:03';

    const { container } = await render(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="time"]') as HTMLInputElement;

    triggerChange(nativeInput, '20:17:03');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('20:17:03', false);
  });

  it('triggers onChange correctly when cleared native input', async () => {
    const onChange = vi.fn();
    const date = '22:17:03';

    const { container } = await render(
      <TimeInput {...defaultProps} maxDetail="second" onChange={onChange} value={date} />,
    );

    const nativeInput = container.querySelector('input[type="time"]') as HTMLInputElement;

    triggerChange(nativeInput, '');

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(null, false);
  });
});
