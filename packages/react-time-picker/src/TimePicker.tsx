'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import makeEventProps from 'make-event-props';
import clsx from 'clsx';
import Clock from 'react-clock';
import Fit from 'react-fit';

import TimeInput from './TimeInput.js';

import { isTime, rangeOf } from './shared/propTypes.js';

import type { ReactNodeArray } from 'prop-types';
import type {
  ClassName,
  CloseReason,
  Detail,
  LooseValue,
  OpenReason,
  Value,
} from './shared/types.js';

const isBrowser = typeof document !== 'undefined';

const baseClassName = 'react-time-picker';
const outsideActionEvents = ['mousedown', 'focusin', 'touchstart'] as const;
const allViews = ['hour', 'minute', 'second'] as const;

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

type Icon = React.ReactElement | ReactNodeArray | null | string | number | boolean;

type IconOrRenderFunction = Icon | React.ComponentType | React.ReactElement;

type ClockProps = Omit<React.ComponentPropsWithoutRef<typeof Clock>, 'value'>;

type EventProps = ReturnType<typeof makeEventProps>;

export type TimePickerProps = {
  /**
   * `aria-label` for the AM/PM select input.
   *
   * @example 'Select AM/PM'
   */
  amPmAriaLabel?: string;
  /**
   * Automatically focuses the input on mount.
   *
   * @example true
   */
  autoFocus?: boolean;
  /**
   * Class name(s) that will be added along with `"react-time-picker"` to the main React-Time-Picker `<div>` element.
   *
   * @example 'class1 class2'
   * @example ['class1', 'class2 class3']
   */
  className?: ClassName;
  /**
   * `aria-label` for the clear button.
   *
   * @example 'Clear value'
   */
  clearAriaLabel?: string;
  /**
   * Content of the clear button. Setting the value explicitly to `null` will hide the icon.
   *
   * @example 'Clear'
   * @example <ClearIcon />
   * @example ClearIcon
   */
  clearIcon?: IconOrRenderFunction | null;
  /**
   * `aria-label` for the clock button.
   *
   * @example 'Toggle clock'
   */
  clockAriaLabel?: string;
  /**
   * Class name(s) that will be added along with `"react-clock"` to the main React-Clock `<time>` element.
   *
   * @example 'class1 class2'
   * @example ['class1', 'class2 class3']
   */
  clockClassName?: ClassName;
  /**
   * Content of the clock button. Setting the value explicitly to `null` will hide the icon.
   *
   * @example 'Clock'
   * @example <ClockIcon />
   * @example ClockIcon
   */
  clockIcon?: IconOrRenderFunction | null;
  /**
   * Whether to close the clock on value selection.
   *
   * **Note**: It's recommended to use `shouldCloseClock` function instead.
   *
   * @default true
   * @example false
   */
  closeClock?: boolean;
  /**
   * `data-testid` attribute for the main React-Time-Picker `<div>` element.
   *
   * @example 'time-picker'
   */
  'data-testid'?: string;
  /**
   * When set to `true`, will remove the clock and the button toggling its visibility.
   *
   * @default false
   * @example true
   */
  disableClock?: boolean;
  /**
   * Whether the time picker should be disabled.
   *
   * @default false
   * @example true
   */
  disabled?: boolean;
  /**
   * Input format based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Supported values are: `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `a`.
   *
   * **Note**: When using SSR, setting this prop may help resolving hydration errors caused by locale mismatch between server and client.
   *
   * @example 'h:m:s a'
   */
  format?: string;
  /**
   * `aria-label` for the hour input.
   *
   * @example 'Hour'
   */
  hourAriaLabel?: string;
  /**
   * `placeholder` for the hour input.
   *
   * @default '--'
   * @example 'hh'
   */
  hourPlaceholder?: string;
  /**
   * `id` attribute for the main React-TimeRange-Picker `<div>` element.
   *
   * @example 'time-picker'
   */
  id?: string;
  /**
   * Whether the clock should be opened.
   *
   * @default false
   * @example true
   */
  isOpen?: boolean;
  /**
   * Locale that should be used by the datetime picker and the calendar. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag).
   *
   * **Note**: When using SSR, setting this prop may help resolving hydration errors caused by locale mismatch between server and client.
   *
   * @example 'hu-HU'
   */
  locale?: string;
  /**
   * How detailed time picking shall be. Can be `"hour"`, `"minute"` or `"second"`.
   *
   * @default 'minute'
   * @example 'second'
   */
  maxDetail?: Detail;
  /**
   * Maximum date that the user can select.
   *
   * @example new Date()
   * @example '22:15:00'
   */
  maxTime?: string;
  /**
   * Minimum date that the user can select.
   *
   * @example new Date()
   * @example '22:15:00'
   */
  minTime?: string;
  /**
   * `aria-label` for the minute input.
   *
   * @example 'Minute'
   */
  minuteAriaLabel?: string;
  /**
   * `placeholder` for the minute input.
   *
   * @default '--'
   * @example 'mm'
   */
  minutePlaceholder?: string;
  /**
   * Input name.
   *
   * @default 'time'
   */
  name?: string;
  /**
   * `aria-label` for the native time input.
   *
   * @example 'Time'
   */
  nativeInputAriaLabel?: string;
  /**
   * Function called when the user picks a valid time.
   *
   * @example (value) => alert('New time is: ', value)
   */
  onChange?: (value: Value) => void;
  /**
   * Function called when the clock closes.
   *
   * @example () => alert('Clock closed')
   */
  onClockClose?: () => void;
  /**
   * Function called when the clock opens.
   *
   * @example () => alert('Clock opened')
   */
  onClockOpen?: () => void;
  /**
   * Function called when the user focuses an input.
   *
   * @example (event) => alert('Focused input: ', event.target.name)
   */
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  /**
   * Function called when the user picks an invalid time.
   *
   * @example () => alert('Invalid time')
   */
  onInvalidChange?: () => void;
  /**
   * Whether to open the clock on input focus.
   *
   * **Note**: It's recommended to use `shouldOpenClock` function instead.
   *
   * @default true
   * @example false
   */
  openClockOnFocus?: boolean;
  /**
   * Element to render the clock in using portal.
   *
   * @example document.getElementById('my-div')
   */
  portalContainer?: HTMLElement | null;
  /**
   * Whether time input should be required.
   *
   * @default false
   * @example true
   */
  required?: boolean;
  /**
   * `aria-label` for the second input.
   *
   * @example 'Second'
   */
  secondAriaLabel?: string;
  /**
   * `placeholder` for the second input.
   *
   * @default '--'
   * @example 'ss'
   */
  secondPlaceholder?: string;
  /**
   * Function called before the clock closes. `reason` can be `"buttonClick"`, `"escape"`, `"outsideAction"`, or `"select"`. If it returns `false`, the clock will not close.
   *
   * @example ({ reason }) => reason !== 'outsideAction'
   */
  shouldCloseClock?: ({ reason }: { reason: CloseReason }) => boolean;
  /**
   * Function called before the clock opens. `reason` can be `"buttonClick"` or `"focus"`. If it returns `false`, the clock will not open.
   *
   * @example ({ reason }) => reason !== 'focus'
   */
  shouldOpenClock?: ({ reason }: { reason: OpenReason }) => boolean;
  /**
   * Input value. Note that if you pass an array of values, only first value will be fully utilized.
   *
   * @example new Date(2017, 0, 1, 22, 15)
   * @example '22:15:00'
   * @example [new Date(2017, 0, 1, 22, 15), new Date(2017, 0, 1, 23, 45)]
   * @example ["22:15:00", "23:45:00"]
   */
  value?: LooseValue;
} & ClockProps &
  Omit<EventProps, 'onChange' | 'onFocus'>;

