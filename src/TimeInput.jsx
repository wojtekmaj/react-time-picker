import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';

import Divider from './Divider';
import Hour12Input from './TimeInput/Hour12Input';
import Hour24Input from './TimeInput/Hour24Input';
import MinuteInput from './TimeInput/MinuteInput';
import SecondInput from './TimeInput/SecondInput';
import NativeInput from './TimeInput/NativeInput';
import AmPm from './TimeInput/AmPm';

import { getFormatter } from './shared/dateFormatter';
import {
  getHours,
  getMinutes,
  getSeconds,
  getHoursMinutes,
  getHoursMinutesSeconds,
  convert12to24,
  convert24to12,
} from './shared/dates';
import { isTime } from './shared/propTypes';
import { getAmPmLabels } from './shared/utils';

const allViews = ['hour', 'minute', 'second'];

const hoursAreDifferent = (date1, date2) => (
  (date1 && !date2)
  || (!date1 && date2)
  || (date1 && date2 && date1 !== date2) // TODO: Compare 11:22:00 and 11:22 properly
);

const isValidInput = element => element.tagName === 'INPUT' && element.type === 'number';

const findPreviousInput = (element) => {
  let previousElement = element;
  do {
    previousElement = previousElement.previousElementSibling;
  } while (previousElement && !isValidInput(previousElement));
  return previousElement;
};

const findNextInput = (element) => {
  let nextElement = element;
  do {
    nextElement = nextElement.nextElementSibling;
  } while (nextElement && !isValidInput(nextElement));
  return nextElement;
};

const focus = element => element && element.focus();

const renderCustomInputs = (placeholder, elementFunctions) => {
  const pattern = new RegExp(
    Object.keys(elementFunctions).map(el => `${el}+`).join('|'), 'g',
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
              .find(elementFunction => currentMatch.match(elementFunction))
          ]
        );
        res.push(renderFunction(currentMatch));
      }
      return res;
    }, []);
};

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
        nextState.hour = getHours(nextValue);
        nextState.minute = getMinutes(nextValue);
        nextState.second = getSeconds(nextValue);
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

  get formatTime() {
    const { locale, maxDetail } = this.props;

    const options = { hour: 'numeric' };
    const level = allViews.indexOf(maxDetail);
    if (level >= 1) {
      options.minute = 'numeric';
    }
    if (level >= 2) {
      options.second = 'numeric';
    }

    return getFormatter(locale, options);
  }

  get formatNumber() {
    const { locale } = this.props;

    const options = { useGrouping: false };

    return getFormatter(locale, options);
  }

  /**
   * Gets current value in a desired format.
   */
  getProcessedValue(value) {
    const { nativeValueParser } = this;

    return nativeValueParser(value);
  }

  /**
   * Returns value type that can be returned with currently applied settings.
   */
  get valueType() {
    const { maxDetail } = this.props;

    return maxDetail;
  }

  get nativeValueParser() {
    switch (this.valueType) {
      case 'hour':
      case 'minute':
        return getHoursMinutes;
      case 'second':
        return getHoursMinutesSeconds;
      default:
        throw new Error('Invalid valueType.');
    }
  }

  get divider() {
    return this.placeholder.match(/[^0-9a-z]/i)[0];
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
      this.formatTime(date)
        .replace(this.formatNumber(hour12), 'h')
        .replace(this.formatNumber(hour24), 'H')
        .replace(this.formatNumber(minute), 'mm')
        .replace(this.formatNumber(second), 'ss')
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
      placeholder: '--',
      // This is only for showing validity when editing
      required: required || isClockOpen,
      itemRef: (ref, name) => {
        // Save a reference to each input field
        this[`${name}Input`] = ref;
      },
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
      case 'ArrowLeft': {
        event.preventDefault();

        const input = event.target;
        const previousInput = findPreviousInput(input);
        focus(previousInput);
        break;
      }
      case 'ArrowRight':
      case this.divider: {
        event.preventDefault();

        const input = event.target;
        const nextInput = findNextInput(input);
        focus(nextInput);
        break;
      }
      default:
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
          prevState => ({
            hour: value ? convert12to24(parseInt(value, 10), prevState.amPm) : null,
          }),
          this.onChangeExternal,
        );
        break;
      }
      case 'hour24': {
        this.setState(
          { hour: value ? parseInt(value, 10) : null },
          this.onChangeExternal,
        );
        break;
      }
      default: {
        this.setState(
          { [name]: value ? parseInt(value, 10) : null },
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
      this.hour12Input,
      this.hour24Input,
      this.minuteInput,
      this.secondInput,
      this.amPmInput,
    ].filter(Boolean);

    const formElementsWithoutSelect = formElements.slice(0, -1);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] = formElement.value;
    });

    if (formElementsWithoutSelect.every(formElement => !formElement.value)) {
      onChange(null, false);
    } else if (
      formElements.every(formElement => formElement.value && formElement.checkValidity())
    ) {
      const hour = `0${values.hour24 || convert12to24(values.hour12, values.amPm)}`.slice(-2);
      const minute = `0${values.minute || 0}`.slice(-2);
      const second = `0${values.second || 0}`.slice(-2);
      const timeString = `${hour}:${minute}:${second}`;
      const processedValue = this.getProcessedValue(timeString);
      onChange(processedValue, false);
    }
  }

  renderHour12 = (currentMatch) => {
    const { hour } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour12Input
        key="hour12"
        {...this.commonInputProps}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  }

  renderHour24 = (currentMatch) => {
    const { hour } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <Hour24Input
        key="hour24"
        {...this.commonInputProps}
        showLeadingZeros={showLeadingZeros}
        value={hour}
      />
    );
  }

  renderMinute = (currentMatch) => {
    const { hour, minute } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch && currentMatch.length === 2;

    return (
      <MinuteInput
        key="minute"
        {...this.commonInputProps}
        hour={hour}
        showLeadingZeros={showLeadingZeros}
        value={minute}
      />
    );
  }

  renderSecond = (currentMatch) => {
    const { hour, minute, second } = this.state;

    if (currentMatch && currentMatch.length > 2) {
      throw new Error(`Unsupported token: ${currentMatch}`);
    }

    const showLeadingZeros = currentMatch ? currentMatch.length === 2 : true;

    return (
      <SecondInput
        key="second"
        {...this.commonInputProps}
        hour={hour}
        minute={minute}
        showLeadingZeros={showLeadingZeros}
        value={second}
      />
    );
  }

  renderAmPm = () => {
    const { amPm } = this.state;
    const { locale } = this.props;

    return (
      <AmPm
        key="ampm"
        {...this.commonInputProps}
        locale={locale}
        onChange={this.onChangeAmPm}
        value={amPm}
      />
    );
  }

  renderCustomInputs() {
    const { placeholder } = this;
    const elementFunctions = {
      h: this.renderHour12,
      H: this.renderHour24,
      m: this.renderMinute,
      s: this.renderSecond,
      a: this.renderAmPm,
    };

    return renderCustomInputs(placeholder, elementFunctions);
  }

  renderNativeInput() {
    const {
      disabled,
      maxTime,
      minTime,
      name,
      required,
      value,
    } = this.props;

    return (
      <NativeInput
        key="time"
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

    return (
      <div
        className={className}
        onClick={this.onClick}
        role="presentation"
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
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isClockOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDetail: PropTypes.oneOf(allViews),
  maxTime: isTime,
  minTime: isTime,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    isTime,
    PropTypes.instanceOf(Date),
  ]),
};

polyfill(TimeInput);
