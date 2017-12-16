import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { formatTime } from './shared/dateFormatter';
import {
  getHours,
  getMinutes,
  getSeconds,
  getHoursMinutes,
  getHoursMinutesSeconds,
} from './shared/dates';
import { setLocale } from './shared/locales';
import { isTime } from './shared/propTypes';

const allViews = ['hour', 'minute', 'second'];

const hoursAreDifferent = (date1, date2) => (
  (date1 && !date2) ||
  (!date1 && date2) ||
  (date1 && date2 && date1 !== date2) // TODO: Compare 11:22:00 and 11:22 properly
);

const updateInputWidth = (element) => {
  const span = document.createElement('span');
  span.innerHTML = element.value || element.placeholder;

  const container = element.parentElement;

  container.appendChild(span);

  const width = span.clientWidth + 4;
  element.style.width = `${width}px`;

  container.removeChild(span);
};

const findPreviousInput = (element) => {
  const previousElement = element.previousElementSibling; // Divider between inputs
  if (!previousElement) {
    return null;
  }
  return previousElement.previousElementSibling; // Actual input
};

const findNextInput = (element) => {
  const nextElement = element.nextElementSibling; // Divider between inputs
  if (!nextElement) {
    return null;
  }
  return nextElement.nextElementSibling; // Actual input
};

const selectIfPossible = (element) => {
  if (!element) {
    return;
  }
  element.focus();
  element.select();
};

const removeUnwantedCharacters = str => str
  .split('')
  // We don't want spaces in time
  .filter(a => a.charCodeAt(0) !== 32)
  // Internet Explorer specific
  .filter(a => a.charCodeAt(0) !== 8206)
  .join('');

const min = (...args) => Math.min(...args.filter(a => typeof a === 'number'));
const max = (...args) => Math.max(...args.filter(a => typeof a === 'number'));

export default class TimeInput extends Component {
  state = {
    hour: '',
    minute: '',
    second: '',
  }

  componentDidMount() {
    setLocale(this.props.locale);
    this.updateValues();
  }

  componentWillReceiveProps(nextProps) {
    const { props } = this;
    const { value: nextValue } = nextProps;
    const { value } = this.props;

    if (nextProps.locale !== props.locale) {
      setLocale(nextProps.locale);
    }

    if (
      // Toggling clock visibility resets values
      (nextProps.isClockOpen !== props.isClockOpen) ||
      hoursAreDifferent(nextValue, value)
    ) {
      this.updateValues(nextProps);
    }
  }

  get maxSecond() {
    const { maxTime } = this.props;
    const { hour, minute } = this.state;
    return min(
      59,
      maxTime &&
      hour === getHours(maxTime) &&
      minute === getMinutes(maxTime) &&
        getSeconds(maxTime),
    );
  }

  get minSecond() {
    const { minTime } = this.props;
    const { hour, minute } = this.state;
    return max(
      0,
      minTime &&
      hour === getHours(minTime) &&
      minute === getMinutes(minTime) &&
        getSeconds(minTime),
    );
  }

  get maxMinute() {
    const { maxTime } = this.props;
    const { hour } = this.state;
    return min(
      59,
      maxTime && hour === getHours(maxTime) && getMinutes(maxTime),
    );
  }

  get minMinute() {
    const { minTime } = this.props;
    const { hour } = this.state;
    return max(
      0,
      minTime && hour === getHours(minTime) && getMinutes(minTime),
    );
  }

  get maxHour() {
    const { maxTime } = this.props;
    return min(
      23,
      maxTime && getHours(maxTime),
    );
  }

