import React from 'react';
import PropTypes from 'prop-types';

function ErrorField(props) {
  const {
    input,
    type,
    meta: { error, touched }
  } = props;
  const errorText = touched &&
    error && <div style={{ color: 'red' }}>{error}</div>;
  return (
    <div>
      <label>{input.name}</label>
      <input {...input} type={type} />
      {errorText}
    </div>
  );
}

ErrorField.propTypes = {};
ErrorField.defaultProps = {};

export default ErrorField;
