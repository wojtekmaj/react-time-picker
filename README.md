[![npm](https://img.shields.io/npm/v/react-time-picker.svg)](https://www.npmjs.com/package/react-time-picker) ![downloads](https://img.shields.io/npm/dt/react-time-picker.svg) [![CI](https://github.com/wojtekmaj/react-time-picker/workflows/CI/badge.svg)](https://github.com/wojtekmaj/react-time-picker/actions) ![dependencies](https://img.shields.io/david/wojtekmaj/react-time-picker.svg) ![dev dependencies](https://img.shields.io/david/dev/wojtekmaj/react-time-picker.svg) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

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

[Online demo](http://projects.wojtekmaj.pl/react-time-picker/) is also available!

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

```js
import React, { useState } from 'react';
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

If you don't want to use default React-Time-Picker and React-Clock styles, you can import React-Time-Picker without them by using `import TimePicker from 'react-time-picker/dist/entry.nostyle';` instead.

Styles loaded by the default entry file are `react-time-picker/dist/TimePicker.css` and `react-clock/dist/Clock.css`. You can copy them to your project to build your own upon them.

## User guide

### TimePicker

Displays an input field complete with custom inputs, native input and a clock.

#### Props

| Prop name            | Description                                                                                                                                                                                                  | Default value           | Example values                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------- |
| amPmAriaLabel        | `aria-label` for the AM/PM select input.                                                                                                                                                                     | n/a                     | `"Select AM/PM"`                                                                                    |
| autoFocus            | Automatically focuses the input on mount.                                                                                                                                                                    | n/a                     | `true`                                                                                              |
| className            | Class name(s) that will be added along with `"react-time-picker"` to the main React-Time-Picker `<div>` element.                                                                                             | n/a                     | <ul><li>String: `"class1 class2"`</li><li>Array of strings: `["class1", "class2 class3"]`</li></ul> |
| clearAriaLabel       | `aria-label` for the clear button.                                                                                                                                                                           | n/a                     | `"Clear value"`                                                                                     |
| clearIcon            | Content of the clear button. Setting the value explicitly to `null` will hide the icon.                                                                                                                      | (default icon)          | <ul><li>String: `"Clear"`</li><li>React element: `<ClearIcon />`</li></ul>                          |
| clockAriaLabel       | `aria-label` for the clock button.                                                                                                                                                                           | n/a                     | `"Toggle clock"`                                                                                    |
| clockClassName       | Class name(s) that will be added along with `"react-clock"` to the main React-Clock `<time>` element.                                                                                                        | n/a                     | <ul><li>String: `"class1 class2"`</li><li>Array of strings: `["class1", "class2 class3"]`</li></ul> |
| clockIcon            | Content of the clock button. Setting the value explicitly to `null` will hide the icon.                                                                                                                      | (default icon)          | <ul><li>String: `"Clock"`</li><li>React element: `<ClockIcon />`</li></ul>                          |
| closeClock           | Whether to close the clock on value selection.                                                                                                                                                               | `true`                  | `false`                                                                                             |
| disabled             | Whether the time picker should be disabled.                                                                                                                                                                  | `false`                 | `true`                                                                                              |
| disableClock         | When set to `true`, will remove the clock and the button toggling its visibility.                                                                                                                            | `false`                 | `true`                                                                                              |
| format               | Input format based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Supported values are: `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `a`. | n/a                     | `"h:m:s a"`                                                                                         |
| hourAriaLabel        | `aria-label` for the hour input.                                                                                                                                                                             | n/a                     | `"Hour"`                                                                                            |
| hourPlaceholder      | `placeholder` for the hour input.                                                                                                                                                                            | `"--"`                  | `"hh"`                                                                                              |
| isOpen               | Whether the clock should be opened.                                                                                                                                                                          | `false`                 | `true`                                                                                              |
| locale               | Locale that should be used by the time picker and the clock. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag).                                                                | User's browser settings | `"hu-HU"`                                                                                           |
| maxDetail            | How detailed time picking shall be. Can be `"hour"`, `"minute"` or `"second"`.                                                                                                                               | `"minute"`              | `"second"`                                                                                          |
| maxTime              | Maximum time that the user can select.                                                                                                                                                                       | n/a                     | <ul><li>Date: `new Date()`</li><li>String: `"22:15:00"`</li></ul>                                   |
| minTime              | Minimum date that the user can select.                                                                                                                                                                       | n/a                     | <ul><li>Date: `new Date()`</li><li>String: `"22:15:00"`</li></ul>                                   |
| minuteAriaLabel      | `aria-label` for the minute input.                                                                                                                                                                           | n/a                     | `"Minute"`                                                                                          |
| minutePlaceholder    | `placeholder` for the minute input.                                                                                                                                                                          | `"--"`                  | `"mm"`                                                                                              |
| name                 | Input name.                                                                                                                                                                                                  | `"time"`                | `"myCustomName"`                                                                                    |
| nativeInputAriaLabel | `aria-label` for the native time input.                                                                                                                                                                      | n/a                     | `"Time"`                                                                                            |
| onChange             | Function called when the user picks a valid time.                                                                                                                                                            | n/a                     | `(value) => alert('New time is: ', value)`                                                          |
| onClockClose         | Function called when the clock closes.                                                                                                                                                                       | n/a                     | `() => alert('Clock closed')`                                                                       |
| onClockOpen          | Function called when the clock opens.                                                                                                                                                                        | n/a                     | `() => alert('Clock opened')`                                                                       |
| openClockOnFocus     | Whether to open the clock on input focus.                                                                                                                                                                    | `true`                  | `false`                                                                                             |
| required             | Whether date input should be required.                                                                                                                                                                       | `false`                 | `true`                                                                                              |
| secondAriaLabel      | `aria-label` for the second input.                                                                                                                                                                           | n/a                     | `"Second"`                                                                                          |
| secondPlaceholder    | `placeholder` for the second input.                                                                                                                                                                          | `"--"`                  | `"ss"`                                                                                              |
| value                | Input value.                                                                                                                                                                                                 | n/a                     | <ul><li>Date: `new Date()`</li><li>String: `"22:15:00"`</li></ul>                                   |

### Clock

TimePicker component passes all props to React-Clock, with the exception of `className` (you can use `clockClassName` for that instead). There are tons of customizations you can do! For more information, see [Clock component props](https://github.com/wojtekmaj/react-clock#props).

## License

The MIT License.

## Author

<table>
  <tr>
    <td>
      <img src="https://github.com/wojtekmaj.png?s=100" width="100">
    </td>
    <td>
      Wojciech Maj<br />
      <a href="mailto:kontakt@wojtekmaj.pl">kontakt@wojtekmaj.pl</a><br />
      <a href="https://wojtekmaj.pl">https://wojtekmaj.pl</a>
    </td>
  </tr>
</table>
