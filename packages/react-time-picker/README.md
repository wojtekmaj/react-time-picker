[![npm](https://img.shields.io/npm/v/react-time-picker.svg)](https://www.npmjs.com/package/react-time-picker) ![downloads](https://img.shields.io/npm/dt/react-time-picker.svg) [![CI](https://github.com/wojtekmaj/react-time-picker/actions/workflows/ci.yml/badge.svg)](https://github.com/wojtekmaj/react-time-picker/actions)

# React-Time-Picker

A time picker for your React app.

- Supports virtually any language
- No moment.js needed

## tl;dr

- Install by executing `npm install react-time-picker` or `yarn add react-time-picker`.
- Import by adding `import TimePicker from 'react-time-picker'`.
- Use by adding `<TimePicker />`. Use `onChange` prop for getting new values.

## Demo

A minimal demo page can be found in `sample` directory.

[Online demo](https://projects.wojtekmaj.pl/react-time-picker/) is also available!

## Consider native alternative

If you don't need to support legacy browsers and don't need the advanced features this package provides, consider using native time input instead. It's more accessible, adds no extra weight to your bundle, and works better on mobile devices.

```tsx
<input aria-label="Time" type="time" />
```

## Looking for a date picker or a datetime picker?

React-Time-Picker will play nicely with [React-Date-Picker](https://github.com/wojtekmaj/react-date-picker) and [React-DateTime-Picker](https://github.com/wojtekmaj/react-datetime-picker). Check them out!

## Getting started

### Compatibility

Your project needs to use React 16.3 or later. If you use an older version of React, please refer to the table below to find a suitable React-Time-Picker version.

| React version | Newest compatible React-Time-Picker version |
| ------------- | ------------------------------------------- |
| ≥16.3         | latest                                      |
| ≥16.0         | 3.x                                         |

#### Legacy browsers

If you need to support legacy browsers like Internet Explorer 10, you will need to use [Intl.js](https://github.com/andyearnshaw/Intl.js/) or another Intl polyfill along with React-Date-Picker.

### Installation

Add React-Time-Picker to your project by executing `npm install react-time-picker` or `yarn add react-time-picker`.

### Usage

Here's an example of basic usage:

```tsx
import { useState } from 'react';
import TimePicker from 'react-time-picker';

function MyApp() {
  const [value, onChange] = useState('10:00');

  return (
    <div>
      <TimePicker onChange={onChange} value={value} />
    </div>
  );
}
```

### Custom styling

If you want to use default React-Date-Picker and React-Clock styling to build upon it, you can import them by using:

```ts
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
```

## User guide

### TimePicker

Displays an input field complete with custom inputs, native input and a clock.

#### Props

| Prop name            | Description                                                                                                                                                                                                                                                                                                                                       | Default value                         | Example values                                                                                                                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| amPmAriaLabel        | `aria-label` for the AM/PM select input.                                                                                                                                                                                                                                                                                                          | n/a                                   | `"Select AM/PM"`                                                                                                                                                                                                                      |
| autoFocus            | Automatically focuses the input on mount.                                                                                                                                                                                                                                                                                                         | n/a                                   | `true`                                                                                                                                                                                                                                |
| className            | Class name(s) that will be added along with `"react-time-picker"` to the main React-Time-Picker `<div>` element.                                                                                                                                                                                                                                  | n/a                                   | <ul><li>String: `"class1 class2"`</li><li>Array of strings: `["class1", "class2 class3"]`</li></ul>                                                                                                                                   |
| clearAriaLabel       | `aria-label` for the clear button.                                                                                                                                                                                                                                                                                                                | n/a                                   | `"Clear value"`                                                                                                                                                                                                                       |
| clearIcon            | Content of the clear button. Setting the value explicitly to `null` will hide the icon.                                                                                                                                                                                                                                                           | (default icon)                        | <ul><li>String: `"Clear"`</li><li>React element: `<ClearIcon />`</li><li>React function: `ClearIcon`</li></ul>                                                                                                                        |
| clockAriaLabel       | `aria-label` for the clock button.                                                                                                                                                                                                                                                                                                                | n/a                                   | `"Toggle clock"`                                                                                                                                                                                                                      |
| clockProps           | Props to pass to React-Clock component.                                                                                                                                                                                                                                                                                                           | n/a                                   | See [React-Clock documentation](https://github.com/wojtekmaj/react-clock)                                                                                                                                                             |
| clockIcon            | Content of the clock button. Setting the value explicitly to `null` will hide the icon.                                                                                                                                                                                                                                                           | (default icon)                        | <ul><li>String: `"Clock"`</li><li>React element: `<ClockIcon />`</li><li>React function: `ClockIcon`</li></ul>                                                                                                                        |
| closeClock           | Whether to close the clock on value selection. **Note**: It's recommended to use `shouldCloseClock` function instead.                                                                                                                                                                                                                             | `true`                                | `false`                                                                                                                                                                                                                               |
| data-testid          | `data-testid` attribute for the main React-Time-Picker `<div>` element.                                                                                                                                                                                                                                                                           | n/a                                   | `"time-picker"`                                                                                                                                                                                                                       |
| disableClock         | When set to `true`, will remove the clock and the button toggling its visibility.                                                                                                                                                                                                                                                                 | `false`                               | `true`                                                                                                                                                                                                                                |
| disabled             | Whether the time picker should be disabled.                                                                                                                                                                                                                                                                                                       | `false`                               | `true`                                                                                                                                                                                                                                |
| format               | Input format based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Supported values are: `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `a`. **Note**: When using SSR, setting this prop may help resolving hydration errors caused by locale mismatch between server and client. | n/a                                   | `"h:m:s a"`                                                                                                                                                                                                                           |
| hourAriaLabel        | `aria-label` for the hour input.                                                                                                                                                                                                                                                                                                                  | n/a                                   | `"Hour"`                                                                                                                                                                                                                              |
| hourPlaceholder      | `placeholder` for the hour input.                                                                                                                                                                                                                                                                                                                 | `"--"`                                | `"hh"`                                                                                                                                                                                                                                |
| id                   | `id` attribute for the main React-Time-Picker `<div>` element.                                                                                                                                                                                                                                                                                    | n/a                                   | `"time-picker"`                                                                                                                                                                                                                       |
| isOpen               | Whether the clock should be opened.                                                                                                                                                                                                                                                                                                               | `false`                               | `true`                                                                                                                                                                                                                                |
| locale               | Locale that should be used by the time picker and the clock. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag). **Note**: When using SSR, setting this prop may help resolving hydration errors caused by locale mismatch between server and client.                                                                | Server locale/User's browser settings | `"hu-HU"`                                                                                                                                                                                                                             |
| maxDetail            | How detailed time picking shall be. Can be `"hour"`, `"minute"` or `"second"`.                                                                                                                                                                                                                                                                    | `"minute"`                            | `"second"`                                                                                                                                                                                                                            |
| maxTime              | Maximum time that the user can select.                                                                                                                                                                                                                                                                                                            | n/a                                   | <ul><li>Date: `new Date()`</li><li>String: `"22:15:00"`</li></ul>                                                                                                                                                                     |
| minTime              | Minimum date that the user can select.                                                                                                                                                                                                                                                                                                            | n/a                                   | <ul><li>Date: `new Date()`</li><li>String: `"22:15:00"`</li></ul>                                                                                                                                                                     |
| minuteAriaLabel      | `aria-label` for the minute input.                                                                                                                                                                                                                                                                                                                | n/a                                   | `"Minute"`                                                                                                                                                                                                                            |
| minutePlaceholder    | `placeholder` for the minute input.                                                                                                                                                                                                                                                                                                               | `"--"`                                | `"mm"`                                                                                                                                                                                                                                |
| name                 | Input name.                                                                                                                                                                                                                                                                                                                                       | `"time"`                              | `"myCustomName"`                                                                                                                                                                                                                      |
| nativeInputAriaLabel | `aria-label` for the native time input.                                                                                                                                                                                                                                                                                                           | n/a                                   | `"Time"`                                                                                                                                                                                                                              |
| onChange             | Function called when the user picks a valid time.                                                                                                                                                                                                                                                                                                 | n/a                                   | `(value) => alert('New time is: ', value)`                                                                                                                                                                                            |
| onClockClose         | Function called when the clock closes.                                                                                                                                                                                                                                                                                                            | n/a                                   | `() => alert('Clock closed')`                                                                                                                                                                                                         |
| onClockOpen          | Function called when the clock opens.                                                                                                                                                                                                                                                                                                             | n/a                                   | `() => alert('Clock opened')`                                                                                                                                                                                                         |
| onFocus              | Function called when the user focuses an input.                                                                                                                                                                                                                                                                                                   | n/a                                   | `(event) => alert('Focused input: ', event.target.name)`                                                                                                                                                                              |
| onInvalidChange      | Function called when the user picks an invalid time.                                                                                                                                                                                                                                                                                              | n/a                                   | `() => alert('Invalid time')`                                                                                                                                                                                                         |
| openClockOnFocus     | Whether to open the clock on input focus. **Note**: It's recommended to use `shouldOpenClock` function instead.                                                                                                                                                                                                                                   | `true`                                | `false`                                                                                                                                                                                                                               |
| portalContainer      | Element to render the clock in using portal.                                                                                                                                                                                                                                                                                                      | n/a                                   | `document.getElementById('my-div')`                                                                                                                                                                                                   |
| required             | Whether time input should be required.                                                                                                                                                                                                                                                                                                            | `false`                               | `true`                                                                                                                                                                                                                                |
| secondAriaLabel      | `aria-label` for the second input.                                                                                                                                                                                                                                                                                                                | n/a                                   | `"Second"`                                                                                                                                                                                                                            |
| secondPlaceholder    | `placeholder` for the second input.                                                                                                                                                                                                                                                                                                               | `"--"`                                | `"ss"`                                                                                                                                                                                                                                |
| shouldCloseClock     | Function called before the clock closes. `reason` can be `"buttonClick"`, `"escape"`, `"outsideAction"`, or `"select"`. If it returns `false`, the clock will not close.                                                                                                                                                                          | n/a                                   | `({ reason }) => reason !== 'outsideAction'`                                                                                                                                                                                          |
| shouldOpenClock      | Function called before the clock opens. `reason` can be `"buttonClick"` or `"focus"`. If it returns `false`, the clock will not open.                                                                                                                                                                                                             | n/a                                   | `({ reason }) => reason !== 'focus'`                                                                                                                                                                                                  |
| value                | Input value. Note that if you pass an array of values, only first value will be fully utilized.                                                                                                                                                                                                                                                   | n/a                                   | <ul><li>Date: `new Date(2017, 0, 1, 22, 15)`</li><li>String: `"22:15:00"`</li><li>An array of dates: `[new Date(2017, 0, 1, 22, 15), new Date(2017, 0, 1, 23, 45)]`</li><li>An array of strings: `["22:15:00", "23:45:00"]`</li></ul> |

### Clock

TimePicker component passes all props to React-Clock, with the exception of `className` (you can use `clockClassName` for that instead). There are tons of customizations you can do! For more information, see [Clock component props](https://github.com/wojtekmaj/react-clock#props).

## License

The MIT License.

## Author

<table>
  <tr>
    <td >
      <img src="https://avatars.githubusercontent.com/u/5426427?v=4&s=128" width="64" height="64" alt="Wojciech Maj">
    </td>
    <td>
      <a href="https://github.com/wojtekmaj">Wojciech Maj</a>
    </td>
  </tr>
</table>
