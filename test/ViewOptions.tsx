import React from 'react';

type ViewOptionsProps = {
  disabled: boolean;
  renderInPortal: boolean;
  setDisabled: (disabled: boolean) => void;
  setRenderInPortal: (renderInPortal: boolean) => void;
};

export default function ViewOptions({
  disabled,
  renderInPortal,
  setDisabled,
  setRenderInPortal,
}: ViewOptionsProps) {
  function onDisabledChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setDisabled(checked);
  }

  function onRenderInPortalChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;

    setRenderInPortal(checked);
  }

  return (
    <fieldset>
      <legend>View options</legend>

      <div>
        <input checked={disabled} id="disabled" onChange={onDisabledChange} type="checkbox" />
        <label htmlFor="disabled">Disabled</label>
      </div>

      <div>
        <input
          checked={renderInPortal}
          id="renderInPortal"
          onChange={onRenderInPortalChange}
          type="checkbox"
        />
        <label htmlFor="renderInPortal">Render in portal</label>
      </div>
    </fieldset>
  );
}
