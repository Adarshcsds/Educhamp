function InputField(props) {
  // This id is used to connect the error message with the input box.
  const errorId = props.id + '-error';

  // If there is an error, we add one more class for red border styling.
  let inputBoxClass = 'input-shell';

  if (props.error) {
    inputBoxClass = inputBoxClass + ' has-error';
  }

  return (
    <div className="field-group">
      {/* Label tells the user what this input is for. */}
      <label htmlFor={props.id}>{props.label}</label>

      {/* This wrapper keeps the icon, input box, and button in one row. */}
      <div className={inputBoxClass}>
        <span className="input-icon" aria-hidden="true">
          {props.icon}
        </span>

        <input
          id={props.id}
          name={props.name}
          type={props.type}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          aria-invalid={Boolean(props.error)}
          aria-describedby={props.error ? errorId : undefined}
        />

        {/* Action is optional. It is used for the password eye button. */}
        {props.action}
      </div>

      {/* Error text only shows when the parent form sends an error. */}
      {props.error && (
        <p className="field-error" id={errorId}>
          {props.error}
        </p>
      )}
    </div>
  );
}

export default InputField;
