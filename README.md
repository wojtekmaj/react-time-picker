![downloads](https://img.shields.io/npm/dt/react-time-picker.svg) ![build](https://img.shields.io/travis/wojtekmaj/react-time-picker.svg) ![dependencies](https://img.shields.io/david/wojtekmaj/react-time-picker.svg
) ![dev dependencies](https://img.shields.io/david/dev/wojtekmaj/react-time-picker.svg
) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

# React-Time-Picker
An input component for picking time for your React application.

## tl;dr
* Install by executing `npm install react-time-picker` or `yarn add react-time-picker`.
* Import by adding `import TimePicker from 'react-time-picker'`.
* Use by adding `<TimePicker />`. Use `onChange` prop for getting new values.

## Getting started

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

If you don't want to use default React-Time-Picker styling to build upon it, you can import React-Time-Picker by using `import TimePicker from 'react-time-picker/build/entry.nostyle';` instead.

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
