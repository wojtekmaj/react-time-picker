import React from 'react';
import PropTypes from 'prop-types';

const allViews = ['hour', 'minute', 'second'];

function upperCaseFirstLetter(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export default function MaxDetailOptions({ maxDetail, setState }) {
  function onChange(event) {
    const { value } = event.target;

    setState({ maxDetail: value });
  }

  return (
    <fieldset id="maxdetailoptions">
      <legend htmlFor="maxdetailoptions">
        Maximum detail
      </legend>

      {allViews.map(view => (
        <div key={view}>
          <input
            checked={maxDetail === view}
            id={`max-${view}`}
            name="maxDetail"
            onChange={onChange}
            type="radio"
            value={view}
          />
          <label htmlFor={`max-${view}`}>
            {upperCaseFirstLetter(view)}
          </label>
        </div>
      ))}
    </fieldset>
  );
}

MaxDetailOptions.propTypes = {
  maxDetail: PropTypes.oneOf(allViews).isRequired,
  setState: PropTypes.func.isRequired,
};
