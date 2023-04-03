import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  getHours,
  getMinutes,
  getSeconds,
  getHoursMinutes,
  getHoursMinutesSeconds,
} from '@wojtekmaj/date-utils';

import Divider from './Divider';
import Hour12Input from './TimeInput/Hour12Input';
import Hour24Input from './TimeInput/Hour24Input';
import MinuteInput from './TimeInput/MinuteInput';
import SecondInput from './TimeInput/SecondInput';
import NativeInput from './TimeInput/NativeInput';
import AmPm from './TimeInput/AmPm';

import { getFormatter, getNumberFormatter } from './shared/dateFormatter';
import { convert12to24, convert24to12 } from './shared/dates';
import { isTime } from './shared/propTypes';
import { getAmPmLabels } from './shared/utils';

const getFormatterOptionsCache = {};

const allViews = ['hour', 'minute', 'second'];

function isInternalInput(element) {
  return element.dataset.input === 'true';
}

function findInput(element, property) {
  let nextElement = element;
  do {
    nextElement = nextElement[property];
  } while (nextElement && !isInternalInput(nextElement));
  return nextElement;
}

function focus(element) {
  if (element) {
    element.focus();
  }
}

function renderCustomInputs(placeholder, elementFunctions, allowMultipleInstances) {
  const usedFunctions = [];
  const pattern = new RegExp(
    Object.keys(elementFunctions)
      .map((el) => `${el}+`)
      .join('|'),
    'g',
  );
  const matches = placeholder.match(pattern);

  return placeholder.split(pattern).reduce((arr, element, index) => {
    const divider = element && (
      // eslint-disable-next-line react/no-array-index-key
      <Divider key={`separator_${index}`}>{element}</Divider>
    );
    const res = [...arr, divider];
    const currentMatch = matches && matches[index];

    if (currentMatch) {
      const renderFunction =
        elementFunctions[currentMatch] ||
        elementFunctions[
          Object.keys(elementFunctions).find((elementFunction) =>
            currentMatch.match(elementFunction),
          )
        ];

      if (!renderFunction) {
        return res;
      }

      if (!allowMultipleInstances && usedFunctions.includes(renderFunction)) {
        res.push(currentMatch);
      } else {
        res.push(renderFunction(currentMatch, index));
        usedFunctions.push(renderFunction);
      }
    }

    return res;
  }, []);
}

const formatNumber = getNumberFormatter({ useGrouping: false });

