import React from 'react';
import PropTypes from 'prop-types';

export default function ValueOptions({
  setState,
  value,
}) {
  function setValue(nextValue) {
    setState({ value: nextValue });
  }

  function onChange(event) {
    const { value: nextValue } = event.target;

    setValue(nextValue);
  }

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
          onChange={onChange}
          type="time"
          value={value || ''}
          step="1"
        />
        &nbsp;
        <button
          type="button"
          onClick={() => setValue(null)}
        >
          Clear to null
        </button>
        <button
          type="button"
          onClick={() => setValue('')}
        >
          Clear to empty string
        </button>
      </div>
    </fieldset>
  );
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