const TimePicker: React.FC<TimePickerProps> = function TimePicker(props) {
  const {
    amPmAriaLabel,
    autoFocus,
    className,
    clearAriaLabel,
    clearIcon = ClearIcon,
    clockAriaLabel,
    clockIcon = ClockIcon,
    closeClock: shouldCloseClockOnSelect = true,
    'data-testid': dataTestid,
    hourAriaLabel,
    hourPlaceholder,
    disableClock,
    disabled,
    format,
    id,
    isOpen: isOpenProps = null,
    locale,
    maxTime,
    maxDetail = 'minute',
    minTime,
    minuteAriaLabel,
    minutePlaceholder,
    name = 'time',
    nativeInputAriaLabel,
    onClockClose,
    onClockOpen,
    onChange: onChangeProps,
    onFocus: onFocusProps,
    onInvalidChange,
    openClockOnFocus = true,
    required,
    value,
    secondAriaLabel,
    secondPlaceholder,
    shouldCloseClock,
    shouldOpenClock,
    ...otherProps
  } = props;

  const [isOpen, setIsOpen] = useState<boolean | null>(isOpenProps);
  const wrapper = useRef<HTMLDivElement>(null);
  const clockWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(isOpenProps);
  }, [isOpenProps]);

  function openClock({ reason }: { reason: OpenReason }) {
    if (shouldOpenClock) {
      if (!shouldOpenClock({ reason })) {
        return;
      }
    }

    setIsOpen(true);

    if (onClockOpen) {
      onClockOpen();
    }
  }

  const closeClock = useCallback(
    ({ reason }: { reason: CloseReason }) => {
      if (shouldCloseClock) {
        if (!shouldCloseClock({ reason })) {
          return;
        }
      }

      setIsOpen(false);

      if (onClockClose) {
        onClockClose();
      }
    },
    [onClockClose, shouldCloseClock],
  );

  function toggleClock() {
    if (isOpen) {
      closeClock({ reason: 'buttonClick' });
    } else {
      openClock({ reason: 'buttonClick' });
    }
  }

  function onChange(value: Value, shouldCloseClock: boolean = shouldCloseClockOnSelect) {
    if (shouldCloseClock) {
      closeClock({ reason: 'select' });
    }

    if (onChangeProps) {
      onChangeProps(value);
    }
  }

  function onFocus(event: React.FocusEvent<HTMLInputElement>) {
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

    openClock({ reason: 'focus' });
  }

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeClock({ reason: 'escape' });
      }
    },
    [closeClock],
  );

  function clear() {
    onChange(null);
  }

  function stopPropagation(event: React.FocusEvent) {
    event.stopPropagation();
  }

  const onOutsideAction = useCallback(
    (event: Event) => {
      const { current: wrapperEl } = wrapper;
      const { current: clockWrapperEl } = clockWrapper;

      // Try event.composedPath first to handle clicks inside a Shadow DOM.
      const target = (
        'composedPath' in event ? event.composedPath()[0] : (event as Event).target
      ) as HTMLElement;

      if (
        target &&
        wrapperEl &&
        !wrapperEl.contains(target) &&
        (!clockWrapperEl || !clockWrapperEl.contains(target))
      ) {
        closeClock({ reason: 'outsideAction' });
      }
    },
    [clockWrapper, closeClock, wrapper],
  );

  const handleOutsideActionListeners = useCallback(
    (shouldListen = isOpen) => {
      outsideActionEvents.forEach((event) => {
        if (shouldListen) {
          document.addEventListener(event, onOutsideAction);
        } else {
          document.removeEventListener(event, onOutsideAction);
        }
      });

      if (shouldListen) {
        document.addEventListener('keydown', onKeyDown);
      } else {
        document.removeEventListener('keydown', onKeyDown);
      }
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
    const [valueFrom] = Array.isArray(value) ? value : [value];

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
          onInvalidChange={onInvalidChange}
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

    const [valueFrom] = Array.isArray(value) ? value : [value];

    const clock = <Clock className={clockClassName} value={valueFrom} {...clockProps} />;

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
      {...eventProps}
      onFocus={onFocus}
      ref={wrapper}
    >
      {renderInputs()}
      {renderClock()}
    </div>
  );
};

const isValue = PropTypes.oneOfType([isTime, PropTypes.instanceOf(Date)]);

const isValueOrValueArray = PropTypes.oneOfType([isValue, rangeOf(isValue)]);

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
  required: PropTypes.bool,
  secondAriaLabel: PropTypes.string,
  secondPlaceholder: PropTypes.string,
  value: isValueOrValueArray,
};

if (isBrowser) {
  TimePicker.propTypes.portalContainer = PropTypes.instanceOf(HTMLElement);
}

export default TimePicker;
