import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { validate as emailValidator } from 'email-validator';

import ErrorField from '../common/ErrorField';

function validate({ firstName, email }) {
  const errors = {};

  if (!firstName) errors.password = 'first name is required';

  if (!email) errors.email = 'email is required';
  else if (!emailValidator(email)) errors.email = 'email not valid';

  return errors;
}

class NewPersonForm extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <Field name="firstName" component={ErrorField} />
          <Field name="lastName" component={ErrorField} />
          <Field name="email" component={ErrorField} />
          <div>
            <input type="submit" />
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  form: 'person',
  validate
})(NewPersonForm);
