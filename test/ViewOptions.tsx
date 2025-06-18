import { useId } from 'react';

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
  const disabledId = useId();
  const renderInPortalId = useId();

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
        <input checked={disabled} id={disabledId} onChange={onDisabledChange} type="checkbox" />
        <label htmlFor={disabledId}>Disabled</label>
      </div>

      <div>
        <input
          checked={renderInPortal}
          id={renderInPortalId}
          onChange={onRenderInPortalChange}
          type="checkbox"
        />
        <label htmlFor={renderInPortalId}>Render in portal</label>
      </div>
    </fieldset>
  );
}
