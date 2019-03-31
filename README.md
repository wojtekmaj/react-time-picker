![downloads](https://img.shields.io/npm/dt/react-time-picker.svg) ![build](https://img.shields.io/travis/wojtekmaj/react-time-picker/master.svg) ![dependencies](https://img.shields.io/david/wojtekmaj/react-time-picker.svg
) ![dev dependencies](https://img.shields.io/david/dev/wojtekmaj/react-time-picker.svg
) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

# React-Time-Picker

A time picker for your React app.

* Supports virtually any language
* No moment.js needed

## tl;dr
* Install by executing `npm install react-time-picker` or `yarn add react-time-picker`.
* Import by adding `import TimePicker from 'react-time-picker'`.
* Use by adding `<TimePicker />`. Use `onChange` prop for getting new values.

## Demo

Minimal demo page is included in sample directory.

[Online demo](http://projects.wojtekmaj.pl/react-time-picker/) is also available!

## Looking for a date picker or a datetime picker?

React-Time-Picker will play nicely with [React-Date-Picker](https://github.com/wojtekmaj/react-date-picker) and [React-DateTime-Picker](https://github.com/wojtekmaj/react-datetime-picker). Check them out!

## Getting started

### Compatibility

Your project needs to use React 16 or later. If you use older version of React, please refer to the table below to find suitable React-Time-Picker version.

|React version|Newest supported React-Time-Picker|
|----|----|
|>16.0|latest|
|>15.0|2.1.1|

#### Legacy browsers

If you need to support legacy browsers like Internet Explorer 10, you will need to use [Intl.js](https://github.com/andyearnshaw/Intl.js/) or another Intl polyfill along with React-Date-Picker.

### Installation

Add React-Time-Picker to your project by executing `npm install react-time-picker` or `yarn add react-time-picker`.

### Usage

Here's an example of basic usage:

```js
import React, { Component } from 'react';
import TimePicker from 'react-time-picker';

class MyApp extends Component {
  state = {
    time: '10:00',
  }

  onChange = time => this.setState({ time })

  render() {
    return (
      <div>
        <TimePicker
          onChange={this.onChange}
          value={this.state.time}
        />
      </div>
    );
  }
}
```

### Custom styling

If you don't want to use default React-Time-Picker styling to build upon it, you can import React-Time-Picker by using `import TimePicker from 'react-time-picker/dist/entry.nostyle';` instead.

## User guide

### TimePicker

Displays an input field complete with custom inputs, native input and a clock.

#### Props

|Prop name|Description|Example values|
|----|----|----|
|clockClassName|Defines class name(s) that will be added along with "react-clock" to the main React-Clock `<time>` element.|<ul><li>String: `"class1 class2"`</li><li>Array of strings: `["class1", "class2 class3"]`</li></ul>|
|clockIcon|Defines the content of the clock button. Setting the value explicitly to `null` will hide the icon.|<ul><li>String: `"Clock"`</li><li>React element: `<ClockIcon />`</li></ul>|
|className|Defines class name(s) that will be added along with "react-time-picker" to the main React-Time-Picker `<div>` element.|<ul><li>String: `"class1 class2"`</li><li>Array of strings: `["class1", "class2 class3"]`</li></ul>|
|clearIcon|Defines the content of the clear button. Setting the value explicitly to `null` will hide the icon.|<ul><li>String: `"Clear"`</li><li>React element: `<ClearIcon />`</li></ul>|
|disabled|Defines whether the time picker should be disabled. Defaults to false.|`true`|
|disableClock|Defines whether the clock should be disabled. Defaults to false.|`true`|
|format|Defines input format based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table). Supported values are: `H`, `HH`, `h`, `hh`, `m`, `mm`, `s`, `ss`, `a`.|`"h:m:s a"`|
|isOpen|Defines whether the clock should be opened. Defaults to false.|`true`|
|locale|Defines which locale should be used by the time picker and the clock. Can be any [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag). Defaults to user's browser settings.|`"hu-HU"`|
|maxDetail|Defines how detailed time picking shall be. Can be "hour", "minute" or "second". Defaults to "minute".|`"second"`|
|maxTime|Defines maximum time that the user can select.|<ul><li>Date: `new Date()`</li><li>String: `"22:15:00"`</li></ul>|
|minTime|Defines minimum date that the user can select.|<ul><li>Date: `new Date()`</li><li>String: `"22:15:00"`</li></ul>|
|name|Defines input name. Defaults to "time".|`"myCustomName"`|
|onChange|Function called when the user picks a valid time.|`(value) => alert('New time is: ', value)`|
|onClockClose|Function called when the clock closes.|`() => alert('Clock closed')`|
|onClockOpen|Function called when the clock opens.|`() => alert('Clock opened')`|
|required|Defines whether date input should be required. Defaults to false.|`true`|
|value|Defines the value of the input.|<ul><li>Date: `new Date()`</li><li>String: `"22:15:00"`</li></ul>|

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
      <a href="http://wojtekmaj.pl">http://wojtekmaj.pl</a>
    </td>
  </tr>
</table>