export default function TimeInput({
  amPmAriaLabel,
  autoFocus,
  className,
  disabled,
  format,
  hourAriaLabel,
  hourPlaceholder,
  isClockOpen: isClockOpenProps = null,
  locale,
  maxDetail = 'minute',
  maxTime,
  minTime,
  minuteAriaLabel,
  minutePlaceholder,
  name = 'time',
  nativeInputAriaLabel,
  onChange: onChangeProps,
  required,
  secondAriaLabel,
  secondPlaceholder,
  value: valueProps,
}) {
  const [amPm, setAmPm] = useState(null);
  const [hour, setHour] = useState(null);
  const [minute, setMinute] = useState(null);
  const [second, setSecond] = useState(null);
  const [value, setValue] = useState(null);
  const amPmInput = useRef();
  const hour12Input = useRef();
  const hour24Input = useRef();
  const minuteInput = useRef();
  const secondInput = useRef();
  const [isClockOpen, setIsClockOpen] = useState(isClockOpenProps);

  useEffect(() => {
    setIsClockOpen(isClockOpenProps);
  }, [isClockOpenProps]);

  useEffect(() => {
    const nextValue = valueProps;

    if (nextValue) {
      setAmPm(convert24to12(getHours(nextValue))[1]);
      setHour(getHours(nextValue).toString());
      setMinute(getMinutes(nextValue).toString());
      setSecond(getSeconds(nextValue).toString());
    } else {
      setAmPm(null);
      setHour(null);
      setMinute(null);
      setSecond(null);
    }
    setValue(nextValue);
  }, [
    valueProps,
    minTime,
    maxTime,
    maxDetail,
    // Toggling clock visibility resets values
    isClockOpen,
  ]);

  const valueType = maxDetail;

  const formatTime = (() => {
    const level = allViews.indexOf(maxDetail);
    const formatterOptions =
      getFormatterOptionsCache[level] ||
      (() => {
        const options = { hour: 'numeric' };
        if (level >= 1) {
          options.minute = 'numeric';
        }
        if (level >= 2) {
          options.second = 'numeric';
        }

        getFormatterOptionsCache[level] = options;

        return options;
      })();

    return getFormatter(formatterOptions);
  })();

  /**
   * Gets current value in a desired format.
   */
  function getProcessedValue(value) {
    const processFunction = (() => {
      switch (valueType) {
        case 'hour':
        case 'minute':
          return getHoursMinutes;
        case 'second':
          return getHoursMinutesSeconds;
        default:
          throw new Error('Invalid valueType');
      }
    })();

    return processFunction(value);
  }

  const placeholder =
    format ||
    (() => {
      const hour24 = 21;
      const hour12 = 9;
      const minute = 13;
      const second = 14;
      const date = new Date(2017, 0, 1, hour24, minute, second);

      return formatTime(locale, date)
        .replace(formatNumber(locale, hour12), 'h')
        .replace(formatNumber(locale, hour24), 'H')
        .replace(formatNumber(locale, minute), 'mm')
        .replace(formatNumber(locale, second), 'ss')
        .replace(new RegExp(getAmPmLabels(locale).join('|')), 'a');
    })();

  const divider = (() => {
    const dividers = placeholder.match(/[^0-9a-z]/i);
    return dividers ? dividers[0] : null;
  })();

  function onClick(event) {
    if (event.target === event.currentTarget) {
      // Wrapper was directly clicked
      const firstInput = event.target.children[1];
      focus(firstInput);
    }
  }

  function onKeyDown(event) {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case divider: {
        event.preventDefault();

        const { target: input } = event;
        const property =
          event.key === 'ArrowLeft' ? 'previousElementSibling' : 'nextElementSibling';
        const nextInput = findInput(input, property);
        focus(nextInput);
        break;
      }
      default:
    }
  }

  function onKeyUp(event) {
    const { key, target: input } = event;

    const isNumberKey = !isNaN(parseInt(key, 10));

    if (!isNumberKey) {
      return;
    }

    const { value } = input;
    const max = input.getAttribute('max');

    /**
     * Given 1, the smallest possible number the user could type by adding another digit is 10.
     * 10 would be a valid value given max = 12, so we won't jump to the next input.
     * However, given 2, smallers possible number would be 20, and thus keeping the focus in
     * this field doesn't make sense.
     */
    if (value * 10 > max || value.length >= max.length) {
      const property = 'nextElementSibling';
      const nextInput = findInput(input, property);
      focus(nextInput);
    }
  }

  /**
   * Called after internal onChange. Checks input validity. If all fields are valid,
   * calls props.onChange.
   */
  function onChangeExternal() {
    if (!onChangeProps) {
      return;
    }

    const formElements = [
      amPmInput.current,
      hour12Input.current,
      hour24Input.current,
      minuteInput.current,
      secondInput.current,
    ].filter(Boolean);

    const formElementsWithoutSelect = formElements.slice(1);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] =
        formElement.type === 'number'
          ? 'valueAsNumber' in formElement
            ? formElement.valueAsNumber
            : parseInt(formElement.value, 10)
          : formElement.value;
    });

    if (formElementsWithoutSelect.every((formElement) => !formElement.value)) {
      onChangeProps(null, false);
    } else if (
      formElements.every((formElement) => formElement.value && formElement.validity.valid)
    ) {
      const hour = values.hour24 || convert12to24(values.hour12, values.amPm) || 0;
      const minute = values.minute || 0;
      const second = values.second || 0;

      const padStart = (num) => `0${num}`.slice(-2);

      const proposedValue = `${padStart(hour)}:${padStart(minute)}:${padStart(second)}`;

      const processedValue = getProcessedValue(proposedValue);
      onChangeProps(processedValue, false);
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  function onChange(event) {
    const { name, value } = event.target;

    switch (name) {
      case 'amPm':
        setAmPm(value);
        break;
      case 'hour12':
        setHour(value ? convert12to24(parseInt(value, 10), amPm).toString() : '');
        break;
      case 'hour24':
        setHour(value);
        break;
      case 'minute':
        setMinute(value);
        break;
      case 'second':
        setSecond(value);
        break;
    }

    onChangeExternal();
  }

  /**
   * Called when native date input is changed.
   */
  function onChangeNative(event) {
    const { value } = event.target;

    if (!onChangeProps) {
      return;
    }

    const processedValue = value || null;

    onChangeProps(processedValue, false);
  }

  const commonInputProps = {
    className,
    disabled,
    maxTime,
    minTime,
    onChange,
    onKeyDown,
    onKeyUp,
    // This is only for showing validity when editing
    required: required || isClockOpen,
  };

  function renderHour12(currentMatch, index) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour12Input
        key="hour12"
        {...commonInputProps}
        amPm={amPm}
        ariaLabel={hourAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={hour12Input}
        placeholder={hourPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  }

  function renderHour24(currentMatch, index) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour24Input
        key="hour24"
        {...commonInputProps}
        ariaLabel={hourAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={hour24Input}
        placeholder={hourPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  }

  function renderHour(currentMatch, index) {
    if (/h/.test(currentMatch)) {
      return renderHour12(currentMatch, index);
    }

    return renderHour24(currentMatch, index);
  }

  function renderMinute(currentMatch, index) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <MinuteInput
        key="minute"
        {...commonInputProps}
        ariaLabel={minuteAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        hour={hour}
        inputRef={minuteInput}
        placeholder={minutePlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={minute}
      />
    );
  }

  function renderSecond(currentMatch, index) {
    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch ? currentMatch.length === 2 : true;

    return (
      <SecondInput
        key="second"
        {...commonInputProps}
        ariaLabel={secondAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        hour={hour}
        inputRef={secondInput}
        minute={minute}
        placeholder={secondPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={second}
      />
    );
  }

  function renderAmPm(currentMatch, index) {
    return (
      <AmPm
        key="ampm"
        {...commonInputProps}
        ariaLabel={amPmAriaLabel}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={index === 0 && autoFocus}
        inputRef={amPmInput}
        locale={locale}
        onChange={onChange}
        value={amPm}
      />
    );
  }

  function renderCustomInputsInternal() {
    const elementFunctions = {
      h: renderHour,
      H: renderHour,
      m: renderMinute,
      s: renderSecond,
      a: renderAmPm,
    };

    const allowMultipleInstances = typeof format !== 'undefined';
    return renderCustomInputs(placeholder, elementFunctions, allowMultipleInstances);
  }

  function renderNativeInput() {
    return (
      <NativeInput
        key="time"
        ariaLabel={nativeInputAriaLabel}
        disabled={disabled}
        maxTime={maxTime}
        minTime={minTime}
        name={name}
        onChange={onChangeNative}
        required={required}
        value={value}
        valueType={valueType}
      />
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={className} onClick={onClick}>
      {renderNativeInput()}
      {renderCustomInputsInternal()}
    </div>
  );
}

TimeInput.propTypes = {
  amPmAriaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  hourAriaLabel: PropTypes.string,
  hourPlaceholder: PropTypes.string,
  isClockOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDetail: PropTypes.oneOf(allViews),
  maxTime: isTime,
  minTime: isTime,
  minuteAriaLabel: PropTypes.string,
  minutePlaceholder: PropTypes.string,
  name: PropTypes.string,
  nativeInputAriaLabel: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  value: PropTypes.oneOfType([isTime, PropTypes.instanceOf(Date)]),
};
