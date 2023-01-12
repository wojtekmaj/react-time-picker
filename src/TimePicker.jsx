import React, { createRef, PureComponent } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import clsx from 'clsx';
import Fit from 'react-fit';

import Clock from 'react-clock';

import TimeInput from './TimeInput';

import { isTime } from './shared/propTypes';

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

  wrapper = createRef();

  clockWrapper = createRef();

  componentDidMount() {
    this.handleOutsideActionListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    const { isOpen } = this.state;
    const { onClockClose, onClockOpen } = this.props;

    if (isOpen !== prevState.isOpen) {
      this.handleOutsideActionListeners();
      const callback = isOpen ? onClockOpen : onClockClose;
      if (callback) callback();
    }
  }

  componentWillUnmount() {
    this.handleOutsideActionListeners(false);
  }

  get eventProps() {
    return makeEventProps(this.props);
  }

  onOutsideAction = (event) => {
    const { wrapper, clockWrapper } = this;

    // Try event.composedPath first to handle clicks inside a Shadow DOM.
    const target = 'composedPath' in event ? event.composedPath()[0] : event.target;

    if (
      wrapper.current &&
      !wrapper.current.contains(target) &&
      (!clockWrapper.current || !clockWrapper.current.contains(target))
    ) {
      this.closeClock();
    }
  };

  onChange = (value, closeClock = this.props.closeClock) => {
    const { onChange } = this.props;

    if (closeClock) {
      this.closeClock();
    }

    if (onChange) {
      onChange(value);
    }
  };

  onFocus = (event) => {
    const { disabled, onFocus, openClockOnFocus } = this.props;

    if (onFocus) {
      onFocus(event);
    }

    // Internet Explorer still fires onFocus on disabled elements
    if (disabled) {
      return;
    }

    if (openClockOnFocus) {
      if (event.target.dataset.select === 'true') {
        return;
      }

      this.openClock();
    }
  };

  onKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.closeClock();
    }
  };

  openClock = () => {
    this.setState({ isOpen: true });
  };

  closeClock = () => {
    this.setState((prevState) => {
      if (!prevState.isOpen) {
        return null;
      }

      return { isOpen: false };
    });
  };

  toggleClock = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  stopPropagation = (event) => event.stopPropagation();

  clear = () => this.onChange(null);

  handleOutsideActionListeners(shouldListen) {
    const { isOpen } = this.state;

    const shouldListenWithFallback = typeof shouldListen !== 'undefined' ? shouldListen : isOpen;
    const fnName = shouldListenWithFallback ? 'addEventListener' : 'removeEventListener';
    outsideActionEvents.forEach((eventName) => document[fnName](eventName, this.onOutsideAction));
    document[fnName]('keydown', this.onKeyDown);
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
          // eslint-disable-next-line jsx-a11y/no-autofocus
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
      portalContainer,
      value,
      ...clockProps
    } = this.props;

    const className = `${baseClassName}__clock`;
    const classNames = clsx(className, `${className}--${isOpen ? 'open' : 'closed'}`);

    const [valueFrom] = [].concat(value);

    const maxDetailIndex = allViews.indexOf(maxDetail);

    const clock = (
      <Clock
        className={clockClassName}
        renderMinuteHand={maxDetailIndex > 0}
        renderSecondHand={maxDetailIndex > 1}
        value={valueFrom}
        {...clockProps}
      />
    );

    return portalContainer ? (
      createPortal(
        <div ref={this.clockWrapper} className={classNames}>
          {clock}
        </div>,
        portalContainer,
      )
    ) : (
      <Fit>
        <div
          ref={(ref) => {
            if (ref && !isOpen) {
              ref.removeAttribute('style');
            }
          }}
          className={classNames}
        >
          {clock}
        </div>
      </Fit>
    );
  }

  render() {
    const { eventProps } = this;
    const { className, 'data-testid': dataTestid, disabled } = this.props;
    const { isOpen } = this.state;

    const { onChange, ...eventPropsWithoutOnChange } = eventProps;

    return (
      <div
        className={clsx(
          baseClassName,
          `${baseClassName}--${isOpen ? 'open' : 'closed'}`,
          `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
          className,
        )}
        data-testid={dataTestid}
        {...eventPropsWithoutOnChange}
        onFocus={this.onFocus}
        ref={this.wrapper}
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
  openClockOnFocus: true,
};

const isValue = PropTypes.oneOfType([isTime, PropTypes.instanceOf(Date)]);

TimePicker.propTypes = {
  amPmAriaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  clearAriaLabel: PropTypes.string,
  clearIcon: PropTypes.node,
  clockAriaLabel: PropTypes.string,
  clockClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  clockIcon: PropTypes.node,
  closeClock: PropTypes.bool,
  'data-testid': PropTypes.string,
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
  openClockOnFocus: PropTypes.bool,
  portalContainer: PropTypes.object,
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  value: PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]),
};
