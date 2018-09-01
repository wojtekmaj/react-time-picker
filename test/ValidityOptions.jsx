import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { isTime } from '../src/shared/propTypes';

export default class ValidityOptions extends PureComponent {
  onMinChange = (event) => {
    const { setState } = this.props;

    const { value } = event.target;

    setState({ minTime: value || null });
  }

  onMaxChange = (event) => {
    const { setState } = this.props;

    const { value } = event.target;

    setState({ maxTime: value || null });
  }

  render() {
    const {
      maxTime, minTime, required, setState,
    } = this.props;

    return (
      <fieldset id="ValidityOptions">
        <legend htmlFor="ValidityOptions">
          Minimum and maximum time
        </legend>

        <div>
          <label htmlFor="minTime">
            Minimum time
          </label>
          <input
            id="minTime"
            onChange={this.onMinChange}
            type="time"
            value={minTime || ''}
            step="1"
          />
          &nbsp;
          <button
            onClick={() => setState({ minTime: null })}
            type="button"
          >
            Clear
          </button>
        </div>

        <div>
          <label htmlFor="maxTime">
            Maximum time
          </label>
          <input
            id="maxTime"
            onChange={this.onMaxChange}
            type="time"
            value={maxTime || ''}
            step="1"
          />
          &nbsp;
          <button
            onClick={() => setState({ maxTime: null })}
            type="button"
          >
            Clear
          </button>
        </div>

        <div>
          <input
            id="required"
            type="checkbox"
            checked={required}
            onChange={event => setState({ required: event.target.checked })}
          />
          <label htmlFor="required">
            Required
          </label>
        </div>
      </fieldset>
    );
  }
}

ValidityOptions.propTypes = {
  maxTime: isTime,
  minTime: isTime,
  required: PropTypes.bool,
  setState: PropTypes.func.isRequired,
};
