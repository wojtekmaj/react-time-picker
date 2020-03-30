import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import mergeClassNames from 'merge-class-names';
import Fit from 'react-fit';

import Clock from 'react-clock/dist/entry.nostyle';

import TimeInput from './TimeInput';

import { isTime } from './shared/propTypes';
import { callIfDefined } from './shared/utils';

const allViews = ['hour', 'minute', 'second'];
const baseClassName = 'react-time-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'];

export default class TimePicker extends PureComponent {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isOpen !== prevState.isOpenProps) {
      return {
        isOpen: nextProps.isOpen,
        isOpenProps: nextProps.isOpen,
      };
    }

    return null;
  }

  state = {};

  componentDidMount() {
    this.handleOutsideActionListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const { onClockClose, onClockOpen } = this.props;

    if (isOpen !== prevState.isOpen) {
      this.handleOutsideActionListeners();
      callIfDefined(isOpen ? onClockOpen : onClockClose);
    }
  }

  componentWillUnmount() {
    this.handleOutsideActionListeners(false);
  }

  get eventProps() {
    return makeEventProps(this.props);
  }

  onOutsideAction = (event) => {
    if (this.wrapper && !this.wrapper.contains(event.target)) {
      this.closeClock();
    }
  }

  // eslint-disable-next-line react/destructuring-assignment
  onChange = (value, closeClock = this.props.closeClock) => {
    const { onChange } = this.props;

    if (closeClock) {
      this.closeClock();
    }

    if (onChange) {
      onChange(value);
    }
  }

  onFocus = (event) => {
    const { disabled, onFocus } = this.props;

    if (onFocus) {
      onFocus(event);
    }

    // Internet Explorer still fires onFocus on disabled elements
    if (disabled) {
      return;
    }

    this.openClock();
  }

  openClock = () => {
    this.setState({ isOpen: true });
  }

  closeClock = () => {
    this.setState((prevState) => {
      if (!prevState.isOpen) {
        return null;
      }

      return { isOpen: false };
    });
  }

  toggleClock = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  }

  stopPropagation = event => event.stopPropagation();

  clear = () => this.onChange(null);

  handleOutsideActionListeners(shouldListen) {
    const { isOpen } = this.state;

    const shouldListenWithFallback = typeof shouldListen !== 'undefined' ? shouldListen : isOpen;
    const fnName = shouldListenWithFallback ? 'addEventListener' : 'removeEventListener';
    outsideActionEvents.forEach(eventName => document[fnName](eventName, this.onOutsideAction));
  }

  renderInputs() {
    const {
      amPmAriaLabel,
      autoFocus,
      clearAriaLabel,
      clearIcon,
      clockAriaLabel,
      clockIcon,
      disableClock,
      disabled,
      format,
      hourAriaLabel,
      hourPlaceholder,
      isOpen,
      locale,
      maxDetail,
      maxTime,
      minTime,
      minuteAriaLabel,
      minutePlaceholder,
      name,
      nativeInputAriaLabel,
      required,
      secondAriaLabel,
      secondPlaceholder,
      value,
    } = this.props;

    const [valueFrom] = [].concat(value);

    const ariaLabelProps = {
      amPmAriaLabel,
      hourAriaLabel,
      minuteAriaLabel,
      nativeInputAriaLabel,
      secondAriaLabel,
    };

    const placeholderProps = {
      hourPlaceholder,
      minutePlaceholder,
      secondPlaceholder,
    };

    return (
      <div className={`${baseClassName}__wrapper`}>
        <TimeInput
          {...ariaLabelProps}
          {...placeholderProps}
          autoFocus={autoFocus}
          className={`${baseClassName}__inputGroup`}
          disabled={disabled}
          format={format}
          isClockOpen={isOpen}
          locale={locale}
          maxDetail={maxDetail}
          maxTime={maxTime}
          minTime={minTime}
          name={name}
          onChange={this.onChange}
          placeholder={this.placeholder}
          required={required}
          value={valueFrom}
        />
        {clearIcon !== null && (
          <button
            aria-label={clearAriaLabel}
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={this.clear}
            onFocus={this.stopPropagation}
            type="button"
          >
            {clearIcon}
          </button>
        )}
        {clockIcon !== null && !disableClock && (
          <button
            aria-label={clockAriaLabel}
            className={`${baseClassName}__clock-button ${baseClassName}__button`}
            disabled={disabled}
            onBlur={this.resetValue}
            onClick={this.toggleClock}
            onFocus={this.stopPropagation}
            type="button"
          >
            {clockIcon}
          </button>
        )}
      </div>
    );
  }

  renderClock() {
    const { disableClock } = this.props;
    const { isOpen } = this.state;

    if (isOpen === null || disableClock) {
      return null;
    }

    const {
      clockClassName,
      className: timePickerClassName, // Unused, here to exclude it from clockProps
      maxDetail,
      onChange,
      value,
      ...clockProps
    } = this.props;

    const className = `${baseClassName}__clock`;
    const [valueFrom] = [].concat(value);

    const maxDetailIndex = allViews.indexOf(maxDetail);

    return (
      <Fit>
        <div className={mergeClassNames(className, `${className}--${isOpen ? 'open' : 'closed'}`)}>
          <Clock
            className={clockClassName}
            renderMinuteHand={maxDetailIndex > 0}
            renderSecondHand={maxDetailIndex > 1}
            value={valueFrom}
            {...clockProps}
          />
        </div>
      </Fit>
    );
  }

  render() {
    const { className, disabled } = this.props;
    const { isOpen } = this.state;

    return (
      <div
        className={mergeClassNames(
          baseClassName,
          `${baseClassName}--${isOpen ? 'open' : 'closed'}`,
          `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
          className,
        )}
        {...this.eventProps}
        onFocus={this.onFocus}
        ref={(ref) => {
          if (!ref) {
            return;
          }

          this.wrapper = ref;
        }}
      >
        {this.renderInputs()}
        {this.renderClock()}
      </div>
    );
  }
}

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 19,
  height: 19,
  viewBox: '0 0 19 19',
  stroke: 'black',
  strokeWidth: 2,
};

const ClockIcon = (
  <svg
    {...iconProps}
    className={`${baseClassName}__clock-button__icon ${baseClassName}__button__icon`}
    fill="none"
  >
    <circle cx="9.5" cy="9.5" r="7.5" />
    <path d="M9.5 4.5 v5 h4" />
  </svg>
);

const ClearIcon = (
  <svg
    {...iconProps}
    className={`${baseClassName}__clear-button__icon ${baseClassName}__button__icon`}
  >
    <line x1="4" x2="15" y1="4" y2="15" />
    <line x1="15" x2="4" y1="4" y2="15" />
  </svg>
);

TimePicker.defaultProps = {
  clearIcon: ClearIcon,
  clockIcon: ClockIcon,
  closeClock: true,
  isOpen: null,
  maxDetail: 'minute',
};

const isValue = PropTypes.oneOfType([
  isTime,
  PropTypes.instanceOf(Date),
]);

TimePicker.propTypes = {
  amPmAriaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clearAriaLabel: PropTypes.string,
  clearIcon: PropTypes.node,
  clockAriaLabel: PropTypes.string,
  clockClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  clockIcon: PropTypes.node,
  closeClock: PropTypes.bool,
  disableClock: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  hourAriaLabel: PropTypes.string,
  hourPlaceholder: PropTypes.string,
  isOpen: PropTypes.bool,
  locale: PropTypes.string,
  maxDetail: PropTypes.oneOf(allViews),
  maxTime: isTime,
  minTime: isTime,
  minuteAriaLabel: PropTypes.string,
  minutePlaceholder: PropTypes.string,
  name: PropTypes.string,
  nativeInputAriaLabel: PropTypes.string,
  onChange: PropTypes.func,
  onClockClose: PropTypes.func,
  onClockOpen: PropTypes.func,
  onFocus: PropTypes.func,
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  value: PropTypes.oneOfType([
    isValue,
    PropTypes.arrayOf(isValue),
  ]),
};
