import { getHours, getHoursMinutes, getHoursMinutesSeconds } from '@wojtekmaj/date-utils';

type NativeInputProps = {
  ariaLabel?: string;
  disabled?: boolean;
  maxTime?: string;
  minTime?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value?: string | Date | null;
  valueType: 'hour' | 'minute' | 'second';
};

export default function NativeInput({
  ariaLabel,
  disabled,
  maxTime,
  minTime,
  name,
  onChange,
  required,
  value,
  valueType,
}: NativeInputProps) {
  const nativeValueParser = (() => {
    switch (valueType) {
      case 'hour':
        return (receivedValue: string | Date) => `${getHours(receivedValue)}:00`;
      case 'minute':
        return getHoursMinutes;
      case 'second':
        return getHoursMinutesSeconds;
      default:
        throw new Error('Invalid valueType');
    }
  })();

  const step = (() => {
    switch (valueType) {
      case 'hour':
        return 3600;
      case 'minute':
        return 60;
      case 'second':
        return 1;
      default:
        throw new Error('Invalid valueType');
    }
  })();

  function stopPropagation(event: React.FocusEvent<HTMLInputElement>) {
    event.stopPropagation();
  }

  return (
    <input
      aria-label={ariaLabel}
      disabled={disabled}
      hidden
      max={maxTime ? nativeValueParser(maxTime) : undefined}
      min={minTime ? nativeValueParser(minTime) : undefined}
      name={name}
      onChange={onChange}
      onFocus={stopPropagation}
      required={required}
      step={step}
      style={{
        visibility: 'hidden',
        position: 'absolute',
        zIndex: '-999',
      }}
      type="time"
      value={value ? nativeValueParser(value) : ''}
    />
  );
}
