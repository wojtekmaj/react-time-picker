import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import clsx from 'clsx';
import Clock from 'react-clock';
import Fit from 'react-fit';

import TimeInput from './TimeInput';

import { isTime } from './shared/propTypes';

const baseClassName = 'react-time-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'];
const allViews = ['hour', 'minute', 'second'];

export default function TimePicker(props) {
  const {
    amPmAriaLabel,
    autoFocus,
    className,
    clearAriaLabel,
    clearIcon,
    clockAriaLabel,
    clockIcon,
    closeClock: shouldCloseClockProps,
    'data-testid': dataTestid,
    hourAriaLabel,
    hourPlaceholder,
    disableClock,
    disabled,
    format,
    id,
    isOpen: isOpenProps,
    locale,
    maxTime,
    maxDetail,
    minTime,
    minuteAriaLabel,
    minutePlaceholder,
    name,
    nativeInputAriaLabel,
    onClockClose,
    onClockOpen,
    onChange: onChangeProps,
    onFocus: onFocusProps,
    openClockOnFocus,
    required,
    value,
    secondAriaLabel,
    secondPlaceholder,
    ...otherProps
  } = props;

  const [isOpen, setIsOpen] = useState(isOpenProps);
  const wrapper = useRef();
  const clockWrapper = useRef();

  useEffect(() => {
    setIsOpen(isOpenProps);
  }, [isOpenProps]);

  function openClock() {
    setIsOpen(true);

    if (onClockOpen) {
      onClockOpen();
    }
  }

  const closeClock = useCallback(() => {
    setIsOpen(false);

    if (onClockClose) {
      onClockClose();
    }
  }, [onClockClose]);

  function toggleClock() {
    if (isOpen) {
      closeClock();
    } else {
      openClock();
    }
  }

  function onChange(value, shouldCloseClock = shouldCloseClockProps) {
    if (shouldCloseClock) {
      closeClock();
    }

    if (onChangeProps) {
      onChangeProps(value);
    }
  }

  function onFocus(event) {
    if (onFocusProps) {
      onFocusProps(event);
    }

    if (
      // Internet Explorer still fires onFocus on disabled elements
      disabled ||
      isOpen ||
      !openClockOnFocus ||
      event.target.dataset.select === 'true'
    ) {
      return;
    }

    openClock();
  }

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        closeClock();
      }
    },
    [closeClock],
  );

  function clear() {
    onChange(null);
  }

  function stopPropagation(event) {
    event.stopPropagation();
  }

  const onOutsideAction = useCallback(
    (event) => {
      const { current: wrapperEl } = wrapper;
      const { current: clockWrapperEl } = clockWrapper;

      // Try event.composedPath first to handle clicks inside a Shadow DOM.
      const target = 'composedPath' in event ? event.composedPath()[0] : event.target;

      if (
        wrapperEl &&
        !wrapperEl.contains(target) &&
        (!clockWrapperEl || !clockWrapperEl.contains(target))
      ) {
        closeClock();
      }
    },
    [clockWrapper, closeClock, wrapper],
  );

  const handleOutsideActionListeners = useCallback(
    (shouldListen = isOpen) => {
      const action = shouldListen ? 'addEventListener' : 'removeEventListener';

      outsideActionEvents.forEach((event) => {
        document[action](event, onOutsideAction);
      });

      document[action]('keydown', onKeyDown);
    },
    [isOpen, onOutsideAction, onKeyDown],
  );

  useEffect(() => {
    handleOutsideActionListeners();

    return () => {
      handleOutsideActionListeners(false);
    };
  }, [handleOutsideActionListeners]);

  function renderInputs() {
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
          onChange={onChange}
          required={required}
          value={valueFrom}
        />
        {clearIcon !== null && (
          <button
            aria-label={clearAriaLabel}
            className={`${baseClassName}__clear-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={clear}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof clearIcon === 'function' ? React.createElement(clearIcon) : clearIcon}
          </button>
        )}
        {clockIcon !== null && !disableClock && (
          <button
            aria-label={clockAriaLabel}
            className={`${baseClassName}__clock-button ${baseClassName}__button`}
            disabled={disabled}
            onClick={toggleClock}
            onFocus={stopPropagation}
            type="button"
          >
            {typeof clockIcon === 'function' ? React.createElement(clockIcon) : clockIcon}
          </button>
        )}
      </div>
    );
  }

  function renderClock() {
    if (isOpen === null || disableClock) {
      return null;
    }

    const {
      clockClassName,
      className: timePickerClassName, // Unused, here to exclude it from clockProps
      onChange: onChangeProps, // Unused, here to exclude it from clockProps
      portalContainer,
      value,
      ...clockProps
    } = props;

    const className = `${baseClassName}__clock`;
    const classNames = clsx(className, `${className}--${isOpen ? 'open' : 'closed'}`);

    const clock = (
      <Clock
        className={clockClassName}
        onChange={(value) => onChange(value)}
        value={value || null}
        {...clockProps}
      />
    );

    return portalContainer ? (
      createPortal(
        <div ref={clockWrapper} className={classNames}>
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

  const eventProps = useMemo(() => makeEventProps(otherProps), [otherProps]);

  const {
    onChange: onChangeEventProps, // Unused, here to exclude it from eventPropsWithoutOnChange
    ...eventPropsWithoutOnChange
  } = eventProps;

  return (
    <div
      className={clsx(
        baseClassName,
        `${baseClassName}--${isOpen ? 'open' : 'closed'}`,
        `${baseClassName}--${disabled ? 'disabled' : 'enabled'}`,
        className,
      )}
      data-testid={dataTestid}
      id={id}
      {...eventPropsWithoutOnChange}
      onFocus={onFocus}
      ref={wrapper}
    >
      {renderInputs()}
      {renderClock()}
    </div>
  );
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

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

TimePicker.propTypes = {
  amPmAriaLabel: PropTypes.string,
  autoFocus: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  clearAriaLabel: PropTypes.string,
  clearIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  clockAriaLabel: PropTypes.string,
  clockClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  clockIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  closeClock: PropTypes.bool,
  'data-testid': PropTypes.string,
  disableClock: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.string,
  hourAriaLabel: PropTypes.string,
  hourPlaceholder: PropTypes.string,
  id: PropTypes.string,
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
