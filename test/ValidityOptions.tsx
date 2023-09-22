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
        <label htmlFor="minTime">Minimum time</label>
        <input id="minTime" onChange={onMinChange} step="1" type="time" value={minTime || ''} />
        &nbsp;
        <button onClick={() => setMinTime(undefined)} type="button">
          Clear
        </button>
      </div>

      <div>
        <label htmlFor="maxTime">Maximum time</label>
        <input id="maxTime" onChange={onMaxChange} step="1" type="time" value={maxTime || ''} />
        &nbsp;
        <button onClick={() => setMaxTime(undefined)} type="button">
          Clear
        </button>
      </div>

      <div>
        <input
          checked={required}
          id="required"
          onChange={(event) => setRequired(event.target.checked)}
          type="checkbox"
        />
        <label htmlFor="required">Required</label>
      </div>
    </fieldset>
  );
}
