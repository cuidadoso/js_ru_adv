import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SignInForm from '../auth/SignInForm';

class AuthPage extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {};

  render() {
    return (
      <div>
        <h3>Auth page</h3>
        <SignInForm />
      </div>
    );
  }
}

export default AuthPage;
