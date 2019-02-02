import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class ValueOptions extends PureComponent {
  setValue = (value) => {
    const { setState } = this.props;

    setState({ value });
  }

  onChange = (event) => {
    const { value } = event.target;

    this.setValue(value);
  }

  render() {
    const { value } = this.props;

    return (
      <fieldset id="valueOptions">
        <legend htmlFor="valueOptions">
          Set time externally
        </legend>

        <div>
          <label htmlFor="time">
            Time
          </label>
          <input
            id="time"
            onChange={this.onChange}
            type="time"
            value={value || ''}
            step="1"
          />
          &nbsp;
          <button
            type="button"
            onClick={() => this.setValue(null)}
          >
            Clear to null
          </button>
          <button
            type="button"
            onClick={() => this.setValue('')}
          >
            Clear to empty string
          </button>
        </div>
      </fieldset>
    );
  }
}

ValueOptions.propTypes = {
  setState: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ])),
  ]),
};
