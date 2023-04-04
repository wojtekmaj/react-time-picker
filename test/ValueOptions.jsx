import React from 'react';
import PropTypes from 'prop-types';

export default function ValueOptions({ setValue, value }) {
  function onChange(event) {
    const { value: nextValue } = event.target;

    setValue(nextValue);
  }

  return (
    <fieldset>
      <legend>Set time externally</legend>

      <div>
        <label htmlFor="time">Time</label>
        <input id="time" onChange={onChange} step="1" type="time" value={value || ''} />
        &nbsp;
        <button onClick={() => setValue(null)} type="button">
          Clear to null
        </button>
        <button onClick={() => setValue('')} type="button">
          Clear to empty string
        </button>
      </div>
    </fieldset>
  );
}

const isValue = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

const isValueOrValueArray = PropTypes.oneOfType([isValue, PropTypes.arrayOf(isValue)]);

ValueOptions.propTypes = {
  setValue: PropTypes.func.isRequired,
  value: isValueOrValueArray,
};
