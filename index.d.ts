import { ClockProps } from 'react-clock';

declare module 'react-time-picker' {
  export interface TimePickerProps extends ClockProps {
    /** `aria-label` for the AM/PM select input.*/
    amPmAriaLabel?: string;
    /** `aria-label` for the clear button. */
    clearAriaLabel?: string;
    /** Content of the clear button. Setting the value explicitly to `null` will hide the icon. */
    clearIcon?: string | JSX.Element;
    /** `aria-label` for the clock button. */
    clockAriaLabel?: string;
    /** Class name(s) that will be added along with "react-clock" to the main React-Clock `<time>` element. */
    clockClassName?: string | string[];
    /** Content of the clock button. Setting the value explicitly to `null` will hide the icon. */
    clockIcon?: string | JSX.Element;
    /** Whether the time picker should be disabled. */
    disabled?: boolean;
    /** When set to `true`, will remove the clock and the button toggling its visibility. */
    disableClock?: boolean;
    /**
     * Input format based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Supported values are: `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `a`.
     */
    format?: 'HH' | 'h' | 'hh' | 'm' | 'mm' | 's' | 'ss' | 'a';
    /** `aria-label` for the hour input. */
    hourAriaLabel?: string;
    /** `placeholder` for the hour input. */
    hourPlaceholder?: string;
    /** Whether the clock should be opened. */
    isOpen?: boolean;
    /**
     * Locale that should be used by the time picker and the clock. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag). */
    locale?: string;
    /** How detailed time picking shall be. Can be `hour`, `minute` or `second`. */
    maxDetail?: 'hour' | 'minute' | 'second';
    /** Maximum time that the user can select. */
    maxTime?: Date | string;
    /** Minimum date that the user can select. */
    minTime?: Date | string;
    /** `aria-label` for the minute input. */
    minuteAriaLabel?: string;
    /** `placeholder` for the minute input. */
    minutePlaceholder?: string;
    /** Input name. */
    name?: string;
    /** `aria-label` for the native time input. */
    nativeInputAriaLabel?: string;
    /** Function called when the user picks a valid time. */
    onChange?: (value: string) => any;
    /** Function called when the clock closes. */
    onClockClose?: () => any;
    /** Function called when the clock opens. */
    onClockOpen?: () => any;
    /** Whether date input should be required. */
    required?: boolean;
    /** `aria-label` for the second input. */
    secondAriaLabel?: string;
    /** placeholder for the second input. */
    secondPlaceholder?: string;
    /** Input value. */
    value?: Date | string;
  }

  export default function TimePicker(props: TimePickerProps): JSX.Element;
}