  get minHour() {
    const { minTime } = this.props;
    return max(
      0,
      minTime && getHours(minTime),
    );
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
        return getHours;
      case 'minute':
        return getHoursMinutes;
      case 'second':
        return getHoursMinutesSeconds;
      default:
        throw new Error('Invalid valueType.');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get divider() {
    const date = new Date(2017, 0, 1, 21, 12, 13);

    return (
      removeUnwantedCharacters(formatTime(date))
        .match(/[^0-9]/)[0]
    );
  }

  get dividerElement() {
    return (
      <span className="react-time-picker__button__input__divider">
        {this.divider}
      </span>
    );
  }

  // eslint-disable-next-line class-methods-use-this
  get placeholder() {
    const date = new Date(2017, 0, 1, 21, 12, 13);

    return (
      removeUnwantedCharacters(formatTime(date))
        .replace('21', 'hour-24')
        .replace('9', 'hour-12')
        .replace('12', 'minute')
        .replace('13', 'second')
    );
  }

  get commonInputProps() {
    return {
      type: 'number',
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      placeholder: '--',
      // This is only for showing validity when editing
      required: this.props.required || this.props.isClockOpen,
      ref: (ref) => {
        if (!ref) {
          return;
        }

        // Save a reference to each input field
        this[`${ref.name}Input`] = ref;

        updateInputWidth(ref);
      },
    };
  }

  updateValues(props = this.props) {
    const { value } = props;

    this.setState({
      hour: value ? getHours(value) : '',
      minute: value ? getMinutes(value) : '',
      second: value ? getSeconds(value) : '',
    });
  }

  onKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault();

        const input = event.target;
        const previousInput = findPreviousInput(input);
        selectIfPossible(previousInput);
        break;
      }
      case 'ArrowRight':
      case this.divider: {
        event.preventDefault();

        const input = event.target;
        const nextInput = findNextInput(input);
        selectIfPossible(nextInput);
        break;
      }
      default:
    }
  }

  /**
   * Called when non-native date input is changed.
   */
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });

    updateInputWidth(event.target);

    this.onChangeExternal();
  }

  /**
   * Called when native date input is changed.
   */
  onChangeNative = (event) => {
    const { value } = event.target;

    if (this.props.onChange) {
      this.props.onChange(new Date(value));
    }
  }

  /**
   * Called after internal onChange. Checks input validity. If all fields are valid,
   * calls props.onChange.
   */
  onChangeExternal = () => {
    const formElements = [this.hourInput, this.minuteInput, this.secondInput].filter(a => a);

    const values = {};
    formElements.forEach((formElement) => {
      values[formElement.name] = formElement.value;
    });

    if (formElements.every(formElement => formElement.value && formElement.checkValidity())) {
      const timeString = `${`0${values.hour}`.slice(-2)}:${`0${values.minute || 0}`.slice(-2)}:${`0${values.second || 0}`.slice(-2)}`;
      const processedValue = this.getProcessedValue(timeString);
      if (this.props.onChange) {
        this.props.onChange(processedValue, false);
      }
    }
  }

  stopPropagation = event => event.stopPropagation()

  renderHour() {
    return (
      <input
        className="react-time-picker__button__input__hour"
        name="hour"
        key="hour"
        max={this.maxHour}
        min={this.minHour}
        value={this.state.hour}
        {...this.commonInputProps}
      />
    );
  }

  renderMinute() {
    const { maxDetail } = this.props;

    // Do not display if maxDetail is "hour" or less
    if (allViews.indexOf(maxDetail) < 1) {
      return null;
    }

    return (
      <input
        className="react-time-picker__button__input__minute"
        name="minute"
        key="minute"
        max={this.maxMinute}
        min={this.minMinute}
        value={this.state.minute}
        {...this.commonInputProps}
      />
    );
  }

  renderSecond() {
    const { maxDetail } = this.props;

    // Do not display if maxDetail is "minute" or less
    if (allViews.indexOf(maxDetail) < 2) {
      return null;
    }

    return (
      <input
        className="react-time-picker__button__input__second"
        name="second"
        key="second"
        max={this.maxSecond}
        min={this.minSecond}
        value={this.state.second}
        {...this.commonInputProps}
      />
    );
  }

  renderCustomInputs() {
    const { divider, dividerElement, placeholder } = this;

    return (
      placeholder
        .split(divider)
        .map((part) => {
          switch (part) {
            case 'hour-24': return this.renderHour();
            case 'hour-12': return this.renderHour();
            case 'minute': return this.renderMinute();
            case 'second': return this.renderSecond();
            case 'ampm': return null; // TODO
            default: return null;
          }
        })
        .filter(part => part)
        .reduce((result, element, index, array) => {
          result.push(element);

          if (index + 1 < array.length) {
            // eslint-disable-next-line react/no-array-index-key
            result.push(React.cloneElement(dividerElement, { key: `separator_${index}` }));
          }

          return result;
        }, [])
    );
  }

  renderNativeInput() {
    const { nativeValueParser } = this;
    const {
      required, value,
    } = this.props;

    return (
      <input
        type="time"
        max={null /* TODO */}
        min={null /* TODO */}
        name="time"
        key="time"
        onChange={this.onChangeNative}
        onFocus={this.stopPropagation}
        required={required}
        step={this.yearStep}
        style={{
          visibility: 'hidden',
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
        }}
        value={value ? nativeValueParser(value) : ''}
      />
    );
  }

  render() {
    return (
      <div className="react-time-picker__button__input">
        {this.renderNativeInput()}
        {this.renderCustomInputs()}
      </div>
    );
  }
}

TimeInput.defaultProps = {
  maxDetail: 'minute',
};

TimeInput.propTypes = {
  isClockOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDetail: PropTypes.oneOf(allViews),
  maxTime: isTime,
  minTime: isTime,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    isTime,
    PropTypes.instanceOf(Date),
  ]),
};
