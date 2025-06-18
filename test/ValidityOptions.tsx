import { useId } from 'react';

type ValidityOptionsProps = {
  maxTime?: string;
  minTime?: string;
  required?: boolean;
  setMaxTime: (maxTime: string | undefined) => void;
  setMinTime: (minTime: string | undefined) => void;
  setRequired: (required: boolean) => void;
};

export default function ValidityOptions({
  maxTime,
  minTime,
  required,
  setMaxTime,
  setMinTime,
  setRequired,
}: ValidityOptionsProps) {
  const minTimeId = useId();
  const maxTimeId = useId();
  const requiredId = useId();

  function onMinChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setMinTime(value);
  }

  function onMaxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;

    setMaxTime(value);
  }

  return (
    <fieldset>
      <legend>Minimum and maximum time</legend>

      <div>
        <label htmlFor={minTimeId}>Minimum time</label>
        <input id={minTimeId} onChange={onMinChange} step="1" type="time" value={minTime || ''} />
        &nbsp;
        <button onClick={() => setMinTime(undefined)} type="button">
          Clear
        </button>
      </div>

      <div>
        <label htmlFor={maxTimeId}>Maximum time</label>
        <input id={maxTimeId} onChange={onMaxChange} step="1" type="time" value={maxTime || ''} />
        &nbsp;
        <button onClick={() => setMaxTime(undefined)} type="button">
          Clear
        </button>
      </div>

      <div>
        <input
          checked={required}
          id={requiredId}
          onChange={(event) => setRequired(event.target.checked)}
          type="checkbox"
        />
        <label htmlFor={requiredId}>Required</label>
      </div>
    </fieldset>
  );
}
