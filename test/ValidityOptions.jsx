import React from 'react';
import PropTypes from 'prop-types';

import { isTime } from '../src/shared/propTypes';

export default function ValidityOptions({
  maxTime,
  minTime,
  required,
  setState,
}) {
  function onMinChange(event) {
    const { value } = event.target;

    setState({ minTime: value || null });
  }

  function onMaxChange(event) {
    const { value } = event.target;

    setState({ maxTime: value || null });
  }

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
          onChange={onMinChange}
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
          onChange={onMaxChange}
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

ValidityOptions.propTypes = {
  maxTime: isTime,
  minTime: isTime,
  required: PropTypes.bool,
  setState: PropTypes.func.isRequired,
};
