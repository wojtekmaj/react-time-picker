import React, { createRef, PureComponent } from 'react';
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

import { getFormatter } from './shared/dateFormatter';
import { convert12to24, convert24to12 } from './shared/dates';
import { isTime } from './shared/propTypes';
import { getAmPmLabels } from './shared/utils';

const allViews = ['hour', 'minute', 'second'];

function hoursAreDifferent(date1, date2) {
  return (
    (date1 && !date2)
    || (!date1 && date2)
    || (date1 && date2 && date1 !== date2) // TODO: Compare 11:22:00 and 11:22 properly
  );
}

function isValidInput(element) {
  return element.tagName === 'INPUT' && element.type === 'number';
}

function findInput(element, property) {
  let nextElement = element;
  do {
    nextElement = nextElement[property];
  } while (nextElement && !isValidInput(nextElement));
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
    Object.keys(elementFunctions).map((el) => `${el}+`).join('|'), 'g',
  );
  const matches = placeholder.match(pattern);

  return placeholder.split(pattern)
    .reduce((arr, element, index) => {
      const divider = element && (
        // eslint-disable-next-line react/no-array-index-key
        <Divider key={`separator_${index}`}>
          {element}
        </Divider>
      );
      const res = [...arr, divider];
      const currentMatch = matches && matches[index];

      if (currentMatch) {
        const renderFunction = (
          elementFunctions[currentMatch]
          || elementFunctions[
            Object.keys(elementFunctions)
              .find((elementFunction) => currentMatch.match(elementFunction))
          ]
        );

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

export default class TimeInput extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {};

    /**
     * If isClockOpen flag has changed, we have to update it.
     * It's saved in state purely for use in getDerivedStateFromProps.
     */
    if (nextProps.isClockOpen !== prevState.isClockOpen) {
      nextState.isClockOpen = nextProps.isClockOpen;
    }

    /**
     * If the next value is different from the current one  (with an exception of situation in
     * which values provided are limited by minDate and maxDate so that the dates are the same),
     * get a new one.
     */
    const nextValue = nextProps.value;
    if (
      // Toggling calendar visibility resets values
      nextState.isClockOpen // Flag was toggled
      || hoursAreDifferent(nextValue, prevState.value)
    ) {
      if (nextValue) {
        [, nextState.amPm] = convert24to12(getHours(nextValue));
        nextState.hour = getHours(nextValue).toString();
        nextState.minute = getMinutes(nextValue).toString();
        nextState.second = getSeconds(nextValue).toString();
      } else {
        nextState.amPm = null;
        nextState.hour = null;
        nextState.minute = null;
        nextState.second = null;
      }
      nextState.value = nextValue;
    }

    return nextState;
  }

  state = {
    amPm: null,
    hour: null,
    minute: null,
    second: null,
  };

  amPmInput = createRef();

  hour12Input = createRef();

  hour24Input = createRef();

  minuteInput = createRef();

  secondInput= createRef();

  get formatTime() {
    const { maxDetail } = this.props;

    const options = { hour: 'numeric' };
    const level = allViews.indexOf(maxDetail);
    if (level >= 1) {
      options.minute = 'numeric';
    }
    if (level >= 2) {
      options.second = 'numeric';
    }

    return getFormatter(options);
  }

  // eslint-disable-next-line class-methods-use-this
  get formatNumber() {
    const options = { useGrouping: false };

    return getFormatter(options);
  }

  /**
   * Gets current value in a desired format.
   */
  getProcessedValue(value) {
    const processFunction = (() => {
      switch (this.valueType) {
        case 'hour':
        case 'minute': return getHoursMinutes;
        case 'second': return getHoursMinutesSeconds;
        default: throw new Error('Invalid valueType.');
      }
    })();

    return processFunction(value);
  }

  /**
   * Returns value type that can be returned with currently applied settings.
   */
  get valueType() {
    const { maxDetail } = this.props;

    return maxDetail;
  }

  get divider() {
    const dividers = this.placeholder.match(/[^0-9a-z]/i);
    return dividers ? dividers[0] : null;
  }

  get placeholder() {
    const { format, locale } = this.props;

    if (format) {
      return format;
    }

    const hour24 = 21;
    const hour12 = 9;
    const minute = 13;
    const second = 14;
    const date = new Date(2017, 0, 1, hour24, minute, second);

    return (
      this.formatTime(locale, date)
        .replace(this.formatNumber(locale, hour12), 'h')
        .replace(this.formatNumber(locale, hour24), 'H')
        .replace(this.formatNumber(locale, minute), 'mm')
        .replace(this.formatNumber(locale, second), 'ss')
        .replace(new RegExp(getAmPmLabels(locale).join('|')), 'a')
    );
  }

  get commonInputProps() {
    const {
      className,
      disabled,
      isClockOpen,
      maxTime,
      minTime,
      required,
    } = this.props;

    return {
      className,
      disabled,
      maxTime,
      minTime,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      onKeyUp: this.onKeyUp,
      placeholder: '--',
      // This is only for showing validity when editing
      required: required || isClockOpen,
    };
  }

  onClick = (event) => {
    if (event.target === event.currentTarget) {
      // Wrapper was directly clicked
      const firstInput = event.target.children[1];
      focus(firstInput);
    }
  }

  onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
      case this.divider: {
        event.preventDefault();

        const { target: input } = event;
        const property = event.key === 'ArrowLeft' ? 'previousElementSibling' : 'nextElementSibling';
        const nextInput = findInput(input, property);
        focus(nextInput);
        break;
      }
      default:
    }
  }

  onKeyUp = (event) => {
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
    if ((value * 10 > max) || (value.length >= max.length)) {
      const property = 'nextElementSibling';
      const nextInput = findInput(input, property);
      focus(nextInput);
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  onChange = (event) => {
    const { name, value } = event.target;

    switch (name) {
      case 'hour12': {
        this.setState(
          (prevState) => ({
            hour: value ? convert12to24(parseInt(value, 10), prevState.amPm).toString() : '',
          }),
          this.onChangeExternal,
        );
        break;
      }
      case 'hour24': {
        this.setState(
          { hour: value },
          this.onChangeExternal,
        );
        break;
      }
      default: {
        this.setState(
          { [name]: value },
          this.onChangeExternal,
        );
      }
    }
  }

  /**
   * Called when native date input is changed.
   */
  onChangeNative = (event) => {
    const { onChange } = this.props;
    const { value } = event.target;

    if (!onChange) {
      return;
    }

    const processedValue = (() => {
      if (!value) {
        return null;
      }

      return value;
    })();

    onChange(processedValue, false);
  }

  onChangeAmPm = (event) => {
    const { value } = event.target;

    this.setState(
      ({ amPm: value }),
      this.onChangeExternal,
    );
  }

  /**
   * Called after internal onChange. Checks input validity. If all fields are valid,
   * calls props.onChange.
   */
  onChangeExternal = () => {
    const { onChange } = this.props;

    if (!onChange) {
      return;
    }

    const formElements = [
      this.amPmInput.current,
      this.hour12Input.current,
      this.hour24Input.current,
      this.minuteInput.current,
      this.secondInput.current,
    ].filter(Boolean);

    const formElementsWithoutSelect = formElements.slice(1);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] = formElement.value;
    });

    if (formElementsWithoutSelect.every((formElement) => !formElement.value)) {
      onChange(null, false);
    } else if (
      formElements.every((formElement) => formElement.value && formElement.validity.valid)
    ) {
      const hour = parseInt(values.hour24 || convert12to24(values.hour12, values.amPm) || 0, 10);
      const minute = parseInt(values.minute || 0, 10);
      const second = parseInt(values.second || 0, 10);

      const padStart = (num) => `0${num}`.slice(-2);
      const proposedValue = `${padStart(hour)}:${padStart(minute)}:${padStart(second)}`;
      const processedValue = this.getProcessedValue(proposedValue);
      onChange(processedValue, false);
    }
  }

  renderHour = (currentMatch, index) => {
    if (/h/.test(currentMatch)) {
      return this.renderHour12(currentMatch, index);
    }

    return this.renderHour24(currentMatch, index);
  };

  renderHour12 = (currentMatch, index) => {
    const { autoFocus, hourAriaLabel, hourPlaceholder } = this.props;
    const { amPm, hour } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour12Input
        key="hour12"
        {...this.commonInputProps}
        amPm={amPm}
        ariaLabel={hourAriaLabel}
        autoFocus={index === 0 && autoFocus}
        inputRef={this.hour12Input}
        placeholder={hourPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  }

  renderHour24 = (currentMatch, index) => {
    const { autoFocus, hourAriaLabel, hourPlaceholder } = this.props;
    const { hour } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour24Input
        key="hour24"
        {...this.commonInputProps}
        ariaLabel={hourAriaLabel}
        autoFocus={index === 0 && autoFocus}
        inputRef={this.hour24Input}
        placeholder={hourPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  }

  renderMinute = (currentMatch, index) => {
    const { autoFocus, minuteAriaLabel, minutePlaceholder } = this.props;
    const { hour, minute } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <MinuteInput
        key="minute"
        {...this.commonInputProps}
        ariaLabel={minuteAriaLabel}
        autoFocus={index === 0 && autoFocus}
        hour={hour}
        inputRef={this.minuteInput}
        placeholder={minutePlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={minute}
      />
    );
  }

  renderSecond = (currentMatch, index) => {
    const { autoFocus, secondAriaLabel, secondPlaceholder } = this.props;
    const { hour, minute, second } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch ? currentMatch.length === 2 : true;

    return (
      <SecondInput
        key="second"
        {...this.commonInputProps}
        ariaLabel={secondAriaLabel}
        autoFocus={index === 0 && autoFocus}
        hour={hour}
        inputRef={this.secondInput}
        minute={minute}
        placeholder={secondPlaceholder}
        showLeadingZeros={showLeadingZeros}
        value={second}
      />
    );
  }

  renderAmPm = (currentMatch, index) => {
    const { amPmAriaLabel, autoFocus, locale } = this.props;
    const { amPm } = this.state;

    return (
      <AmPm
        key="ampm"
        {...this.commonInputProps}
        ariaLabel={amPmAriaLabel}
        autoFocus={index === 0 && autoFocus}
        inputRef={this.amPmInput}
        locale={locale}
        onChange={this.onChangeAmPm}
        value={amPm}
      />
    );
  }

  renderCustomInputs() {
    const { placeholder } = this;
    const { format } = this.props;

    const elementFunctions = {
      h: this.renderHour,
      H: this.renderHour,
      m: this.renderMinute,
      s: this.renderSecond,
      a: this.renderAmPm,
    };

    const allowMultipleInstances = typeof format !== 'undefined';
    return renderCustomInputs(placeholder, elementFunctions, allowMultipleInstances);
  }

  renderNativeInput() {
    const {
      disabled,
      maxTime,
      minTime,
      name,
      nativeInputAriaLabel,
      required,
      value,
    } = this.props;

    return (
      <NativeInput
        key="time"
        ariaLabel={nativeInputAriaLabel}
        disabled={disabled}
        maxTime={maxTime}
        minTime={minTime}
        name={name}
        onChange={this.onChangeNative}
        required={required}
        value={value}
        valueType={this.valueType}
      />
    );
  }

  render() {
    const { className } = this.props;

    /* eslint-disable jsx-a11y/click-events-have-key-events */
    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <div
        className={className}
        onClick={this.onClick}
      >
        {this.renderNativeInput()}
        {this.renderCustomInputs()}
      </div>
    );
  }
}

TimeInput.defaultProps = {
  maxDetail: 'minute',
  name: 'time',
};

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
  value: PropTypes.oneOfType([
    isTime,
    PropTypes.instanceOf(Date),
  ]),
};
