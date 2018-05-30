import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, NavLink } from 'react-router-dom';

import { SignInForm, SignUpForm } from '../auth';

class AuthPage extends Component {
  static defaultProps = {};

  static propTypes = {};

  state = {};

  handleSignIn = (values) => {
    console.log('---', values);
  };

  handleSignUp = (values) => {
    console.log('---', values);
  };

  render() {
    return (
      <div>
        <h3>Auth page</h3>
        <NavLink to="/auth/signin" activeStyle={{ color: 'red' }}>
          sign in
        </NavLink>
        <NavLink to="/auth/signup" activeStyle={{ color: 'red' }}>
          sign up
        </NavLink>
        <Route
          path="/auth/signin"
          render={() => <SignInForm onSubmit={this.handleSignIn} />}
        />
        <Route
          path="/auth/signup"
          render={() => <SignUpForm onSubmit={this.handleSignUp} />}
        />
      </div>
    );
  }
}

export default AuthPage;
