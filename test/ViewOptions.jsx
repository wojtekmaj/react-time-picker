import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class ViewOptions extends PureComponent {
  onDisabledChange = (event) => {
    const { setState } = this.props;

    const { checked } = event.target;

    setState({ disabled: checked });
  }

  render() {
    const { disabled } = this.props;

    return (
      <fieldset id="viewoptions">
        <legend htmlFor="viewoptions">
          View options
        </legend>

        <div>
          <input
            id="disabled"
            type="checkbox"
            checked={disabled}
            onChange={this.onDisabledChange}
          />
          <label htmlFor="disabled">
            Disabled
          </label>
        </div>
      </fieldset>
    );
  }
}

ViewOptions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  setState: PropTypes.func.isRequired,
};
