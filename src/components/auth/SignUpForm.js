import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { validate as emailValidator } from 'email-validator';

import ErrorField from '../common/ErrorField';

const validate = ({ email, password }) => {
  const errors = {};

  if (!email) errors.email = 'email is required';
  else if (!emailValidator(email)) errors.email = 'email not valid';

  if (!password) errors.password = 'password is required';
  else if (password.length < 8) errors.password = 'to short';

  return errors;
};

class SignUpForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <Field name="email" component={ErrorField} />
          <Field name="password" component={ErrorField} type="password" />
          <div>
            <input type="submit" />
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'auth',
  validate
})(SignUpForm);
